var VotingSystem = artifacts.require("./VotingSystem2.sol");
var Contracts_DB = artifacts.require("./Contracts_DB.sol");


module.exports = function(deployer) {
  deployer.deploy(Contracts_DB);
};

//module.exports = function(deployer) {
  //deployer.deploy(Contracts_DB);
//};
