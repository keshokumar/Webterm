var app = angular.module('app', []);

// Factory to handle HTTP requests
app.factory('fact', function($http) {
    var base = 'http://localhost:5000/crics';
    return {
        getcric: function() {
            return $http.get(base);
        },
        createcric: function(cricdata) {
            return $http.post(base, cricdata);
        },
        updatecric: function(cric) {
            return $http.put(`${base}/${cric._id}`, cric);
        },
        delcric: function(cricid) {
            return $http.delete(`${base}/${cricid}`);
        }
    };
});

// Service to call the factory methods
app.service('serv', function(fact) {
    this.fetchcric = function() {
        return fact.getcric();
    };
    this.addcri = function(cricdata) {
        return fact.createcric(cricdata);
    };
    this.editcri = function(cric) {
        return fact.updatecric(cric);
    };
    this.remcri = function(cricid) {
        return fact.delcric(cricid);
    };
});

// Controller for managing cricket players
app.controller('ctrl', function($scope, serv) {
    $scope.cric = [];
    $scope.newcric = {};
    $scope.editcricdata = null;
    $scope.searchbyname = '';

    // Fetch cricket players data
    serv.fetchcric().then(function(response) {
        $scope.cric = response.data;
    });

    // Add a new cricket player
    $scope.addcri = function() {
        serv.addcri($scope.newcric).then(function(response) {
            $scope.cric.push(response.data);
            $scope.newcric = {};  // Clear the new player data after adding
        });
    };

    // Delete a cricket player
    $scope.deletecric = function(cricid) {
        serv.remcri(cricid).then(function(response) {
            // Remove the player from the list after deletion
            $scope.cric = $scope.cric.filter(c => c._id !== cricid);
        });
    };

    // Edit a cricket player data
    $scope.editcric = function(cric) {
        $scope.editcricdata = angular.copy(cric);  // Copy to avoid reference issues
    };

    // Update a cricket player data
    $scope.updatecric = function() {
        serv.editcri($scope.editcricdata).then(function(response) {
            // Find and update the edited player in the list
            let index = $scope.cric.findIndex(c => c._id === response.data._id);
            if (index !== -1) {
                $scope.cric[index] = response.data;  // Update the player data in the array
            }
            $scope.editcricdata = null;  // Reset the edit form
        });
    };

    // Cancel the edit operation
    $scope.canceledit = function() {
        $scope.editcricdata = null;  // Reset edit data
    };
});

// Directive to view cricketers
app.directive('viewCric', function() {
    return {
        restrict: 'E',
        template: `
            <div>
                <input type="text" ng-model="searchbyname" placeholder="Search by name">
                <div ng-repeat="cri in cric | filter: {name: searchbyname}">
                    <ul>
                        <li>Name: {{cri.name}}</li>
                        <li>Age: {{cri.age}}</li>
                        <li>Centuries: {{cri.centuries}}</li>
                        <li>Batsman: {{cri.batsman}}</li>
                        
                        <button type="button" ng-click="editcric(cri)">Edit</button>
                        <button type="button" ng-click="deletecric(cri._id)">Delete</button>
                    </ul>
                </div>
            </div>
        `,
        controller: function($scope, serv) {
            serv.fetchcric().then(function(response) {
                $scope.cric = response.data;
            });
        }
    };
});
