// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput','ngCordova','LocalStorageModule', 'templates'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        pagename:'login',
        showSideBar:false,
        tabsvisible:true,
        params: { test: false },
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.chat', {
        url: '/chat',
        pagename:'chat',
        showSideBar:true,
        tabsvisible:false,
        views: {
            'menuContent': {
                templateUrl: 'templates/chat.html',
                controller: 'ChatCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.post', {
        url: '/post',
        pagename:'post',
        showSideBar:true,
        tabsvisible:true,
        views: {
            'menuContent': {
                templateUrl: 'templates/post.html',
                controller: 'PostCtrl'
            },
            'fabContent': {
                template: ''
            }
        },
        onEnter: function(){
        },
        onExit: function(){
           
        }
    })

    .state('app.profile', {
        url: '/profile',
        pagename:'profile',
        showSideBar:true,
        tabsvisible:true,
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: ''
            }
        },
        onEnter: function(){
        },
        onExit: function(){
           
        }
    })
    .state('app.filter', {
        url: '/filter',
        pagename:'filter',
        showSideBar:true,
        tabsvisible:true,
        views: {
            'menuContent': {
                templateUrl: 'templates/filter.html',
                controller: 'FilterCtrl'
            },
            'fabContent': {
                template: ''
            }
        },
        onEnter: function(){
        },
        onExit: function(){
           
        }
    })

    .state('app.wall', {
        url: '/wall',
        pagename:'wall',
        showSideBar:true,
        tabsvisible:true,
        stateParams: { test: false },
        views: {
            'menuContent': {
                templateUrl: 'templates/wall.html',
                controller: 'WallCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" ng-click="gotopost()" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($scope,$timeout) {
                    $scope.gotopost = function(){
                        window.location.href = "#/app/post";
                    };
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

    .state('app.messages', {
        url: '/messages',
        pagename:'messages',
        showSideBar:true,
        tabsvisible:true,
        views: {
            'menuContent': {
                templateUrl: 'templates/messages.html',
                controller: 'MessagesCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" ng-click="gotopost()" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($scope,$timeout) {
                    $scope.gotopost = function(){
                        window.location.href = "#/app/post";
                    };
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    .state('app.aboutuser', {
        url: '/aboutuser',
        pagename:'aboutuser',
        showSideBar:true,
        tabsvisible:true,
        views: {
            'menuContent': {
                templateUrl: 'templates/aboutuser.html',
                controller: 'AboutUserCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" ng-click="gotopost()" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($scope,$timeout) {
                    $scope.gotopost = function(){
                        window.location.href = "#/app/post";
                    };
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
