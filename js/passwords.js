(function(angular) {
  "use strict";
  angular.module('PasswordKeeper.passwords', [])
  .controller('PasswordCtrl', ['$firebaseArray', '$mdDialog', 'currentAuth',
  function ($firebaseArray, $mdDialog, currentAuth) {
    var ref = new Firebase("https://passwordkeeper.firebaseio.com/users/" + currentAuth.uid);
    this.passwords = $firebaseArray(ref);
    var locks = ['cyan', 'green', 'orange', 'pink', 'purple', 'red'];
    var lockCache = {}; // This is so that there is no infinite digest loop
    this.getRandomLockColor = function (index) {
      if(lockCache['lockAt'+index] !== undefined) {
        return lockCache['lockAt'+index];
      } else {
        var color = locks[Math.floor(Math.random()*locks.length)];
        lockCache['lockAt'+index] = color;
        return color;
      }
    };
    var self = this;
    var insertDialogController = function (password) {
      return ['$mdDialog', function ($mdDialog) {
        this.isNewQuote = !password;
        this.newPassword = {};
        if (!this.isNewQuote) {
          this.newPassword = password;
          this.originalPassword = angular.copy(password);
        }
        this.cancel = function () {
          if (!this.isNewQuote) {
            this.newPassword.service = this.originalPassword.service;
            this.newPassword.username = this.originalPassword.username;
            this.newPassword.password = this.originalPassword.password;
          }
          $mdDialog.cancel();
        };
        this.ok = function () {
          if (this.newPassword.username === "") {
            this.newPassword.username = null;
          }
          if (this.isNewQuote) {
            self.passwords.$add(this.newPassword);
          } else {
            self.passwords.$save(this.newPassword);
          }
          $mdDialog.hide();
        };
      }];
    };
    this.createNewPassword = function ($event) {
      $mdDialog.show({
        templateUrl: '/partials/insertDialog.html',
        targetEvent: $event,
        controller: insertDialogController(),
        controllerAs: 'dialog'
      });
    };
    this.updatePassword = function ($event, password) {
      $mdDialog.show({
        templateUrl: '/partials/insertDialog.html',
        targetEvent: $event,
        controller: insertDialogController(password),
        controllerAs: 'dialog'
      });
    };
    this.deletePassword = function ($event, password) {
      var confirm = $mdDialog.confirm()
      .title('Delete Password')
      .content('Would you like to delete your password for ' + password.service + '?')
      .ariaLabel('Delete Password')
      .ok('Remove')
      .cancel('Cancel')
      .targetEvent($event);
      $mdDialog.show(confirm).then(function() {
        self.passwords.$remove(password);
      });
    };
  }]);

})(angular);
