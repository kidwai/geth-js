// Returns a list of running Geth processes
var ps = require('ps-node');
module.exports = function () {
	return new Promise ((resolve, reject) => {
		ps.lookup({command: "geth"}, function (err, result) {
			if (!err) resolve(result);
			else reject(err);
		});
	})
}