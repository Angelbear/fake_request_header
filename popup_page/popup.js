function changeIcon(enable) {
    if (enable && enbale == 1) {
        chrome.browserAction.setIcon({ "path": "../icons/icon_on.png" });
    } else {
        chrome.browserAction.setIcon({ "path": "../icons/icon_off.png" });
    }
}

function FormListCtrl($scope) {
    var tabId = localStorage["currentTab"];
    if (!tabId) {
        tabId = 0;
    }
    $scope.enable = localStorage[tabId];
    if (!localStorage[tabId]) {
        $scope.enable = 0;
    }
    changeIcon($scope.enable);
    $scope.policies = Datastore.load();
    $scope.save = function() {
        Datastore.save($scope.policies);
    };
    $scope.settings = function() {
        localStorage[tabId] = $scope.enable;
        changeIcon($scope.enable);
    };
}
