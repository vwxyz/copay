'use strict';

angular.module('copayApp.controllers').controller('HomeWalletController', function($scope, $rootScope, $timeout, $filter, $modal, rateService, notification, txStatus, identityService) {
  $scope.initHome = function() {
    $rootScope.title = 'Home';
    var w = $rootScope.wallet;
    if (w.isShared())
      $scope.copayers = w.getRegisteredPeerIds();
  };

  $scope.sign = function(ntxid) {
    var w = $rootScope.wallet;
    $scope.loading = true;
    $scope.error = $scope.success = null;
    w.signAndSend(ntxid, function(err, id, status) {
      $scope.loading = false;

      if (err)
        $scope.error = err;
      else
        txStatus.notify(status);
    });
  };

  $scope.reject = function(ntxid) {
    var w = $rootScope.wallet;
    w.reject(ntxid, function(err, status) {
      if (err)
        $scope.error = err;
      else
        txStatus.notify(status);
    });
  };


  $scope.broadcast = function(ntxid) {
    var w = $rootScope.wallet;
    $scope.error = $scope.success = null;
    $scope.loading = true;
    w.issueTx(ntxid, function(err, txid, status) {
      $scope.loading = false;

      if (err)
        $scope.error = err;

      txStatus.notify(status);
    });
  };


  $scope.openTxModal = function(tx) {
    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.tx = tx;
      $scope.getShortNetworkName = function() {
        var w = $rootScope.wallet;
        return w.getNetworkName().substring(0, 4);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    };

    $modal.open({
      templateUrl: 'views/modals/txp-details.html',
      windowClass: 'tiny',
      controller: ModalInstanceCtrl,
    });
  };
});