function FormListCtrl($scope) {
    if (localStorage['enable']) {
       $scope.enable = localStorage['enable'];
    }
    $scope.policies = Datastore.load();
    $scope.save = function() {
       Datastore.save($scope.policies);
    };
    $scope.settings = function() {
       localStorage['enable'] = $scope.enable;
    };
}
