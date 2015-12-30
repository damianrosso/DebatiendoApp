// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase','ngResource'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsController'
      }
    }
  })

.state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html'
       /* controller: 'AccountController'*/
      }
    }
  })

.state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeController'
        }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

})


.factory('Flickr', function($resource, $q) {
  var photosPublic = $resource('http://api.flickr.com/services/feeds/photos_public.gne', 
      { format: 'json', jsoncallback: 'JSON_CALLBACK' }, 
      { 'load': { 'method': 'JSONP' } });
      
  return {
    search: function(query) {
      var q = $q.defer();
      photosPublic.load({
        tags: query
      }, function(resp) {
        q.resolve(resp);
      }, function(err) {
        q.reject(err);
      })
      
      return q.promise;
    }
  }
})

.controller('FlickrCtrl', function($scope, Flickr) {

  var doSearch = ionic.debounce(function(query) {
    Flickr.search(query).then(function(resp) {
      $scope.photos = resp;
    });
  }, 500);
  
  $scope.search = function() {
    doSearch($scope.query);
  }

})


.controller("HomeController",["$scope","$firebaseArray","$http","$firebaseObject",
            function($scope, $firebaseArray, $http,$firebaseObject){
              var accountStatus = JSON.parse(window.localStorage['accountStatus'] || '{}');
              $scope.IsLogged = false;
              if(accountStatus.token == undefined){
                    $scope.Login = function(){
                          var ref = new Firebase("https://shining-heat-9140.firebaseio.com");
                          ref.authWithOAuthPopup("facebook", function(error, authData) {
                            if (error) {
                              console.log("Login Failed!", error);
                              alert("Login Failed!" + error);
                              $scope.IsLogged = false;
                            } else {
                              console.log("Authenticated successfully with payload:", authData);
                              window.localStorage['accountStatus'] = JSON.stringify(authData);
                               setTimeout(function () {
                                      $scope.$apply(function () {
                                          $scope.IsLogged = true;
                                          $scope.accountLogged  = authData;
                                          CreateAccountOrRecovery($scope,$firebaseArray,authData.facebook.id,$firebaseObject);
                                      });
                                  }, 1000);
                              
                            }
                          });  
                    };
                    
              }
              else
              {
                  $scope.IsLogged = true;
                  $scope.accountLogged  = accountStatus;
              }

            }])

//Controller de acceso a FIREBASE
.controller("ChatsController", ["$scope", "$firebaseArray","$http",
        function($scope, $firebaseArray, $http) {
          
          $scope.isLoading = true; 
          $scope.isReady = false;   
          //Recupero ip para obtener el perfil del usuario
          
          // setInterval(function(){
           //CREATE A FIREBASE REFERENCE
          var ref = new Firebase("https://shining-heat-9140.firebaseio.com/ChatMessage");
          var refAccount = new Firebase("https://shining-heat-9140.firebaseio.com/Perfil/200-117-81-204");
          
          // GET MESSAGES AS AN ARRAY
          $scope.messages = $firebaseArray(ref);
          $scope.myAccount = $firebaseArray(refAccount);
          $scope.isLoading = false; 
          $scope.isReady = true;
          //  }
          //  , 2000);
         
          $scope.addMessageByClick = function()
            {
               if($scope.msg) {
                  AddMessage($scope);
                }
            }



          //ADD MESSAGE METHOD
          $scope.addMessage = function(e) {
            if (e.keyCode === 13 && $scope.msg) {
              AddMessage($scope);
            }

          
 
          }
        }
      ]);

function RecoveryHistoryAndAccount($scope, $firebaseArray)
{

         //CREATE A FIREBASE REFERENCE
          var ref = new Firebase("https://shining-heat-9140.firebaseio.com/ChatMessage");
          // GET MESSAGES AS AN ARRAY
          $scope.messages = $firebaseArray(ref);
          $scope.isLoading = false; 
          $scope.isReady = true;
}


function RecoveryIP($http, $scope, $firebaseArray){
        var json = 'http://ipv4.myexternalip.com/json';
          $http.get(json).then(function(result) {
                  $scope.ipAddress = result.data.ip;
                   RecoveryHistoryAndAccount($scope,$firebaseArray);
                   $scope.isLoading = false; 
                  $scope.isReady = true;
          }, function(e) {
              $scope.ipAddress= "IPERROR";
              RecoveryHistoryAndAccount($scope,$firebaseArray);
              $scope.isLoading = false; 
              $scope.isReady = true;   
          });

}

function AddMessage(scope){
            var name = scope.name || "anonymous";

              //ADD TO FIREBASE
              scope.messages.$add({
                from: name,
                body: scope.msg
                //ipAddress: scope.ipAddress
              });

              //RESET MESSAGE
              scope.msg = "";

}

function CreateAccountOrRecovery($scope,$firebaseArray,id,$firebaseObject){
    var refAccount = new Firebase("https://shining-heat-9140.firebaseio.com/Perfil/"+id);
    var recoveryAccount = $firebaseObject(refAccount);//$firebaseArray(refAccount);
    recoveryAccount.$loaded().then(function() {
      if(recoveryAccount.userName == undefined || recoveryAccount.userName == "")
      {
        var refProfileNew = new Firebase("https://shining-heat-9140.firebaseio.com");
        var estructure = { [id]: 
                        {"userName": $scope.accountLogged.facebook.displayName,
                         "fontColor": "dark",
                         "profileImg": $scope.accountLogged.facebook.profileImageURL}};
        refProfileNew.child("Perfil").set(estructure);

      }
    else
      {
        $scope.myAccount = recoveryAccount;
      }
    });
}