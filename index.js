module.exports = Geth;

var fs			= require('fs');
var path 	   	= require('path');
var ps 			= require ('ps-node');
var cp       	= require('child_process');
var Web3Mgr     = require('web3-manager');

const defaults  = require('./config/options');
const Genesis   = require('./config/genesis');


function Geth (options) {
	this.options = options || {};
	for (var type in defaults) {
		for (var option in defaults[type]) {
			this.options[option] = this.options[option] || defaults[type][option].value;	
		}
	}

	if (!fs.existsSync(this.options.datadir))
		fs.mkdir(this.options.datadir);

	this.start = function () {start(this)};
	this.onBlock = null;

}



function start (geth) {

	var spawnargs = parseOpts(geth.options);
	var out = fs.openSync(geth.options.datadir + '/geth.log', 'a');
	var child = cp.spawn('geth', spawnargs, {
		detached: true,
		stdio: [ 'inherit', out, out ]
	});

	geth.pid = child.pid;

	if (geth.options.rpc) {
		var host = `http://${geth.options.rpcaddr}:${geth.options.rpcport}`
		geth.rpc = Web3Mgr.create('rpc', host);
		if (geth.onBlock) geth.rpc.eth.filter('latest').watch(geth.onBlock)
	}

	// wait for the ipc endpoint to open
	if (!geth.options.ipcdisable) {
		var host = geth.options.ipcpath || path.join(geth.options.datadir, 'geth.ipc');
			setTimeout(function () {
				geth.ipc = Web3Mgr.create('ipc', host);
			}, 5000);
		}

	child.on('close', function (code) {
		delete geth.pid;
	});



	child.unref();

	geth.stop = function () {
		var pid = geth.pid;
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


	return geth;
}



	
Geth.init = function (genesis) {
	if (typeof genesis === 'string') 
		genesis = Genesis[genesis];

	fs.writeFileSync('/tmp/genesis.json',
					JSON.stringify(genesis, 2, null));

	var result = cp.execSync(`geth --datadir ${this.options.datadir} init /tmp/genesis.json`)
				   .toString('utf-8');

    console.log(result);
}




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