function notification_error(type, text) {
    var notification = webkitNotifications.createNotification(
        'icons/icon_48.png',  // icon url - can be relative
        type,  // notification title
        text  // notification body text
    );
    notification.show();
}

function FormListCtrl($scope) {
  $scope.policies = Datastore.load();
  $scope.rules = Policy.RULES;
  $scope.emptyPolicy = function(){
    var rules = $scope.rules.reduce(function(result, key){
      result[key] = {ruletype: "noop"};
      return result;
    }, {});
    return {
      name: "Empty",
      enable: 0,
      pattern: "http://*/*",
      rules: rules
    };
  };
  $scope.import = function() {
    try {
      var text = Base64.decode($scope.string.value);
      $scope.string.value = "";
      var policy = JSON.parse(text);
      if(Policy.validate(policy)) {
         $scope.policies.push(policy);
         Datastore.save($scope.policies);
      } else {
          notification_error("Error", "Can not import invalid profile!");
      }
    } catch (e) {
        notification_error("Error", "Can not import invalid profile!");
    }
  }
  $scope.validateImport = function() {
      if ($scope.string == null || $scope.string.value == null || $scope.string.value == "") {
          return 0;
      }
      var text = Base64.decode($scope.string.value);
      try {
        var policy = JSON.parse(text);
        if(Policy.validate(policy)) {
            return 0;
        } else {
            return 1;
        }
      } catch (e) {
          return 1;
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
    notification_error("Info", "This profile has been copied to your copyboard");
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
  $scope.ruletypes = Policy.RULETYPES($scope.rulekey);
  $scope.rulepattern = Policy.RULEPATTERN($scope.rulekey);
  $scope.isDisplayRuleValue = function() {
    return $scope.rule.ruletype == "fixed" || $scope.rule.ruletype == "extra";
  };
}
