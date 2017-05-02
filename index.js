module.exports = Geth;

var fs 	   					= require('fs');
var path 	   				= require('path');
var cp       				= require('child_process');
var defaults    			= require('./config/options/defaults');

/** @constructor  Geth  -  Creates a wrapper instance around go-ethereum 
 *
 *	@param {object} [opts]  - An object containing any of the ordinary command-line paraters. 
 *
 *
 */
function Geth (opts) {
	this.state = 'stopped';
	this.options = opts || defaults;
	for (var key in defaults) {
		if (!(key in this.options)) {
			this.options[key] = defaults[key];
		}
	}

	this.newAccount = function(pass) {
		fs.writeFileSync('/tmp/pass', pass);
		var result = cp.execSync(`geth --datadir ${this.options.datadir} --password /tmp/pass account new`).toString('utf-8');
		return '0x' + result.split('{')[1].split('}')[0];
		fs.unlinkSync('/tmp/pass');
	}

	this.accounts = function () {
		return cp.execSync(`geth --datadir ${this.options.datadir} account list`)
					   .toString('utf-8')
					   .split('\n')
					   .slice(0, -1)
					   .map(line => '0x' + line.split('{')[1].split('}')[0]); 
	}
}



Geth.prototype.init = function (genesis) {
		if (typeof genesis === 'string') {
			try {genesis = require(`./config/genesis/${genesis}`)}
			catch (err) { console.log(err)}
		}
		else if (typeof genesis === 'object') {
			fs.writeFileSync('/tmp/genesis.json', JSON.stringify(genesis, 2, null));
			var result = cp.execSync('geth --datadir ' + this.datadir +
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
			 parseOptions(this.options), {stdio: 'inherit'});
	child.on('data', (data) =>{
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
	return true;
}


function parseOptions(opts) {
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
