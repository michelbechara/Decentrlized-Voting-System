App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(7,8);
    console.log(queryString);
    var contractChosen="";
    if (queryString=="1")
    {
      contractChosen="VotingSystem.json";
      electionTitle="USA Election";

    }
    if (queryString=="2")
    {
      contractChosen="VotingSystem1.json";
      electionTitle="German Election";

    }
    if (queryString=="3")
    {
      contractChosen="VotingSystem2.json";
      electionTitle="Lebanese Election";
    }

    $.getJSON(contractChosen, function(election) {
      App.contracts.VotingSystem = TruffleContract(election); //instantiate new contract
      App.contracts.VotingSystem.setProvider(App.web3Provider); //connect the provider here
      App.listenForEvents();
      $("#Title").html(electionTitle);
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.VotingSystem.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, { //call the votedevent
        //subscribe to events on entire blockchain and
        fromBlock: 'latest'
        //toBlock: 'latest'
      }).watch(function(error, event) { //listen to the events, when triggered then:
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        //App.render();
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Connected Account: " + account);
      }
    });

    // Load contract data
    App.contracts.VotingSystem.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesNumber();
    }).then(function(candidatesNumber) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for (var i = 1; i <= candidatesNumber; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          if(candidate[0] == 0)
          {

          }
          else{

          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];


          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td id=Candidate"+candidate[1]+">"+"</th><td>" +name + "</td><td>" + voteCount + "</td></tr>"

          console.log(candidateTemplate);
          candidatesResults.append(candidateTemplate);
          var img = new Image();
          var div = document.getElementById("Candidate"+candidate[1]);
          console.log(div);
          img.src="images\\avatar"+candidate[1]+".jpg"
          img.width=60;
          img.hspace=85;
          div.appendChild(img);



          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        }
        });
      }
      return electionInstance.voters(App.account); //voters mapping to see if that exist and pass it to callack below
    }).then(function(hasVoted) { //callback function. holds if hasvoted is true or false
      // Do not allow a user to vote
      if(hasVoted) { //if true
        $('form').hide(); //hide the form
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function() {
      var candidateId = $('#candidatesSelect').val();
      App.contracts.VotingSystem.deployed().then(function(instance) {
          return instance.vote(candidateId, { from: App.account });
        //return instance.removeCandidate(6, { from: App.account});
          //return instance.addCandidate("coc", { from: App.account });

      }).then(function(result) {
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        console.error(err);
      });
    }
  };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
