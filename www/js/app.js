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
        function($scope, $firebaseArray, $http) {
          
          $scope.isLoading = true; 
          $scope.isReady = false;   
          //Recupero ip para obtener el perfil del usuario
          
           setInterval(function(){
            RecoveryIP($http,$scope,$firebaseArray);
            }
            , 2000);
          

          /*while($scope.loading)
          {
            console.log('esperando response');

          }*/
          
/*          var json = 'http://ipv4.myexternalip.com/json';
          var promise =  $http.get(json);

          promise.then(
              function(payload) { 
                  $scope.ipAddress = payload.data.ip;
              },
              function(errorPayload) {
                  console.log('error');
              });*/

         
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
          var refAccount = new Firebase("https://shining-heat-9140.firebaseio.com/Perfil/200-117-81-204");
          


          // GET MESSAGES AS AN ARRAY
          $scope.messages = $firebaseArray(ref);
          
          $scope.myAccount = $firebaseArray(refAccount);
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
                body: scope.msg,
                ipAddress: scope.ipAddress
              });

              //RESET MESSAGE
              scope.msg = "";

}
