function FormListCtrl($scope) {
  $scope.policies = Datastore.load();
  $scope.rules = Policy.RULES;
  $scope.ruletypes = Policy.RULETYPES;
  $scope.emptyPolicy = function(){
    var rules = $scope.rules.reduce(function(result, key){
      result[key] = {ruletype: "noop"};
      return result;
    }, {});
    return {
      pattern: "http://*/*",
      rules: rules
    };
  };
  $scope.import = function() {
    var text = Base64.decode($scope.string.value);
    $scope.string.value = "";
    var policy = eval('('+text+')');
    if(Policy.validate(policy)) {
       $scope.policies.push(policy);
    }
  }
}

function copyTextToClipboard(text) {
  document.oncopy = function(event) {
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
  };
  document.execCommand("Copy", false, null);
}

function FormCtrl($scope) {
  $scope.urlRegex = Policy.patternRegex;

  $scope.remove = function(idx) {
    $scope.policies.splice(idx, 1);
    Datastore.remove(idx);
  };

  $scope.save = function() {
    if(Policy.validate($scope.policy)) {
      Datastore.save($scope.policies);
    }
  };

  $scope.export = function() {
    var base64_text = Base64.encode(JSON.stringify($scope.policy));
    copyTextToClipboard(base64_text);
    console.log(base64_text);
    alert("This profile has been copied to your copyboard");
  }

  $scope.up = function(src) {
    if(src > 0){
      Datastore.swap(src, src - 1);
      var tmp = $scope.policies[src];
      $scope.policies[src] = $scope.policies[src - 1];
      $scope.policies[src - 1] = tmp;
    }
  };

  $scope.down = function(src) {
    if(src < $scope.policies.length - 1) {
      Datastore.swap(src, src + 1);
      var tmp = $scope.policies[src];
      $scope.policies[src] = $scope.policies[src + 1];
      $scope.policies[src + 1] = tmp;
    }
  };
}

function RuleCtrl($scope) {
  $scope.rule = $scope.policy.rules[$scope.rulekey];
  $scope.isDisplayRuleValue = function() {
    return $scope.rule.ruletype == "fixed" || $scope.rule.ruletype == "extra";
  };
}
