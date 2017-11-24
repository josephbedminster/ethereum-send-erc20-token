// Config file
var json = "address.json";
var contract_address = "";  // ERC20Token contract token
var publicKey = ""; // ERC20Token Owner
var privateKey = "" //ERC20Token owner
var abiToken = "token.json" // abi of your token contract
var api_key = "" // Infura API key

// load JSON file
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync(json));


// Web3 module
var Web3 = require('web3');
var web3 = new Web3();
var Tx = require('ethereumjs-tx');

web3.setProvider(new Web3.providers.HttpProvider(`https://ropsten.infura.io/${api_key}`));

//Create Contract
var abiArray = JSON.parse(fs.readFileSync(abiToken, 'utf-8'));
var MyContract = web3.eth.contract(abiArray);
var myContractInstance = MyContract.at(contract_address);

//Get AdressCount for nonce
var count = web3.eth.getTransactionCount(publicKey);

//Loop on JSON object and make transaction
var i = 0;

for (var key in obj) {
  i = transfer(publicKey, obj[key].address, obj[key].amount)
}

//Transfer Function
function transfer(address_from, address_to, amount) {

  if (amount == 0) {
    console.error("ERROR : Amount null")
    return (i);
  }
  var time = new Date();

  console.log(`Send ${amount} to ${address_to}`)
  //Set contract address to contract
  var myContractInstance = MyContract.at(contract_address);

  //Calcul amount
  var decimal = myContractInstance.decimals();
  amount = amount * Math.pow(10, decimal.toNumber());

  //Get data from contract
  var data = myContractInstance.transfer.getData(address_to, amount, {from: address_from});

  //Set GasPrice
  var gasPrice = web3.eth.gasPrice;
  var gasLimit = 90000;

  var rawTransaction = {
    "from": address_from,
    "nonce": web3.toHex(count + i),
    "gasPrice": web3.toHex(gasPrice) * 1.10,
    "gasLimit": web3.toHex(gasLimit),
    "to": contract_address,
    "data": data,
    "chainId": 0x03
  };

  var privKey = new Buffer(privateKey, 'hex');
  var tx = new Tx(rawTransaction);

  tx.sign(privKey);
  var serializedTx = tx.serialize();

  web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    if (!err)
      console.log(hash);
    else
      console.log(err);
  });
  return (i + 1);
}
