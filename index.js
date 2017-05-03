module.exports = Geth;

var fs						= require('fs');
var path 	   				= require('path');
var cp       				= require('child_process');
var defaults    			= require('./config/settings/defaults');

/** @constructor  Geth  -  Creates a wrapper instance around go-ethereum 
 *
 *	@param {object} [opts]  - An object containing any of the ordinary command-line paraters. 
 *
 *
 */
function Geth (opts) {
	this.state = 'stopped';
	this.settings = opts || defaults;
	for (var key in defaults) {
		if (!(key in this.settings)) {
			this.settings[key] = defaults[key];
		}
	}

	this.newAccount = function(pass) {
		fs.writeFileSync('/tmp/pass', pass);
		var result = cp.execSync(`geth --datadir ${this.settings.datadir} --password /tmp/pass account new`).toString('utf-8');
		return '0x' + result.split('{')[1].split('}')[0];
		fs.unlinkSync('/tmp/pass');
	}

	this.listAccounts = function () {
		return cp.execSync(`geth --datadir ${this.settings.datadir} account list`)
					   .toString('utf-8')
					   .split('\n')
					   .slice(0, -1)
					   .filter((line) => {return line.startsWith("Account #")})
					   .map(line => '0x' + line.split('{')[1].split('}')[0]); 
	}
	this.start = this.start;
	this.init = this.init;
}



Geth.prototype.init = function (genesis) {
		if (typeof genesis === 'string') {
			try {genesis = require(`./config/genesis/${genesis}`)}
			catch (err) { console.log(err)}
		}
		else if (typeof genesis === 'object') {
			fs.writeFileSync('/tmp/genesis.json', JSON.stringify(genesis, 2, null));
			var result = cp.execSync('geth --datadir ' + this.settings.datadir +
				     ' init /tmp/genesis.json').toString('utf-8');			
			console.log(result);
			return true;
		}
		else {
			console.log(`error: invalid type '${typeof genesis}' for genesis`);
			return false;
		}
}

Geth.prototype.start = function () {
	child =	cp.spawn('geth', 
			 parseargv(this.settings));

	child.stderr.on('data', (data) =>{
		data = data.toString('utf-8');
		if (data.match(/enode/)) {
			this.settings.enode = 'enode' + data.split('enode')[1].replace('\n', '');
		}
		if (data.match(/ IPC endpoint opened: /)) 
			this.settings.ipcpath = data.split(' ')[5]

		if (data.match(/ HTTP endpoint opened: /)) {
			var host = data.split(' ')[5];
			this.settings.rpc = true;
			this.settings.rpcport = host.split(':')[1]
			this.settings.rpcaddr = host.split(':')[0].split('http://')[1]
		}
		fs.appendFileSync(this.settings.datadir + '/geth.log', data);
		this.state = 'running';		
	});
	child.on('exit', (code) => {
		this.state = 'terminated';
		delete this.stop;
	});
	child.on('err', (err) => {
		console.log(`error: ${err}`);
	});
	this.stop = () => {
		 return (child.kill('SIGHUP', {stdio: 'inherit'}))
	}
	return child.pid;
}


function parseargv(opts) {
	var args = [];
	for (var key in opts) {
		if (opts[key] === null) continue;
		if (String(opts[key]) === 'true') {
			args.push('--' + key);
			continue;
		} else if (String(opts[key]) === 'false')
			continue;

		args.push('--' + key);
		args.push(opts[key]);
	}
	return args;
}
