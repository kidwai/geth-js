const HOME = process.env.HOME;
module.exports = { 
  datadir: { 
    default: HOME + '/.ethereum',
    description: 'Data directory for the databases and keystore'
  },
  keystore: { 
    default: HOME + '/.ethereum/keystore',
    description: 'Directory for the keystore' },
  networkid: 
   { default: 1,
     description: 'Network identifier (integer, 0=Olympic, 1=Frontier, 2=Morden)'},
  olympic: 
   { default: false,
     description: 'Olympic network: pre-configured pre-release test network' },
  testnet: 
   { default: false,
     description: 'Morden network: pre-configured test network with modified starting nonces (replay protection)' },
  dev: 
   { default: false,
     description: 'Developer mode: pre-configured private network with several debugging flags' },
  identity: { default: '', description: 'Custom node name' },
  fast: 
   { default: false,
     description: 'Enable fast syncing through state downloads' },
  lightkdf: 
   { default: false,
     description: 'educe key-derivation RAM & CPU usage at some expense of KDF strength' },
  cache: 
   { default: 128,
     description: 'Reduce key-derivation RAM & CPU usage at some expense of KDF strength' },
  unlock: 
   { default: '',
     description: 'Comma separated list of account to unlock' },
  password: 
   { default: '',
     description: 'Password file to use for non-interactive password input' },
  rpc: { default: true, description: 'Enable the HTTP-RPC server' },
  rpcaddr: 
   { default: 'localhost',
     description: 'HTTP-RPC server listening interface' },
  rpcport: 
   { default: 8545,
     description: 'HTTP-RPC server listening port' },
  rpcapi: 
   { default: 'eth,net,web3',
     description: 'API\'s offered over the HTTP-RPC interface' },
  rpccorsdomain: 
   { default: '',
     description: 'Comma separated list of domains from which to accept cross origin requests' },
  ws: { default: false, description: 'Enable the WS-RPC server' },
  wsaddr: 
   { default: 'localhost',
     description: 'WS-RPC server listening interface' },
  wsport: { default: 8546, description: 'WS-RPC server listening port' },
  wsapi: 
   { default: 'eth,net,web3',
     description: 'API\'s offered over the WS-RPC interface' },
  ipcdisable: { default: false, description: 'Disable the IPC-RPC server' },
  ipcapi: 
   { default: 'admin,debug,eth,miner,net,personal,shh,txpool,web3',
     description: 'API\'s offered over the IPC-RPC interface' },
  ipcpath: 
   { default: 'geth.ipc',
     description: 'Filename for IPC socket/pipe within the datadir' },
  bootnodes: 
   { default: '',
     description: 'Comma separated enode URLs for P2P discovery bootstrap' },
  port: { default: 30303, description: 'Network listening port' },
  maxpeers: { default: 25, description: 'Maximum number of network peers' },
  maxpendpeers: 
   { default: 0,
     description: 'Maximum number of pending connection attempts' },
  nat: 
   { default: 'any',
     description: 'NAT port mapping mechanism (any,none,upnp,pmp,extip:<IP>)' },
  nodiscover: 
   { default: false,
     description: 'Disables peer discovery mechanism' },
  nodekey: { default: '', description: 'P2P node key file' },
  nodekeyhex: { default: '', description: 'P2P node key hex (for testing)' },
  mine: { default: false, description: 'enable the miner ' },
  minerthreads: 
   { default: 4,
     description: 'Number of CPU threads to use for mining' },
  autodag: { default: false, description: 'Enable automatic DAG pregeneration' },
  etherbase: 
   { default: 0,
     description: 'Public address for block mining rewards' },
  targetgaslimit: 
   { default: 4712388,
     description: 'Target gas limit sets the artificial target gas floor for the blocks to mine' },
  gasprice: 
   { default: 20000000000,
     description: 'Minimal gas price to accept for mining a transactions' },
  extradata: 
   { default: '',
     description: 'Block extra data set by the miner' },
  solc: 
   { default: 'solc',
     description: 'Solidity compiler command to be used' } }
