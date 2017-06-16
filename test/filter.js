var Geth = require('..');
var geth = new Geth({datadir: '/mnt/ssd/.ethereum'});

geth.start().then(function () {
	geth.rpc.eth.filter('latest', function (err, block) {
		if (!err) {
			var block = geth.rpc.eth.getBlock(block);
			var txs   = block.transactions.map(tx => geth.rpc.eth.getTransaction(tx));
			var volume = 0;
			txs.forEach((tx) => {volume += parseInt(txs.value)});
			console.log(block.number,block.size,volume,txs.length);
		}
	})
})