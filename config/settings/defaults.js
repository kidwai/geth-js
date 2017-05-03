const HOME = process.env.HOME;

module.exports =
{
  datadir: HOME + '/.ethereum',
  port: 30303,
  rpc: true,
  rpcaddr: 'localhost',
  rpcport: 8545,
  rpcapi: 'eth,net,web3',
  mine: false
}
