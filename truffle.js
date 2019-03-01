
var Web3 = require("web3");
var web3 = new Web3();
var WalletProvider = require("truffle-wallet-provider");
var Wallet = require("ethereumjs-wallet");

/* Proof providers */
// var proofPrivateKey = new Buffer("", "hex")
// var proofWallet = Wallet.fromPrivateKey(proofPrivateKey);
// var proofProvider = new WalletProvider(proofWallet, "https://mainnet.infura.io");

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 9545,
            network_id: "*"
        }
        // proof: {
        //     provider: proofProvider,
        //     network_id: "1",
        //     gas: 2000000,
        //     gasPrice: 20000000000,
        // }
    }
};
