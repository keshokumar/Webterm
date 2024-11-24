
var app = angular.module('flightApp', []);

app.factory('FlightFactory', function($http) {
    const apiUrl = 'http://localhost:3000/flights';

    return {
        getFlights: function() {
            return $http.get(apiUrl);
        },
        addFlight: function(flightData) {
            return $http.post(apiUrl, flightData);
        },
        updateFlight: function(flight) {
            return $http.put(`${apiUrl}/${flight._id}`, flight);
        },
        deleteFlight: function(flightId) {
            return $http.delete(`${apiUrl}/${flightId}`);
        }
    };
});

app.service('FlightService', function(FlightFactory) {
    this.fetchFlights = function() {
        return FlightFactory.getFlights();
    };

    this.createFlight = function(flightData) {
        return FlightFactory.addFlight(flightData);
    };

    this.editFlight = function(flight) {
        return FlightFactory.updateFlight(flight);
    };

    this.removeFlight = function(flightId) {
        return FlightFactory.deleteFlight(flightId);
    };
});

app.controller('FlightController', function($scope, FlightService) {
    $scope.flights = [];
    $scope.newFlight = {};
    $scope.editingFlight = null;

    FlightService.fetchFlights().then(function(response) {
        $scope.flights = response.data;
    }).catch(function(error) {
        console.error("Error fetching flights:", error);
    });

    $scope.addFlight = function() {
        FlightService.createFlight($scope.newFlight).then(function(response) {
            $scope.flights.push(response.data);
            $scope.newFlight = {}; 
        }).catch(function(error) {
            console.error("Error adding flight:", error);
        });
    };

    $scope.editFlight = function(flight) {
        $scope.editingFlight = angular.copy(flight); 
    };

 
    $scope.updateFlight = function() {
        FlightService.editFlight($scope.editingFlight).then(function(response) {
           
            let index = $scope.flights.findIndex(f => f._id === response.data._id);
            if (index !== -1) {
                $scope.flights[index] = response.data;
            }
            $scope.editingFlight = null; 
        }).catch(function(error) {
            console.error("Error updating flight:", error);
        });
    };

   
    $scope.deleteFlight = function(flightId) {
        FlightService.removeFlight(flightId).then(function() {
            $scope.flights = $scope.flights.filter(f => f._id !== flightId);
        }).catch(function(error) {
            console.error("Error deleting flight:", error);
        });
    };

    $scope.cancelEdit = function() {
        $scope.editingFlight = null;
    };
});

app.directive('viewFlight', function() {
    return {
        restrict: 'E',
        template: `
        <div class="flight-list">
            <h3>Flight List</h3>
            <ul>
                <li ng-repeat="flight in flights">
                    <div class="flight-info">
                        <p><strong>Name:</strong> {{ flight.name }}</p>
                        <p><strong>Seat:</strong> {{ flight.seat }}</p>
                        <p><strong>Source:</strong> {{ flight.source }}</p>
                        <p><strong>Destination:</strong> {{ flight.destination }}</p>
                        
                        <button ng-click="editFlight(flight)">Edit</button>
                        <button ng-click="deleteFlight(flight._id)">Delete</button>
                    </div>
                </li>
            </ul>
        </div>
        `,
        controller: function($scope, FlightService) {
            FlightService.fetchFlights().then(function(response) {
                $scope.flights = response.data;
            }).catch(function(error) {
                console.error("Error fetching flights:", error);
            });
        }
    };
});
