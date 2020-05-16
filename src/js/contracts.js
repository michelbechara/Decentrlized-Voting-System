App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

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
    $.getJSON("Contracts_DB.json", function(election) {
      App.contracts.Contracts_DB = TruffleContract(election); //instantiate new contract
      App.contracts.Contracts_DB.setProvider(App.web3Provider); //connect the provider here
      App.listenForEvents();
      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Contracts_DB.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.ContractEvent({}, { //call the votedevent
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
    App.contracts.Contracts_DB.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.contractsNumber();
    }).then(function(contractsNumber) {
      var contractsResults = $("#contractsResults");
      contractsResults.empty();

      var contractsSelect = $('#contractsSelect');
      contractsSelect.empty();

      for (var i = 1; i <= contractsNumber; i++) {
        electionInstance.contracts(i).then(function(contract) {
          if(contract[0] == 0)
          {

          }
          else{

          var id = contract[0];
          var name = contract[1];


          // Render candidate Result
          var contractTemplate = "<tr><th>" + id + "</th> <td id=Flag"+contract[1]+" style=padding-left:100px;"+">"+"</th> <td style=padding-left:100px;"+">" +name + "</td></tr>"

          console.log(contractsResults);
          console.log(contractTemplate);
          contractsResults.append(contractTemplate);

          var img = new Image();
          var div = document.getElementById("Flag"+contract[1]);
          console.log(div);
          img.src="images\\flag"+contract[1]+".jpg"
          img.width=60;
          img.hspace=85;
          div.appendChild(img);

          // Render candidate ballot option
          var contractOption = "<option value='" + id + "' >" + name + "</ option>"
          contractsSelect.append(contractOption);
        }
        });
      }
      return electionInstance.contractsNumber(); //voters mapping to see if that exist and pass it to callack below
    }).then(function(hasVoted) { //callback function. holds if hasvoted is true or false
      // Do not allow a user to vote
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
    },

    change_page: function(){
      var contractId = $('#contractsSelect').val();
      var queryString = "?para1=" + contractId;
      window.open("contractSelected.html" + queryString);
    },



  chooseContract: function() {
      var contractId = $('#contractSelect').val();
      console.log(contractId);
      App.contracts.Contracts_DB.deployed().then(function(instance) {
          return instance.contract_address();
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
