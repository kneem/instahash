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

app.controller('LoginController', ['$scope', '$location', '$log', 'clientId',
    function($scope, $location, $log, clientId) {
        $log.info('LoginController: start');
        $log.info($location);
        $scope.href = 'https://instagram.com/oauth/authorize/?client_id=' +
            clientId + '&redirect_uri=' + $location.absUrl() + '&response_type=token';

        var redirectHome = function() {
            return $location.path('/').hash('');
        };

        // If already logged-in, redirect to root.
        if (localStorage.getItem('instahash_token')) {
            redirectHome();
            return;
        }

        var hash = $location.hash();
        if (hash) {
            var token = hash.split('=')[1];
            if (token) {
                // Store in localStorage.
                localStorage.setItem('instahash_token', token);
                // Re-direct.
                redirectHome();
                return;
            }
        }
    }
]);

app.controller('SlideController', ['$scope', '$http', '$location', '$log', 'clientId',
    function($scope, $http, $location, $log, clientId) {
        $log.info('SlideController: start');

        if (localStorage.getItem('instahash_recent')) {
            localStorage.removeItem('instahash_recent');
        }
        var filterData = function(data) {
            data = _.chain(data)
                .filter(function(item) {
                    // Filter out videos, we only want images.
                    return item.type === 'image';
                })
                .map(function(item) {
                    var result = {
                        img: item.images.standard_resolution.url,
                        likes: {
                            count: item.likes.count,
                            likers: _.pluck(item.likes.data, 'username')
                        },
                        link: item.link,
                        profilepic: item.user && item.user.profile_picture,
                        text: item.caption && item.caption.text,
                        timestamp: item.created_time,
                        username: item.user.username
                    };
                    return result;
                })
                .value();

            return data;
        };

        var parseDataForGrids = function(data) {
            var chunkSize = 4;
            var result = [];

            for (var i = 0; i < data.length; i += chunkSize) {
                result.push(data.slice(i, i + chunkSize));
            }

            return result;
        };

        $scope.submitForm = function(form) {
            if (form.$valid) {
                $scope.getSlides();
                return;
            }

            if (form.$error.required) {
                alert('Please enter a hashtag.');
                return;
            }

            if (form.$error.pattern) {
                alert('The hashtag you entered is invalid (only alphanumeric characters are allowed). Please enter a valid hashtag.');
                return;
            }
        };

        $scope.getSlides = function() {
            // TODO: might have to change from client_id to access_token.
            $http.jsonp('https://api.instagram.com/v1/tags/' + $scope.hashTag +
                '/media/recent?client_id=' + clientId + '&callback=JSON_CALLBACK')
            .success(function(response) {
                $log.info('success');
                localStorage.setItem('instahash_recent', response.pagination.min_tag_id);
                var data = filterData(response.data),
                    baseUrl = $location.absUrl();
                // TODO: Separate model code from controller code.
                $scope.slides = data || [];
                $scope.rows = parseDataForGrids(data);
                return $scope.rows;
            })
            .error(function(response) {
                $log.error('Error fetching tags: ' + response);
            });
        };

        $scope.appendNewSlides = function() {
            // TODO: escape/sanitize these strings.
            var mostRecent = localStorage.getItem('instahash_recent');
            if (!mostRecent || !$scope.hashTag) {
                return;
            }
            $http.jsonp('https://api.instagram.com/v1/tags/' + $scope.hashTag +
                '/media/recent?client_id=' + clientId + '&min_tag_id=' + mostRecent + '&callback=JSON_CALLBACK')
                .success(function(response) {
                    var newRecent = response.pagination.min_tag_id;
                    if (newRecent) {
                        localStorage.setItem('instahash_recent', newRecent);
                    }
                    var data = filterData(response.data);
                    if (!_.isEmpty(data)) {
                        $scope.slides = data.concat($scope.slides);
                        var newRows = parseDataForGrids($scope.slides);
                        $scope.rows = newRows;
                    }
                })
                .error(function(err) {
                    $log.error('Failed to retrieve new images: ' + err);
                });
        },

        $scope.logout = function() {
            localStorage.removeItem('instahash_token');
            $location.path('/login');
        };
    }
]);
