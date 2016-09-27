'use strict';

var angular = require('angular');
var app = angular.module('SemverApp', []);
var semver = require('semver');

const REGISTRY_CORS_PROXY = 'https://npm-registry-cors-proxy.herokuapp.com';

app.controller('VersionCtrl', function($scope, $http) {
  var versions;
  $scope.package = 'lodash';

  $scope.getVersions = function() {
    $scope.loading = true;
    $http.get(REGISTRY_CORS_PROXY + '/' + $scope.package)
      .success(function(data, status, headers, config) {
        versions = Object.keys(data.versions);

        $scope.range = '1.x'
        $scope.versions = versions.map(function(v) {
          return {
            "version": v
          }
        })

        $scope.checkVersions = function() {
          for (var i=0, len=versions.length; i<len; i++) {
            $scope.versions[i].satisfies = semver.satisfies($scope.versions[i].version, $scope.range);
          }
        }

        $scope.checkVersions();
        $scope.loading = false;
      })
      .error(function(data, status, headers, config) {
        $scope.loading = false;

        console.log('Sorry, could not load data.')
      });
  }

  $scope.getVersions();
});
