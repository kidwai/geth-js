var fs			= require('fs');
var account     = require('./lib/account');
var init 		= require('./lib/init');
var start       = require('./lib/start');
var list 		= require('./lib/list');

const defaults  = require('./config/options');
const Genesis   = require('./config/genesis');

Geth = {
	create: create,
	nodes: []
}



function create(options) {
	var geth = {
		options: options
	}

	if (!fs.existsSync(options.datadir)) fs.mkdirSync(options.datadir);

	geth.account = account(options.datadir);
	geth.init = init(options.datadir);
	geth.start = start(geth);
	return geth;
}


function update() {
	list().then((results) => {
		Geth.nodes = results.map(function (node) {
			var output = {
				pid: node.pid	
			};
			var options = {}
			var args = node.arguments;
			for (var i = 0 ; i < args.length - 1; i++) {
				if (args[i].startsWith('--')) {
					var arg = args[i].replace('--', '');
					if (args[i+1].startsWith('--'))
						output[args[i]] = true;
					else 
						output[args[i]] = args[++i];
				}
			}
			return output;
		});
	});
}

setInterval(update, 5000);

module.exports = Geth;