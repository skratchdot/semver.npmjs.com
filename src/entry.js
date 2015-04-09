'use strict';

var angular = require('angular');
var app = angular.module('SemverApp', []);
var semver = require('semver');

var REGISTRY_CORS_PROXY = 'https://cors-proxy-ee2bb0df.internal.npmjs.com';

var getPackageAndRange = function ($scope, $location) {
  var searchObject = $location.search();
  $scope.package = searchObject.package || 'lodash';
  $scope.range = searchObject.range || '1.x';
};

var setPackageAndRange = function ($scope, $location) {
  $location.search('package', $scope.package);
  $location.search('range', $scope.range);
  $location.replace();
};

app.run(function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function ($scope, $location) {
      getPackageAndRange($scope, $location);
    });
});

app.controller('VersionCtrl', function($scope, $http, $location) {
  var versions;
  getPackageAndRange($scope, $location);

  $scope.getVersions = function() {
    $scope.loading = true;
    $http.get(REGISTRY_CORS_PROXY + '/' + $scope.package)
      .success(function(data, status, headers, config) {
        versions = Object.keys(data.versions);

        $scope.versions = versions.map(function(v) {
          return {
            "version": v
          }
        })

        $scope.checkVersions = function() {
          for (var i=0, len=versions.length; i<len; i++) {
            $scope.versions[i].satisfies = semver.satisfies($scope.versions[i].version, $scope.range);
          }
          setPackageAndRange($scope, $location);
        }

        $scope.checkVersions();
        $scope.loading = false;
      })
      .error(function(data, status, headers, config) {
        $scope.loading = false;
        setPackageAndRange($scope, $location);

        console.log('Sorry, could not load data.')
      });
  }

  $scope.getVersions();
});
