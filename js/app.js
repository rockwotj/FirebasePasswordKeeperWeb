(function(angular) {
  angular.module('PasswordKeeper', ['ngMaterial', 'firebase', 'ngMessages', 'ngRoute', 'PasswordKeeper.accounts', 'PasswordKeeper.passwords'])
  .run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      if (error === "AUTH_REQUIRED") {
        $location.path("/login");
      } else {
        console.log(error);
      }
    });
  }])
  .config(["$routeProvider", function($routeProvider) {
    var ref = new Firebase("https://passwordkeeper.firebaseio.com");
    $routeProvider.when("/login", {
      controller: "LoginCtrl as ctrl",
      templateUrl: "partials/login.html",
      resolve: {
        auth: ["$firebaseAuth", function($firebaseAuth) {
          var auth = $firebaseAuth(ref);
          return auth;
        }]
      }
    }).when("/signup", {
      controller: "LoginCtrl as ctrl",
      templateUrl: "partials/signup.html",
      resolve: {
        auth: ["$firebaseAuth", function($firebaseAuth) {
          var auth = $firebaseAuth(ref);
          return auth;
        }]
      }
    }).when("/account", {
        controller: "AccountCtrl as ctrl",
        templateUrl: "partials/account.html",
        resolve: {
          currentAuth: ["$firebaseAuth", function($firebaseAuth) {
            var auth = $firebaseAuth(ref);
            return auth.$requireAuth();
          }],
          auth: ["$firebaseAuth", function($firebaseAuth) {
            var auth = $firebaseAuth(ref);
            return auth;
          }]
        }
    }).when("/passwords", {
      controller: "PasswordCtrl as ctrl",
      templateUrl: "partials/passwords.html",
      resolve: {
        currentAuth: ["$firebaseAuth", function($firebaseAuth) {
          var auth = $firebaseAuth(ref);
          return auth.$requireAuth();
        }]
      }
    }).otherwise("/passwords");
  }])
  .controller('SidebarCtrl', ["$mdSidenav", "$location", "$rootScope", function ($mdSidenav, $location, $rootScope) {
    this.hideSidebar = false;
    this.toggleSidenav = function (menuId) {
      if ($location.path() !== "/login" || $location.path() !== "/signup") {
        $mdSidenav(menuId).toggle();
      }
    };
    var self = this;
    function onRouteChange(event, next) {
      if ($location.path() === "/login" || $location.path() === "/signup") {
        self.hideSidebar = true;
      } else {
        self.hideSidebar = false;
      }
    }
    $rootScope.$on("$routeChangeSuccess", onRouteChange);
    $rootScope.$on("$routeChangeError", onRouteChange);
  }]);
})(angular);
