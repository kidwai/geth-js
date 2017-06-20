var cp = require('child_process');
var fs = require('fs');
var Web3Mgr     = require('web3-manager');

module.exports = function (geth) {
	return function () {
	return new Promise ((resolve, reject) => {
		var spawnargs = parseOpts(geth.options);
		var out = fs.openSync(geth.options.datadir + '/geth.log', 'a');
		var child = cp.spawn('geth', spawnargs, {
			detached: true,
			stdio: [ 'inherit', out, out ]
		});

		geth.pid = child.pid;

		setTimeout(function () {
			if (geth.options.rpc) {
				var host = `http://${geth.options.rpcaddr}:${geth.options.rpcport}`
				geth.rpc = Web3Mgr.create('rpc', host);
			}
			

			// wait for the ipc endpoint to open
			if (!geth.options.ipcdisable) {
				var host = geth.options.ipcpath || path.join(geth.options.datadir, 'geth.ipc');
				geth.ipc = Web3Mgr.create('ipc', host);
			}

			resolve(geth);
		}, 3*1000);


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
	})
	}
}