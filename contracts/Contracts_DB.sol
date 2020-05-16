pragma solidity ^0.4.0;

contract Contracts_DB { //Form the contract
    struct Contract{
      uint id;
      string contract_name;
      string contract_address;
    }

    mapping(uint => Contract) public contracts;

    uint public contractsNumber; //how many contracts there are

    event ContractEvent (
        uint indexed _contractEvent
    );

    constructor() public{ //constructor
      addContract("USA", "0x0643458f89b44F1C6032AA6C72F3Efa7f14Fc5a0");
      addContract("Germany", "0x75eA3816cAa23cCbB8726881F37c51B5BB3cc375");
      addContract("Lebanon", "0xf6b5C3fc0F01d00c25fcdb34566704F1A4aA62a5");

    }

    function addContract (string contract_name, string c_address) public{
      contractsNumber++; //increment the number of contracts
      contracts[contractsNumber]=Contract(contractsNumber, contract_name, c_address);
      ContractEvent(contractsNumber);
    }

    function removeContract (uint id) public{
      delete contracts[id];
    }

}
