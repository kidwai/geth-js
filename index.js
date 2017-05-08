/**
  * geth-js
  * 
  * @author Mohammad Kidwai
  * @license MIT 
  *
  */
module.exports = Geth;

var fs			= require('fs');
var path 	   	= require('path');
var ps 			= require('ps-node');
var cp       	= require('child_process');
var Web3 		= require('web3');
const defaults  = require('./config/options');
const Genesis   = require('./config/genesis');
/** 
 * Creates a wrapper instance around a geth process 
 * @constructor
 *
 * @param {object} 		options  			- 	Options corresponding to the command-line flags for geth
 * @param {object} 		options.ethereum 	- 	Ethereum options
 * @param {object} 		options.ethash 		- 	Ethash options
 * @param {object} 		options.performance - 	Performance turning options
 * @param {object}  	options.account 	- 	Account options
 * @param {object}     	options.api 		- 	API options
 * @param {object}		options.networking 	- 	Networking options
 * @param {object}		options.miner  		- 	Miner options
 * @param {object} 		options.gasprice 	- 	Gas price oracle options
 * @param {object} 		options.vm 			- 	Virtual machine options
 * @param {object} 		options.debug 		- 	Logging and debugging options
 *
 */
function Geth (options) {
	this.options = options || {};
	for (var type in defaults) {
		for (var option in defaults[type])
			this.options[option] = this.options[option] || defaults[type][option].value;	
	}

	this.start = this.start;
	this.stop = this.stop;
	this.init = this.init;
	this.account = {
		new: (pass) => {
			fs.writeFileSync('/tmp/pass', pass);
			var result = cp.execSync(`geth --datadir ${this.options.datadir} --password /tmp/pass account new`).toString('utf-8');
			return '0x' + result.split('{')[1].split('}')[0];
			fs.unlinkSync('/tmp/pass');	
		},
		list: () => {
			return cp.execSync(`geth --datadir ${this.options.datadir} account list`)
						   .toString('utf-8')
						   .split('\n')
						   .slice(0, -1)
						   .filter((line) => {return line.startsWith("Account #")})
						   .map(line => '0x' + line.split('{')[1].split('}')[0]); 
			
		}
	}

}

Geth.new = function (options) {
	var geth = typeof options === 'undefined' ? 
				new Geth() : new Geth(options); 
	Geth.nodes.push(geth);
}




Geth.prototype.start = function () {
	child =	cp.spawn('geth', 
			 parseOpts(this.options));


	child.stderr.on('data', (data) =>{
		data = data.toString('utf-8');
		if (data.match(/enode/)) {
			this.options.enode = 'enode' + data.split('enode')[1].replace('\n', '');
		}
		if (data.match (/HTTP/)) {
			this.rpc.setProvider(new Web3.providers.HttpProvider('http' + data.split('http')[1].replace('\n', '')));
		}
		if (data.match(/IPC/)) {
			this.ipc.setProvider(new Web3.providers.IpcProvider(this.options.ipcpath, new net.Socket()));
			extend(this);	
		}
		fs.appendFileSync(path.join(this.options.datadir,'geth.log'), data);
		this.state = 'running';
	});

	child.on('exit', (code) => {
		delete this.options.enode;
		delete this.stop;
		this.state = 'terminated';
	});
	child.on('err', (err) => {
		console.log(`error: ${err}`);
	});
}

Geth.prototype.init = function (genesis) {
	if (typeof genesis === 'string') 
		genesis = Genesis[genesis];

	fs.writeFileSync('/tmp/genesis.json', JSON.stringify(genesis, 2, null));
		var result = cp.execSync('geth --datadir ' + this.options.datadir +
							     ' init /tmp/genesis.json').toString('utf-8');			
    console.log(result);
}


Geth.prototype.ipc = new Web3();
Geth.prototype.rpc = new Web3();




Geth.prototype.stop = function () {
	ps.kill(this.pid, function (err, result) {
		if (!err) {
			console.log("Stopped geth instance", geth.pid);
		} else {	
			console.log(err);
		}
	})
}








