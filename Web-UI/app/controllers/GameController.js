'use strict';

ShassaroApp.factory('GameSocket', function ($websocket, SETTINGS, $rootScope) {
    var socket = $websocket(SETTINGS.wsUrl + $rootScope.currentUser.username + '-game?subscribe-broadcast');
    return {
        onMessage: socket.onMessage
    };
});

ShassaroApp.controller('GameController', function ($scope, $interval, $location, GameSocket, ActiveGames, Users) {
    GameSocket.onMessage(function (event) {
        var data = JSON.parse(event.data);
        if(angular.isDefined(data.id)){
            // game is over
            $location.path('/gameResult');
        }
        else{
            // handle active game object
            $scope.opponentGoalsCompleted = data.remote_goals_count;
        }
    });

    App.sidebar('close-sidebar');

    $scope.isConnected = false;
    $scope.username = $scope.currentUser.username;
    $scope.gameCompleted = false;

    $scope.getOpponentGoalsCount = function () {
        return Array($scope.opponentGoalsCompleted);
    };

    ActiveGames.get({username: $scope.username}).$promise
        .then(function (gameInfo) {
            $scope.vncHost = gameInfo.docker_manager_ip;
            $scope.vncPort = gameInfo.vnc_port;
            $scope.vncPassword = gameInfo.password;
            $scope.goals = [];
            if(angular.isDefined(gameInfo.goals)) {
                for (var i = 0; i < gameInfo.goals.length; i++) {
                    $scope.goals.push({description: gameInfo.goals[i], hint: gameInfo.hints[i]});
                }
            }
            $scope.opponentIP = gameInfo.remote_ip;
            Users.get({username: gameInfo.remote_username}).$promise.then(function (user) {
                $scope.opponentUsername = user.username;
                $scope.opponentMail =  user.email;
                $scope.opponentDisplayName = user.first_name + ' ' + user.last_name;
            });
            $scope.opponentGoalsCompleted = gameInfo.remote_goals_count;
            $scope.isConnected = true;

            $scope.gameStartTime = new Date(gameInfo.start_time);
            $scope.gameEndTime = $scope.gameStartTime.addMinutes(gameInfo.duration).getTime();
            $scope.gameStartTime = $scope.gameStartTime.getTime();
        })
        .catch(function () {
           $scope.dockerConnectionError = true;
        });


    $scope.verifyGoal = function (goal) {
        goal.invoked = true;
        ActiveGames.verifyGoal({username: $scope.username, hash: goal.hash}).$promise
            .then(function (response) {
                goal.completed = response.status;
                $scope.gameCompleted = response.all_completed;
            });
    };

    //$scope.$on('timer-stopped', function (event, data){
    //    $scope.$apply(function () {
    //        $location.path('/gameResult');
    //    });
    //});

    $scope.$on('$destroy', function() {
        App.sidebar('open-sidebar');
    });
});