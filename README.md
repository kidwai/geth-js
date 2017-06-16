# geth-js

A simple Node.js controller for go-ethereum ('geth').


### Install


```
$ npm install geth-js
```


### Usage


```
var Geth = require('geth-js');


geth = new Geth({
	rpc: false,
	ipcpath: '/home/momo/.geth.ipc'
})

geth.onBlock = function (blockHash) {
	var block = geth.rpc.eth.getBlock(blockHash);
	console.log(block);
}


geth.start();
```