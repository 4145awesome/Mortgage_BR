// Create the module.
var app = angular.module('MBR', ['ngRoute']);

// Configure different routes
app.config(function($routeProvider, $locationProvider) {

    $routeProvider
    .when('/', {
        templateUrl : 'pages/home',
        controller  : 'HomeController'
    })

    .when('/broker', {
        templateUrl : 'broker'
    });

    //use the HTML5 History API
    $locationProvider.html5Mode(true);
});

