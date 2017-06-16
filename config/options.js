var path = require('path');
module.exports = {
	ethereum: {
		datadir: {
			description: 'Data directory for the databases and keystore',
			value: path.join(process.env.HOME, '.ethereum')
		},
		keystore: {
			description: 'Directory for the keystore',
			value: null
		},
		nousb: {
			description: 'Disables monitoring for and managine USB hardware wallets',
			value: false
		},
		networkid: {
			description: 'Network identifier (integer, 1=Frontier, 2=Morden (disused), 3=Ropsten, 4=Rinkeby)',
			value: 1
		},
		testnet: {
			description: 'Ropsten network: pre-configured proof-of-work test network',
			value: false
		},
		rinkeby: {
			description: 'Rinkeby network: pre-configured proof-of-authority test network',
			value: false
		},
		dev: {
			description: 'Developer mode: pre-configured private network with several debugging flags',
			value: false
		},
		syncmode: {
			description:  'Blockchain sync mode ("fast", "full", or "light")',
			value: 'full'
		},
		ethstats: {
			description: 'Reporting URL of a ethstats service (nodename:secret@host:port)',
			value: null
		},
		identity: {
			description: 'Custom node name',
			value: null
		},
		lightserv: {
			description: 'Maximum percentage of time allowed for serving LES requests (0-90)',
			value: 0
		},
		lightpeers: {
			description: 'Maximum number of LES client peers',
			value: 20
		},
		lightkdf: {
			description: 'Reduce key-derivation RAM & CPU usage at some expense of KDF strength',
			value: false
		}
	},
	ethash: {
		'ethash.cachesinmem':  {
			description: 'Number of recent ethash caches to keep in memory (16MB each)',
			value: 2
		},
		'ethash.cachesondisk': {
			description: 'Number of recent ethash caches to keep on disk (16MB each)',
			value: 3
		},
		'ethash.dagdir': {
			description: 'Directory to store the ethash mining DAGs',
			value: path.join(process.env.HOME, '.ethash')
		},
		'ethash.dagsinmem': {
			description: 'Number of recent ethash mining DAGs to keep in memory (1+GB each)',
			value: 1
		},
		'ethash.dagsondisk': {
			description: 'Number of recent ethash mining DAGs to keep on disk (1+GB each)',
			value: 2
		}
	},
	peformance: {
		cache: {
			description: 'Megabytes of memory allocated to internal caching (min 16MB /database forced)',
			value: 128,
		},
		trie_cache_gens: {
			description: 'Number of trie node generations to keep in memory',
			value: 120
		}
	},
	account: {
		unlock: {
			description: 'Comma separated list of accunts to unlock',
			value: null
		},
		password: {
			description: 'Password file to use for non-interactive password input',
			value: null
		}
	},
	api: {
	  rpc:             {
	      description: 'Enable the HTTP-RPC server',
	      value: true
	  },
	  rpcaddr:         {
	      description: 'HTTP-RPC server listening interface (default: "localhost")',
	      value: 'localhost'
	  },
	  rpcport:         {
	      description: 'HTTP-RPC server listening port (default: 8545)',
	      value: 8545
	  },
	  rpcapi:          {
	      description: 'API\'s offered over the HTTP-RPC interface',
	      value: ['web3','eth','net']
	  },
	  ws:                   {
	      description: 'Enable the WS-RPC server',
	      value: false
	  },
	  wsaddr:          {
	      description: 'WS-RPC server listening interface (default: "localhost")',
	      value: 'localhost'
	  },
	  wsport:          {
	      description: 'WS-RPC server listening port (default: 8546)',
	      value: 8546
	  },
	  wsapi:           {
	      description: 'API\'s offered over the WS-RPC interface',
	      value: []
	  },
	  wsorigins:       {
	      description: 'Origins from which to accept websockets requests',
	      value: null
	  },
	  ipcdisable:           {
	      description: 'Disable the IPC-RPC server',
	      value: false
	  },
	  ipcpath:              {
	      description: 'Filename for IPC socket/pipe within the datadir (explicit paths escape it)',
	      value: null
	  },
	  rpccorsdomain:   {
	      description: 'List of domains from which to accept cross origin requests (browser enforced)',
	      value: []
	  },
	  jspath:    {
	      description: 'JavaScript root path for loadScript (default: ".")',
	      value: '.'
	  },
	  exec:            {
	      description: 'Execute JavaScript statement',
	      value: null
	  },
	  preload:         {
	      description: 'JavaScript files to preload into the console',
	      value: []
		}
	},
	networking: {
	  bootnodes: {
	    description:'List of enode URLs for P2P discovery bootstrap',
	    value: []
	  },
	  port: {
	    description:'Network listening port (default: 30303)',
	    value: 30303
	  },
	  maxpeers: {
	    description: 'Maximum number of network peers (network disabled if set to 0) (default: 25)',
	    value: 25
	  },
	  maxpendpeers: {
	    description: 'Maximum number of pending connection attempts (defaults used if set to 0) (default: 0)',
	    value: 0
	  },
	  nat: {
	    description: 'NAT port mapping mechanism (any|none|upnp|pmp|extip:<IP>) (default: "any")',
	    value: 'any'
	  },
	  nodiscover: {
	    description: 'Disables the peer discovery mechanism (manual peer addition)',
	    value: false
	  },
	  v5disc: {
	    description: 'Enables the experimental RLPx V5 (Topic Discovery) mechanism',
	    value: false
	  },
	  netrestrict: {
	    description: 'Restricts network communication to the given IP networks (CIDR masks)',
	    value: null
	  },
	  nodekey: {
	    description: 'P2P node key file',
	    value: null
	  },
	  nodekeyhex: {
	    description: 'P2P node key as hex (for testing)',
	    value: null
	  }
	},
	miner: {
	  mine: {
	    description: 'Enable mining',
	    value: false
	  },
	  minerthreads: {
	    description:       'Number of CPU threads to use for mining (default: 8)',
	    value: 8
	  },
	  etherbase: {
	    description: 'Public address for block mining rewards (default = first account created) (default: "0")',
	    value: null
	  },
	  targetgaslimit: {
	    description:     'Target gas limit sets the artificial target gas floor for the blocks to mine (default: 4712388)',
	    value: 4712388
	  },
	  gasprice: {
	    description:  'Minimal gas price to accept for mining a transactions',
	    value: 20000000000
	  },
	  extradata: {
	    description:          'Block extra data set by the miner (default = client version)',
	    value: null
	  }
	},
	gaspriceoracle: {
	  gpoblocks: {
	    description:       'Number of recent blocks to check for gas prices (default: 10)',
	    value: 10
	  },
	  gpopercentile: {
	    description:   'Suggested gas price is the given percentile of a set of recent transaction gas prices (default: 50)',
	    value: 50
	  }
	},
	vm: {  
	  vmdebug: {
	    description:   'Record information useful for VM and contract debugging',
	    value: false
	  }
	},
	debug: {
	  metrics: {
	    description: 'Enable metrics collection and reporting',
	    value: false
	  },
	  fakepow: {
	    description: 'Disables proof-of-work verification',
	    value: false
	  },
	  nocompaction: {
	    description:'Disables db compaction after import',
	    value: false
	  },
	  verbosity: {
	    description: 'Logging verbosity: 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=detail (default: 3)',
	    value: 3
	  },
	  vmodule: {
	    description: 'Per-module verbosity: list of <pattern>=<level> (e.g. eth/*=5,p2p=4)',
	    value: []
	  },
	  backtrace: {
	    description: 'Request a stack trace at a specific logging statement (e.g. "block.go:271")',
	    value: null
	  },
	  debug: {
	    description: 'Prepends log messages with call-site location (file and line number)',
	    value: false
	  },
	  pprof: {
	    description:                    'Enable the pprof HTTP server',
	    value: false
	  },
	  pprofaddr: {
	    description:          'pprof HTTP server listening interface (default: "127.0.0.1")',
	    value: '127.0.0.1'
	  },
	  pprofport: {
	    description:          'pprof HTTP server listening port (default: 6060)',
	    value: 6060
	  },
	  memprofilerate: {
	    description:     'Turn on memory profiling with the given rate (default: 524288)',
	    value: 524288
	  },
	  blockprofilerate: {
	    description:   'Turn on block profiling with the given rate (default: 0)',
	    value: 0
	  },
	  cpuprofile: {
	    description:         'Write CPU profile to the given file',
	    value: null
	  },
	  trace: {
	    description:              'Write execution trace to the given file',
	    value: null
	  }
	}
}
