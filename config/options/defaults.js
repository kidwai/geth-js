const HOME = process.env.HOME;
const SOLC = require('child_process').execSync('which solc')
                                     .toString('utf-8')
                                     .replace('\n', '');


module.exports =
{
  datadir: HOME + '/.ethereum',
  keystore: HOME + '/.ethereum/keystore',
  networkid: 1,
  olympic: false,
  testnet: false,
  dev: false,
  identity: 'default',
  fast: false,
  lightkdf: false,
  cache: 128,
  unlock: null,
  password: null,
  rpc: true,
  rpcaddr: 'localhost',
  rpcport: 8545,
  rpcapi: 'eth,net,web3',
  rpccorsdomain: '.',
  ws: 'false',
  ipcpath: 'geth.ipc',
  bootnodes: null,
  port: 30303,
  maxpeers: 25,
  maxpendpeers: 0,
  nat: 'any',
  nodiscover: 'false',
  nodekey: null,
  nodekeyhex: null,
  mine: false,
  minerthreads: 4,
  autodag: false,
  etherbase: null,
  targetgaslimit: 4712388,
  gasprice: 20000000000,
  extradata: null,
  solc: SOLC 
}
