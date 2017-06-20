var cp = require('child_process');
var fs = require('fs');

module.exports = function (datadir) {
	return {
		new: function (pass) {
			var datadir = typeof datadir !== 'undefined' ? `--datadir ${datadir}` : '';

			fs.writeFileSync('/tmp/pass', pass);

			try {
				var result = cp.execSync(`geth --password /tmp/pass ${datadir} account new`).toString('utf-8');
				result = '0x' + result.split('{')[1].split('}')[0].replace('0x', '');
			} catch (err) {
				console.log(err.msg);
			}

			fs.unlinkSync('/tmp/pass');
			return result;
		},
		list: function (datadir) {
			if (typeof datadir !== 'undefined')
				datadir = `--datadir ${datadir}`;

			var result = cp.execSync(`geth --datadir ${datadir} account list`).toString('utf-8');
			result = result.split('\n').map(row => '0x' + row.split('{')[1].split('}')[0].replace('0x', ''));
			return result;
		}
	}
}