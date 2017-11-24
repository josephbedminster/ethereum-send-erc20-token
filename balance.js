// Web3 module
var Web3 = require('web3');
var web3 = new Web3();
var Tx = require('ethereumjs-tx');
var fs = require('fs');

// Config file
var json = "address.json";
var contract_address = "";  // ERC20Token contract token
var publicKey = ""; // ERC20Token Owner
var abiToken = "token.json" // abi of your token contract
var api_key = "" // Infura API key


web3.setProvider(new Web3.providers.HttpProvider(`https://ropsten.infura.io/${api_key}`));

var abiArray = JSON.parse(fs.readFileSync(abiToken, 'utf-8'));
var MyContract = web3.eth.contract(abiArray);

var myContractInstance = MyContract.at(contract_address);

var obj = JSON.parse(fs.readFileSync(json));

for (var key in obj) {
  get_balance(obj[key].address)
}

function get_balance(address) {
  var decimal = myContractInstance.decimals();
  var result = myContractInstance.balanceOf(address);
  console.log(`${address}: ${result.toNumber() / (Math.pow(10, decimal.toNumber()))}`)
}
