require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports={

  networks:{
    rinkeby:{
      provider: function(){
        return new HDWalletProvider(
          process.env.MNEMONIC,
          `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`
            )
      },
      gasPrice:25000000000,
      network_id: 4
    },

    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    }
  },

  compilers: {
    solc: {
      version: "0.4.25",
    },
  },

  solc:{
    optimizer:{
      enabled:true,
      runs:200
    }
  }
};
