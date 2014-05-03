'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'dashboard'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'login'});
	$routeProvider.when('/reset', {templateUrl: 'partials/reset.html', controller: 'reset'});
	$routeProvider.when('/activate', {templateUrl: 'partials/activate.html', controller: 'activate'});
	$routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: 'profile'});
	$routeProvider.when('/patients', {templateUrl: 'partials/patients.html', controller: 'patients'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
