(function (angular) {
  angular.module('PasswordKeeper.accounts', [])
  .controller('LoginCtrl', ['auth', '$mdToast', '$location', '$timeout', function(auth, $mdToast, $location, $timeout) {
    var failedAttempts = 0;
    if (auth.$getAuth()) {
      auth.$unauth();
    }
    this.user = {email:'', password:''};
    this.loggingIn = false;
    var self = this;
    var showToast = function(message) {
      var toast = $mdToast.simple()
            .content(message)
            .position('bottom left');
      return $mdToast.show(toast);
    };
    var showResetToast = function(errorMessage) {
      var toast = $mdToast.simple()
            .content('Did you forget your password for ' + self.user.email + '?')
            .action('Reset')
            .highlightAction(false)
            .position('bottom left');
      showToast(errorMessage).finally(function() {
        $mdToast.show(toast).then(function() {
          auth.$resetPassword(self.user).then(function() {
            showToast("Password reset email sent to " + self.user.email + "!");
          }).catch(function(error) {
            showToast(error.message);
          });
        });
      });
    };
    this.login = function() {
      this.loggingIn = true;
      auth.$authWithPassword(this.user).then(function(authData) {
        self.loggingIn = false;
        $location.path("/passwords");
      }).catch(function(error) {
       self.loggingIn = false;
       failedAttempts++;
       if(failedAttempts > 1) {
         showResetToast(error.message);
       } else {
         showToast(error.message);
       }
      });
    };
    this.signup = function () {
      this.loggingIn = true;
      auth.$createUser(this.user).then(function(authData) {
        this.login();
        showToast("Welcome to Password Keeper!");
      }).catch(function(error) {
        self.loggingIn = false;
        showToast(error.message);
      });
    };
  }])
  .controller('AccountCtrl', ['currentAuth', 'auth', '$mdToast', '$location', function(currentAuth, auth, $mdToast, $location) {
    var showToast = function(message) {
      var toast = $mdToast.simple()
            .content(message)
            .position('bottom left');
      return $mdToast.show(toast);
    };
    var errorFunction = function(error) {
      showToast(error.message);
    };
    var self = this;
    this.changeEmail = {
      newEmail: "",
      oldEmail: "",
      password: ""
    };
    this.changeEmailAction = function() {
      auth.$changeEmail(self.changeEmail).then(function() {
        showToast("Email updated to " + self.changeEmail.newEmail + "!");
      }).catch(errorFunction);
    };
    this.changePassword = {
      email: "",
      oldPassword: "",
      newPassword: ""
    };
    this.changePasswordAction = function() {
      auth.$changePassword(self.changePassword).then(function() {
        showToast("Password changed for user " + self.changePassword.email + "!");
      }).catch(errorFunction);
    };
    this.deleteAccount = {
      email: "",
      password: ""
    };
    this.deleteAccountAction = function() {
      auth.$removeUser(self.deleteAccount).then(function() {
        showToast("Account for " + self.deleteAccount.email + " deleted!");
        $location.path("/login");
      }).catch(errorFunction);
    };
  }]);
})(angular);
