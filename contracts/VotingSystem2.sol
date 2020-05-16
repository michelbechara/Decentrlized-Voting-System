pragma solidity ^0.4.0;

contract VotingSystem2 { //Form the candidate
    struct Candidate{
      uint id;
      string candidate_name;
      uint sumvotes;
      bool isMale;
    }

    //in this mapping we store the accounts who have voted
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates; //Key-value pair (uint id as key)

    uint public candidatesNumber; //how many candidates there are

    // voted event to refresh the page after voting
    event votedEvent (
        uint indexed _candidateId
    );

    event voteCast(string c);

    constructor() public{ //constructor
      addCandidate("Jack",false);
      addCandidate("Joanna",true);
      addCandidate("Maria",true);
      addCandidate("Bob",true);
      addCandidate("Alice",true);

    }

    function addCandidate (string candidate_name, bool isMale) public{
      candidatesNumber++; //increment the number of candidates
      candidates[candidatesNumber]=Candidate(candidatesNumber, candidate_name, 0, isMale);
    }

    function removeCandidate (uint id) public{
      delete candidates[id];
      //emit voteCast(candidates[0].candidate_name);
      //emit voteCast(candidates[1].candidate_name);
      //emit voteCast(candidates[2].candidate_name);
      //emit voteCast(candidates[3].candidate_name);


    }

    function modifyCandidate (uint id, string candidate_name, bool isMale) public{
      //candidates[id]=Candidate(id, candidate_name)
      uint sumvotes = candidates[id].sumvotes;
      candidates[id]= Candidate(id, candidate_name, sumvotes,isMale);
    }

    function vote(uint _candidateId) public{
        //adress has not voted before
        require(!voters[msg.sender]); //not in the mapping => has not voted before
        //valid candidate
        require(_candidateId > 0 && _candidateId<=candidatesNumber);
        /*Know and save that this account has voted. Solidity allows us to know who is sending
        this function through meta data (msg.sender)*/
        voters[msg.sender] = true;
        //increment vote count for correct candidate
        candidates[_candidateId].sumvotes ++;

        //trigger voted event
        votedEvent(_candidateId);


    }
}
