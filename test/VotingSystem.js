var VotingSystem = artifacts.require("./VotingSystem.sol");


contract("Election",function(accounts){
  var votingsystemInstance;

//is contract initialized with correct number of candidates?
  it("initializes with two candidates", function() { //it comes from mocha testing framework
    return VotingSystem.deployed().then(function(instance) {
      return instance.candidatesNumber();
    }).then(function(count) {assert.equal(count, 4); //assert comes from chai framework
    });
  });

//Name,VoteNumber and ID is correct?

  it("it initializes the candidates with the correct values", function() {
    return VotingSystem.deployed().then(function(instance) {
      votingsystemInstance = instance;
      return votingsystemInstance.candidates(1); //read first candidate
    }).then(function(candidate) { //as call is asnchronous we shold use promise chain
      assert.equal(candidate[0], 1, "contains the correct id");
      assert.equal(candidate[1], "Mira", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return votingsystemInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contains the correct id");
      assert.equal(candidate[1], "Jad", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return votingsystemInstance.candidates(3);
    }).then(function(candidate) {
      assert.equal(candidate[0], 3, "contains the correct id");
      assert.equal(candidate[1], "Michel", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
      return votingsystemInstance.candidates(4);
    }).then(function(candidate) {
      assert.equal(candidate[0], 4, "contains the correct id");
      assert.equal(candidate[1], "Laura", "contains the correct name");
      assert.equal(candidate[2], 0, "contains the correct votes count");
    });
  });

  it("allows a voter to cast a vote", function() {
   return VotingSystem.deployed().then(function(instance) {
     electionInstance = instance;
     candidateId = 1;
     return electionInstance.vote(candidateId, { from: accounts[0] }); //cast a vote and send metadata
   }).then(function(receipt) {
     assert.equal(receipt.logs.length, 1, "an event was triggered"); //make sure receipt has 1 log
     assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");//make sure its votedevent
     assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");//argument in event is the correct specified id
     return electionInstance.voters(accounts[0]);
   }).then(function(voted) {
     assert(voted, "the voter was marked as voted");
     return electionInstance.candidates(candidateId);
   }).then(function(candidate) {
     var voteCount = candidate[2];
     assert.equal(voteCount, 1, "increments the candidate's vote count");
   })
 });
});
