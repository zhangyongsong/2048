
// tzfe stands for 2048
var tzfeApp = angular.module('tzfeApp', []);

tzfeApp.controller('mainController', ['$scope', '$window', function($scope, $window){
    $scope.PANEL = [];
    $scope.SIZE = 4;
    function initializePanel(){
        for(var i=0; i< $scope.SIZE; i++){
            $scope.PANEL[i] = [];
            for(var j=0; j< $scope.SIZE; j++){
                $scope.PANEL[i][j] = 0;
            }
        }

        $window.console.log($scope.PANEL);
    }

    function _getRandomNumber(){
        // Randomly generate 2 or 4
        return Math.floor(Math.random()*2 + 1) * 2;
    }

    function _getEmptyPositions(){
        var emptyPositions = [];
        for(var i=0; i < $scope.SIZE; i++){
            for(var j=0; j<$scope.SIZE; j++){
                if(!$scope.PANEL[i][j]){
                    var position = {
                        row: i,
                        col: j
                    };
                    emptyPositions.push(position);
                }
            }
        }

        return emptyPositions;
    }

    function insertRandomNumber(){
        var emptyPositions = _getEmptyPositions(),
            randomIndex = Math.floor(Math.random()*emptyPositions.length),
            randomLocation = emptyPositions[randomIndex],
            randomNumber = _getRandomNumber();

        if(!emptyPositions.length){
            alert('Failed!');
            return false;
        }

        $scope.PANEL[randomLocation.row][randomLocation.col] = randomNumber;
    }

    function transpose(matrix){
        return matrix[0].map(function (_, c) { return matrix.map(function (r) { return r[c]; }); });
    }

    function leftCombineColumns(arr){
        $window.console.log('Before Combine: ' + arr);
        for(var j=0; j < arr.length; j++){
            if(!arr[j]){
                continue;
            }
            for(var k=j+1; k<arr.length+1; k++){
                var original_j = j;
                if(k < arr.length && arr[j]==arr[k]){
                    arr[j] = 2 * arr[j];
                    arr[k] = 0;
                    j=k;
                }

                var previousNonZeroPos = original_j -1;
                while(previousNonZeroPos >= 0){
                    if(previousNonZeroPos>=0 && arr[previousNonZeroPos]){
                        break;
                    }
                    previousNonZeroPos--;
                }

                $window.console.debug('previousNonZeroPos: '+ previousNonZeroPos);
                var firstZeroPos = previousNonZeroPos +1;                
                if(firstZeroPos < original_j){
                    arr[firstZeroPos] = arr[original_j];
                    arr[original_j] = 0;
                }
            }
        }

        $window.console.log('After combine: '+arr);
        return arr;
    }

    function testLeftCombineColumns(){
        var arr = [2, 0, 0, 0];
        leftCombineColumns(arr);
        var arr = [0, 2, 4, 4];
        leftCombineColumns(arr);
        var arr = [2, 0, 0, 2];
        leftCombineColumns(arr);
        var arr = [2, 2, 0, 2];
        leftCombineColumns(arr);
        var arr = [2, 2, 2, 2];
        leftCombineColumns(arr);
        var arr = [0, 0, 0, 2];
        leftCombineColumns(arr);
    }

    // testLeftCombineColumns();

    $scope.combineLeft = function(){
        for(var i=0; i<$scope.SIZE; i++){
            $scope.PANEL[i] = leftCombineColumns($scope.PANEL[i]);
        }
        $window.console.debug('PANEL: ' + $scope.PANEL);
    };

    $scope.combineRight = function(){
        for(var i=0; i<$scope.SIZE; i++){
            var newArray = $scope.PANEL[i].reverse();
            newArray = leftCombineColumns(newArray);
            $scope.PANEL[i] = newArray.reverse();
        }   
    };

    $scope.combineDown = function(){
        $scope.PANEL = transpose($scope.PANEL);
        $scope.combineRight();
        $scope.PANEL = transpose($scope.PANEL);
    };

    $scope.combineUp = function(){
        $scope.PANEL = transpose($scope.PANEL);
        $scope.combineLeft();
        $scope.PANEL = transpose($scope.PANEL);
    };

    $scope.bindKeyUpEvent = function($event){
        switch($event.keyCode){
            case 37:
                $scope.combineLeft();
                insertRandomNumber();
                break;

            case 38:
                $scope.combineUp();
                insertRandomNumber();
                break;

            case 39:
                $scope.combineRight();
                insertRandomNumber();
                break;

            case 40:
                $scope.combineDown();
                // insertRandomNumber();
                break;
            default:
                $window.console.log('Press Arrow Keys to play.');
        }
        return false;
    };

    $scope.initializeTablePanel= function(){
        initializePanel();
        insertRandomNumber();
        insertRandomNumber();
    };

}]);

