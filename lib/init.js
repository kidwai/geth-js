var fs = require('fs');
var cp = require('child_process');



module.exports = function (datadir) {
	return function (genesis) {
		var datadir = typeof datadir !== 'undefined' ? `--datadir ${datadir}` : '';
		fs.writeFileSync('/tmp/genesis', JSON.stringify(genesis));
		var call = `geth ${datadir} init /tmp/genesis`;

		try {
			var result = cp.execSync(call).toString('utf-8');
			return true;
		} catch (err) {
			console.log(err.msg);
			return false;
		}
	}
}