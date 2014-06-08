/**
 * Instahash
 *
 * Copyright 2014 Nima Dehnashi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var app = angular.module('instahash', ['ngRoute']);

app.constant('clientId', 'YOUR_CLIENT_ID');
app.config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '/app/partials/login-partial.html',
                controller: 'LoginController'
            })
            .otherwise({
                templateUrl: '/app/partials/slide-partial.html',
                controller: 'SlideController'
            });
        $locationProvider.html5Mode(true);
    }
]);

app.run(function($rootScope, $route, $location, $log) {
    $rootScope.$on('$locationChangeStart', function(evt, next, current) {
        if (!localStorage.getItem('instahash_token')) {
            $location.path('/login').replace();
            return;
        }

        $log.info('locationChange: start');
        $log.info($route, $location.path());
        $log.info(arguments);
    });
});
