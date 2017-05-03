const HOME = process.env.HOME;
const path = require('path');

module.exports = {
		datadir: HOME + '/.ethereum',
		keystore: __dirname.replace('options', 'keystore'),
	 	unlock: '0,1,2,3,4',
	 	password: __dirname.replace('options', 'keystore/pass'),
	 	autodag: true,
		ipcpath: HOME + '/.ethereum/geth.ipc',
		ipcapi: 'admin,debug,shh,eth,miner,net,personal,txpool,web3',
		rpc: true,
		rpccorsdomain: '.',
		rpcaddr: 'localhost',
		rpcport: 8545,
		networkid: 12345
}
