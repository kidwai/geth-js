module.exports = Geth;

var fs			= require('fs');
var path 	   	= require('path');
var ps 			= require('ps-node');
var cp       	= require('child_process');
var net 		= require('net');
var Web3 		= require('web3');

const defaults  = require('./config/options');
const Genesis   = require('./config/genesis');



function Geth (options) {
	this.options = options || {};
	for (var type in defaults) {
		for (var option in defaults[type])
			this.options[option] = this.options[option] || defaults[type][option].value;	
	}

	this.start = function () {
			var spawnargs = parseOpts(this.options);
			var out = fs.openSync(this.options.datadir + '/geth.log', 'a');

			var child = cp.spawn('geth', spawnargs, {
	  			detached: true,
	  			stdio: [ 'inherit', out, out ]
			});
			this.pid = child.pid;


			if (this.options.rpc) {
				this.rpc.setProvider(new Web3.providers.HttpProvider(
									`http://${this.options.rpcaddr}:${this.options.rpcport}`));
			}



			child.on('close', (code) => {
				delete this.pid;
			});

			child.on('error', (err) => {
				console.log(`error running geth process`);
				delete this.pid;
			});


			child.unref();

			// wait for the ipc endpoint to open
			if (!this.options.ipcdisable) {
				setTimeout(() => {
					this.ipc.setProvider(new Web3.providers.IpcProvider(
										this.options.ipcpath, new net.Socket()));
					this.ipc._extend({
								property: 'miner',
								methods: [
									new this.ipc._extend.Method({
										name: 'start',
										call: 'miner_start',
										params: 1,
										inputFormatter: [parseInt]
									}),
									new this.ipc._extend.Method({
										name: 'stop',
										call: 'miner_stop',
										params: 1,
										inputFormatter: [parseInt]
									})
								]
					});

					this.ipc._extend({
						property: 'admin',
						methods: [
							new this.ipc._extend.Method({
								name: 'addPeer',
								call: 'admin_addPeer',
								params: 1,
								outputFormatter: (val) => {return String(val)}
							}),
							new this.ipc._extend.Method({
								name: 'nodeInfo',
								call: 'admin_nodeInfo',
								params: 0
							}),
							new this.ipc._extend.Method({
								name: 'peers',
								call: 'admin_peers',
								params: 0
							})
						]
					})

					this.ipc._extend({
						property: 'personal',
						methods: [
							new this.ipc._extend.Method({
								name: 'listAccounts',
								call: 'personal_listAccounts',
								params: 0
							}),
							new this.ipc._extend.Method({
								name: 'newAccount',
								call: 'personal_newAccount',
								params: 1
							}),
							new this.ipc._extend.Method({
								name: 'unlockAccount',
								call: 'personal_unlockAccount',
								params: 3,
								inputFormatter: [null,null,parseInt]
							})
						]
					})

					this.ipc._extend({
						property: 'txpool',
						methods: [
							new this.ipc._extend.Method({
								name: 'content',
								call: 'txpool_content',
								params: 0
							}),
							new this.ipc._extend.Method({
								name: 'status',
								call: 'txpool_status',
								params: 0
							})
						]
					});
					this.ipc.admin.nodeInfo((err, data) => {
						if (!err) {
							this.enode = data.enode;
						}
					})

					this.accounts = function (i) {
						var accounts = this.rpc.eth.accounts;
						if (typeof i === 'undefined')
							return accounts;
						else
							return accounts[i];
					}


					this.txpool = function () {
						var result = {};
						return new Promise((resolve, reject) => {
							this.ipc.txpool.status((err, data) => {
								if (err) reject(err);
								else {
									result.status = data;
									this.ipc.txpool.content((err, data) => {
										if (err) reject(err)
										else {
											result.content = data || err;
											resolve(result);
										}
									});
								}
							})
						})
					}

					this.connect = function (enode) {
						return new Promise ((resolve, reject) => {
							this.ipc.admin.addPeer(enode, (err, result) => {
										if (err) reject (err);
										else resolve(result);
							})
						})
					}

					 this.peers = function () {
						return new Promise ((resolve, reject) => {
							this.ipc.admin.peers((err, data) => {
								if (err) reject(err);
								else resolve(data);
							})
						})
					}

					this.newAccount = function  (pass) {
						return new Promise ((resolve, reject) => {
							this.ipc.personal.newAccount(pass, (err, address) => {
								if (err) reject(err);
								else resolve(address);
							})
						})
					}
					
					this.unlockAccount = function (address, pass, duration) {
						return new Promise((resolve, reject) => {
							this.ipc.personal.unlockAccount (address, pass, duration, (err, result) => {
								if (!err) resolve(result);
								else reject(err);
							});
						})
					}

					this.startMiner = function (n) {
						var n = n || 8;
						return new Promise ((resolve, reject) => {
							this.ipc.miner.start(n, (err, result) => {
								if (err) reject(err);
								else resolve(result);
							})
						})
					}

					this.stopMiner = function (n) {
						var n = n || 8;
						return new Promise ((resolve, reject) => {
							this.ipc.miner.stop(n, (err, result) => {
								if (err) reject(err);
								else resolve(result);
							})
						})
					}


					this.mine = function (txHash) {
						var geth = this;
						return new Promise ((resolve, reject) => {						
							if (!geth.rpc.eth.mining)
								geth.startMiner();
							var filter = geth.rpc.eth.filter('latest');
							filter.watch(function (err, block) {
								if (!err) {
									if (typeof block !== 'null') {
										var block = geth.rpc.eth.getBlock('latest');
										var receipt = geth.rpc.eth.getTransactionReceipt(txHash);
										if (typeof receipt !== 'undefined') {
											geth.txpool().then((result) => {
												if (result.status.pending === '0x0' &&
													result.status.queued === '0x0') {
													filter.stopWatching();
													geth.stopMiner();
												}
												resolve(receipt);
											})
										}
									}
								}
							})
						})
					}
				}, 3000);
			}
	}





	this.stop = function () {
		var pid = this.pid;
		if (typeof pid === 'undefined') {
			console.log('error: geth instance is not running')
		} else {
			ps.kill(pid, function (err, result) {
				if (!err) {
					console.log("Stopped geth instance", pid);
				} else {	
					console.log(err);
				}
			})		
		}
	}
	
	this.init = function (genesis) {
		if (typeof genesis === 'string') 
			genesis = Genesis[genesis];

		fs.writeFileSync('/tmp/genesis.json',
						JSON.stringify(genesis, 2, null));

		var result = cp.execSync(`geth --datadir ${this.options.datadir} init /tmp/genesis.json`)
					   .toString('utf-8');

	    console.log(result);
	}
}


Geth.prototype.ipc = new Web3();
Geth.prototype.rpc = new Web3();



function parseOpts (options) {
	var args = [];
	for (var option in options) {
		var value = options[option];
		if (value === null) continue;
		if (typeof value === 'object' && typeof value.length !== 'undefined') {
			if (value.length === 0)
				continue;
			value = value.join(',');
		}
		if (String(value) === 'false') 
			continue;
		else if (String(value) === 'true') {
			args.push('--' + option);
			continue;
		}  else if (option === 'trie_cache_gens') {
			option = 'trie-cache-gens';
		}
		args.push('--' + option);
		args.push(value);
	}
	return args;
}