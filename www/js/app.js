// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

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

//Controller de acceso a FIREBASE
.controller("MyController", ["$scope", "$firebaseArray","$http",
        function($scope, $firebaseArray,$http) {
          //CREATE A FIREBASE REFERENCE
          var ref = new Firebase("https://shining-heat-9140.firebaseio.com/");
            //https://p761udnm2uh.firebaseio-demo.com/"
          var json = 'http://ipv4.myexternalip.com/json';
          $http.get(json).then(function(result) {
              console.log(result.data.ip)
          }, function(e) {
              alert("error");
          });
          // GET MESSAGES AS AN ARRAY
          $scope.messages = $firebaseArray(ref);

          //ADD MESSAGE METHOD
          $scope.addMessage = function(e) {
            if (e.keyCode === 13 && $scope.msg) {
              AddMessage($scope);
            }

          $scope.addMessageByClick = function()
            {
               if($scope.msg) {
                  AddMessage($scope);
                }
            }

          }
        }
      ]);

function AddMessage(scope){
            var name = scope.name || "anonymous";

              //ADD TO FIREBASE
              scope.messages.$add({
                from: name,
                body: scope.msg
              });

              //RESET MESSAGE
              scope.msg = "";

}