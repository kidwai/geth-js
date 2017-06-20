module.exports = Geth;

var fs			= require('fs');
var account     = require('./lib/account');
var init 		= require('./lib/init');
var start       = require('./lib/start');

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

	this.account = account(this.options.datadir);
	this.init = init(this.options.datadir);	
	this.start = start(this);
}