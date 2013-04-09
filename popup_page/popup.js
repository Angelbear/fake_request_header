function changeIcon() {
    if (localStorage['enable'] && localStorage['enable'] == 1) {
        chrome.browserAction.setIcon({ "path": "../icons/icon_on.png" });
    } else {
        chrome.browserAction.setIcon({ "path": "../icons/icon_off.png" });
    }
}

function FormListCtrl($scope) {
    if (localStorage['enable']) {
        $scope.enable = localStorage['enable'];
    }
    changeIcon();
    $scope.policies = Datastore.load();
    $scope.save = function() {
        Datastore.save($scope.policies);
    };
    $scope.settings = function() {
        localStorage['enable'] = $scope.enable;
        changeIcon();
    };
    $scope.go_option = function() {
       chrome.tabs.create({
           url: "../options_page/index.html"
       });
    }
}