listNodes().then((nodes) => {
	nodes.forEach((node) => {
		node.rpc.setProvider(new Web3.providers.HttpProvider('http://' + node.options.rpcaddr + ':' + node.options.rpcport));
		node.ipc.setProvider(new Web3.providers.IpcProvider(node.options.ipcpath, new net.Socket()));
		extend(node);
	})
	Geth.nodes = nodes;
});

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





function listNodes () {
	return new Promise((resolve, reject) => {
		ps.lookup("geth", function (err, result) { 
			if(!err) {
				var results = result.filter((item)=>{return item.command === "geth"});
				for (var i = 0 ; i < results.length; i++) {
					var item = results[i];
					var argv = item.arguments;
					delete item.arguments;
					item.client = item.command;
					delete item.command;
					item.options = {};
					for (var j = 0 ; j < argv.length; j++) {
						if (argv[j].startsWith('--')) {
							var arg = argv[j].replace('--', '');
							item.options[arg] = 
								j+1 < argv.length && !argv[j+1].startsWith('--') ?
									item.options[arg] = argv[j+1] :
									item.options[arg] = true;
						}
					}
					if (item.options.rpc) {
						item.options.rpcport = item.options.rpcport || 8545;
						item.options.rpcaddr = item.options.rpcaddr || 'localhost'
						item.options.rpcpapi = item.options.rpcapi|| 'web3,eth,net'
						item.options.rpcapi = item.options.rpcapi.split(',');
					}
					if (!item.options.port)
						item.options.port = 30303;
					if (!item.options.datadir)
						item.options.datadir = path.join(process.env.HOME, '.ethereum')
					if (!item.options.ipcdisable) {
						item.options.ipcpath = item.options.ipcpath || path.join(item.options.datadir, 'geth.ipc')
					}
					if (item.options.bootnodes)
						item.options.bootnodes = item.options.bootnodes.split(',');
					results[i] = new Geth(item.options);
					results[i].pid = item.pid;
					results[i].state = 'running';
					if (!results[i].options.ipcdisable)
						extend(results[i]);
				}
				resolve(results);
			} else {
				reject(err);
				console.log("Error listing active geth nodes");
			}
		});
		
	})
}

function start(spawnargs) {
	var child = cp.spawn('geth', spawnargs);
	child.on('data', (data) => {
		delete this.stop;
	});
}

function stop(pid) {
	ps.kill(pid, function (err, result) {
		if (!err) {
			console.log(result);
		} else {
			console.log("error stopping process", pid);
		}
	});
}


function extend(geth) {
	geth.ipc._extend({
				property: 'miner',
				methods: [
					new geth.ipc._extend.Method({
						name: 'start',
						call: 'miner_start',
						params: 1,
						inputFormatter: [parseInt],
						outputFormatter: (val) => {return String(val)}
					}),
					new geth.ipc._extend.Method({
						name: 'stop',
						call: 'miner_stop',
						params: 1,
						inputFormatter: [parseInt],
						outputFormatter: (val) => {return String(val)}
					})
				]
			});
			geth.miner = {
				start: function (n) {
					n = n || 8;
					geth.ipc.miner.start(function (err, result) {
						if (!err) {
							console.log(result);
						} else {
							console.log(err);
						}
					})
				},
				stop: function () {
					geth.ipc.miner.stop(function (err, result) {
						if (!err) {
							console.log(result);
						} else {
							console.log(err);
						}
					})
				},
				mine: function (txHash) {
					return new Promise ((resolve, reject) => {
						geth.ipc.miner.start(8, function (err, result) {
							if (err) reject(err);
							else {
								var filter = geth.rpc.eth.filter('latest');
								filter.watch(function (err, block) {
									if (err) {
										filter.stopWatching();
										reject(err);
									} else {
										var block = geth.rpc.eth.getTransactionReceipt(txHash,
											function (err, result) {
												if (!err) {
													if (result.blockNumber) {
														geth.ipc.miner.stop((err, result)=>{
															if (!err) console.log(result);
															else console.log(err);
														})
														filter.stopWatching();
														resolve(result);
													}
												}
											})
									}
								})
							}
						})
					})
				}
			}
}