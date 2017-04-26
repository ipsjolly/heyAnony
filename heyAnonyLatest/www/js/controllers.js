var waitForFinalEvent = (function() {
    var timers = {};
    return function(callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();



/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $location, $stateParams, $http, $rootScope, httpPreConfig, $ionicLoading, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $cordovaToast, localStorageService, $ionicScrollDelegate, $interval, $ionicPlatform) {
    // Form data for the login modal
    $scope.loginData = {};
    // $scope.isExpanded = false;
    // $scope.hasHeaderFabLeft = false;
    // $scope.hasHeaderFabRight = false;
    console.log("00000---" + ionic.Platform.isAndroid());

    $scope.enableToast = ionic.Platform.isAndroid();
    $rootScope.data = [];
    $scope.alreadyLogged = false;
    $rootScope.data.username = "";
    $rootScope.data.tabsvisible = true;
    $rootScope.data.pagename = "";
    $rootScope.data.currentPage = "";
    $rootScope.data.showTopNav = false;
    $rootScope.data.isChatVisible = false;
    $scope.$on('$viewContentLoaded', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.data.tabsvisible = toState.tabsvisible;
        $rootScope.data.pagename = toState.pagename;
        $rootScope.data.showTopNav = toState.showTopNav;

    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.data.tabsvisible = toState.tabsvisible;
        $rootScope.data.pagename = toState.pagename;
        $rootScope.data.showTopNav = toState.showSideBar;


    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.data.checkIfInfoFilled();
        $rootScope.data.currentPage = toState.pagename;
    });


    $scope.$on('httpCallStarted', function(e) {
        if (!$rootScope.data.isChatVisible) {
            $ionicLoading.show({
                template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>'
            });
        }
    });
    $scope.$on('httpCallStopped', function(e) {
        //$timeout(function() {
        $ionicLoading.hide();
        //}, 300);
    });

    $scope.itemWallClass = function(obj) {
        if (obj[6] == 'm') {
            return "custom-item-gredient-m";
        } else if (obj[6] == 'f') {
            return "custom-item-gredient-f";
        } else {
            return "custom-item-gredient";
        }
    }


    $scope.$on("$ionicView.afterEnter", function(event, data) {
        // handle event
        $timeout(function() {
            $(".bounce-start").addClass("bounce");
        }, 10);
        $timeout(function() {
            $(".login-container").removeClass("hide-top");
        }, 300);


    });

    $rootScope.data.goto = function(path) {

        if (window.cordova) {
            window.plugins.nativepagetransitions.fade({
                    "direction": "up"
                },
                function(msg) {
                    console.log("success: " + msg)
                },
                function(msg) {
                    alert("error: " + msg)
                }
            );
        }
        $location.path(path);
    }
    $rootScope.data.checkIfInfoFilled = function() {
        if ($rootScope.data.usersession[2].length && $rootScope.data.usersession[3].length && $rootScope.data.usersession[4].length && $rootScope.data.usersession[5] && $rootScope.data.usersession[6].length) {
            // window.location.href = "#/app/wall";
        } else {
            window.location.href = "#/app/profile";
            $scope.showToast("Please Fill Profile First :)", 'long', 'bottom');
        }
    };

    $scope.checkRecentMsg = function() {
        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                user: $rootScope.data.usersession[0],
                to: $rootScope.data.to[0],
                lastId: $scope.lastMsgId,
                type: 'getMsg'
            }
        }).then(function mySucces(response) {

            //ar d = response.data[7];
            //d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            angular.forEach(response.data, function(value, key) {
                //console.log($rootScope.data.myid + "---" + value[1]);
                // console.log($rootScope.data.myid != value[1]);
                $scope.messages.push({
                    other: $rootScope.data.usersession[0] == value[1],
                    text: value[5],
                    time: value[7]
                });
                $scope.lastMsgId = value[0];
            });
            $timeout(function() {
                $(".timeago").timeago();
            }, 0);

        }, function myError(response) {
            //console.log(response);
            //$rootScope.data.isLoadingNext = false;
        });
        console.log("checking latest msg");
    }

    $rootScope.data.startCheckMsg = function() {
        $rootScope.data.checkMsgIntervelObj = $interval(function() {
            $scope.checkRecentMsg();
        }, 2000);
    }


    $scope.hideTime = true;

    var alternate,
        isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

    $scope.sendMessage = function() {
        // alternate = !alternate;



        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                msg: $scope.data.message,
                toUserid: $rootScope.data.to[0],
                toUsernm: $rootScope.data.to[1],
                frmusr: $rootScope.data.usersession[1],
                frmusrid: $rootScope.data.usersession[0],
                not: 'y',
                type: 'privmsg'
            }
        }).then(function mySucces(response) {
            //console.log(response);
            $ionicScrollDelegate.$getByHandle('chatMainScroll').scrollBottom();
        }, function myError(response) {
            //console.log(response);
            //$rootScope.data.isLoadingNext = false;
        });




        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        // $scope.messages.push({
        //   userId: alternate ? '12345' : '54321',
        //   text: $scope.data.message,
        //   time: d
        // });
        $scope.messages.push({
            other: true,
            text: $scope.data.message,
            time: d
        });

        delete $scope.data.message;
        $ionicScrollDelegate.$getByHandle('chatMainScroll').scrollBottom(true);

    };


    $scope.inputUp = function() {
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
            $ionicScrollDelegate.$getByHandle('chatMainScroll').scrollBottom(true);
        }, 300);

    };

    $scope.inputDown = function() {
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
    };

    $scope.closeKeyboard = function() {
        // cordova.plugins.Keyboard.close();
    };


    // $scope.data = {};
    // //$scope.myId = $rootScope.data.usersession[0];


    $rootScope.data.openChat = function(toid) {
        $rootScope.data.isChatVisible = true;
        $rootScope.data.checkMsgIntervelObj = null;
        $rootScope.data.startCheckMsg();
        $scope.messages = [];
        $scope.modalChat.show();
        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                frmusr: toid,
                type: 'getUserdetails'
            }
        }).then(function mySucces(response) {
            console.log(response.data);
            var data = response.data;
            $rootScope.data.to = response.data[0]; //3013;
            //$location.path('/app/chat');


            $scope.lastMsgId = "";

            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    user: $rootScope.data.usersession[0],
                    to: $rootScope.data.to[0],
                    type: 'getlastid'
                }
            }).then(function mySucces(response) {
                //console.log(response.data);
                $scope.lastMsgId = response.data;


                $http({
                    method: "GET",
                    url: path + '/master.php',
                    params: {
                        user: $rootScope.data.usersession[0],
                        to: $rootScope.data.to[0],
                        lastId: $scope.lastMsgId,
                        type: 'getOlderMsg'
                    }
                }).then(function mySucces(response) {
                    //console.log(response.data);
                    //ar d = response.data[7];
                    //d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
                    angular.forEach(response.data, function(value, key) {
                        //console.log($rootScope.data.myid + "---" + value[1]);
                        //console.log($rootScope.data.myid != value[1]);
                        $scope.messages.push({
                            other: $rootScope.data.usersession[0] == value[1],
                            text: value[5],
                            time: value[7]
                        });
                        $scope.lastMsgId = value[0];
                    });
                    $timeout(function() {
                        $(".timeago").timeago();
                    }, 0);
                    $ionicScrollDelegate.$getByHandle('chatMainScroll').scrollBottom();

                }, function myError(response) {
                    //console.log(response);
                    //$rootScope.data.isLoadingNext = false;
                });


            }, function myError(response) {
                //console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });








        }, function myError(response) {});

    };



    $ionicPlatform.onHardwareBackButton(function() {
        if ($rootScope.data.isChatVisible) {
            $scope.closeModalChat();
        } else if (!$rootScope.data.isChatVisible && $state.current.name == 'app.wall') {
            $ionicPopup.confirm({
                title: 'Hey! Want to exit?',
                template: 'Want to exit?',
                cancelText: 'No :)',
                okText: 'Yes :|'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            });
        }

        $scope.showToast($state.current.name, 'short', 'bottom');
        $scope.showToast($rootScope.data.isChatVisible, 'short', 'bottom');
        //console.log();
    });





    $ionicModal.fromTemplateUrl('templates/chat.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {



        $scope.modalChat = modal;


    });
    $scope.openModal = function() {
        $scope.modalChat.show();
    };
    $scope.closeModalChat = function() {
        $scope.modalChat.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modalChat.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        $rootScope.data.isChatVisible = false;
        $interval.cancel($rootScope.data.checkMsgIntervelObj);
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    $scope.$on('modal.shown', function() {

    });











    $rootScope.data.otheruserid = localStorageService.get("otheruser");
    $rootScope.data.allCountries = localStorageService.get("countries");
    $rootScope.data.usersession = localStorageService.get("usersession");
    //localStorageService.remove("countries")

    $rootScope.data.setOtherUser = function(otheruserid) {
        localStorageService.set("otheruser", otheruserid);
        $rootScope.data.otheruserid = otheruserid;
    }


    $rootScope.data.getCountries = function() {
        //console.log(localStorageService.get("countries"));
        if (localStorageService.get("countries") !== null) {
            $rootScope.data.allCountries = localStorageService.get("countries");
        } else {
            //console.log(localStorageService.get("countries"));
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    type: 'getAllCountries'
                }
            }).then(function mySucces(response) {
                //console.log(response.data);
                localStorageService.set("countries", response.data);
                $rootScope.data.allCountries = localStorageService.get("countries");
            }, function myError(response) {
                //console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });
        }


    };
    $rootScope.data.getCountries();

    $rootScope.logout = function() {
        localStorageService.remove("usersession");
        window.location.href = "#";
        //localStorageService.remove("countries")
    };

    $rootScope.data.setusersession = function(username) {

        if (0) {
            $rootScope.data.usersession = localStorageService.get("usersession");
            $rootScope.data.checkIfInfoFilled();
            //window.location.href = "#/app/wall";
        } else {
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    frmusr: username,
                    type: 'getUserdetailsName'
                }
            }).then(function mySucces(response) {
                //console.log(response.data);
                localStorageService.set("usersession", response.data[0]);
                $rootScope.data.usersession = localStorageService.get("usersession");
                window.location.href = "#/app/wall";
                $rootScope.data.checkIfInfoFilled();

            }, function myError(response) {
                ////console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });
        }
        console.log(localStorageService.get("usersession"));
    };

    $scope.showToast = function(message, duration, location) {
        if ($scope.enableToast) {
            $cordovaToast.show(message, duration, location).then(function(success) {
                console.log("The toast was shown");
            }, function(error) {
                console.log("The toast was not shown due to " + error);
            });
        } else {
            alert(message);
        }
    }

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }


})

.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $timeout, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, localStorageService) {


    ionicMaterialInk.displayEffect();
    $ionicSideMenuDelegate.canDragContent($state.current.showSideBar);
    $rootScope.data.tabsvisible = false;
    $scope.checkIfLoggedIn = function() {
        // localStorageService.remove("usersession");
        console.log(localStorageService.get("usersession"));
        if (localStorageService.get("usersession") === null) {
            console.log("new");
            $scope.alreadyLogged = false;
        } else {
            console.log("logged");
            $rootScope.data.username = localStorageService.get("usersession")[1];
            $scope.alreadyLogged = true;
            $timeout(function() {
                $rootScope.data.goto('/app/wall')
            }, 3500);
        }
    };
    $scope.checkIfLoggedIn();
    $scope.loginRegister = function() {
        var urn = $.trim($scope.data.username).toLowerCase(); //"ipsjolly"; //
        var pas = $.trim($scope.data.password); //"reaction9"; //
        if (!urn.length) {

            $scope.showToast("Enter Username!", 'long', 'bottom');


            //alert("Enter Username!");
            //$(".username").focus();
            return false;
        } else if (!pas.length) {
            $scope.showToast("Enter Password!", 'long', 'bottom');
            //alert("Enter Password");
            $(".password").focus();
            return false;
        } else {

            //alert(path + '/master.php');
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    urn: urn,
                    pas: pas,
                    type: 'su'
                }
            }).then(function mySucces(response) {
                var data = response.data;
                console.log(data);
                if (data == 0) {
                    $scope.showToast("Password InCorrect or Username Not Available", 'long', 'bottom');
                } else {
                    $rootScope.data.setusersession(urn);
                }
            }, function myError(response) {
                //console.log(response);
                alert(path + '/master.php');
                alert("Oops, there was an error while registering/signing in. Sorry about that.");
            });


        }
    }



})


.controller('PostCtrl', function($scope, $http, $rootScope, $state, $ionicPopup, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {
    console.log($rootScope.data.usersession);
    //$rootScope.data.myid = $rootScope.data.usersession[0];//localStorage.getItem("userid");
    $scope.allPostedStatus = [];

    $rootScope.data.pagename = $state.current.pagename;
    $scope.getAllPosts = function() {
        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                userid: $rootScope.data.usersession[0],
                type: 'getAllStatus'

            }
        }).then(function mySucces(response) {
            //console.log(response);
            $scope.allPostedStatus = response.data;
            if ($scope.allPostedStatus.length) {
                $timeout(function() {
                    $(".timeago").timeago();
                    ionicMaterialMotion.fadeSlideIn();
                    ionicMaterialInk.displayEffect();
                }, 0);
            }
            ionicMaterialInk.displayEffect();

        }, function myError(response) {
            //console.log(response);
            //$rootScope.data.isLoadingNext = false;
        });
    };
    $scope.getAllPosts();

    $scope.delConfirm = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sure to Delete?',
            template: 'Your Amazing Status'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                $scope.removeStatus(id);
            } else {
                console.log('You are not sure');
            }
        });
    };
    $scope.removeStatus = function(id) {
        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                statid: id,
                type: 'delMyStatus'

            }
        }).then(function mySucces(response) {
            $scope.getAllPosts();
        }, function myError(response) {
            //console.log(response);
            //$rootScope.data.isLoadingNext = false;
        });
    };



    $scope.postMyStatus = function() {

        var thisVal = $.trim($("#newAdMessage").val());
        if (!thisVal) {
            alert("Text can't be blank!")
            return false
        }
        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                thisVal: thisVal,
                userId: $rootScope.data.usersession[0],
                type: 'saveStatus'

            }
        }).then(function mySucces(response) {
            //console.log(response);
            $("#newAdMessage").val("");
            $scope.getAllPosts();
            $ionicScrollDelegate.scrollTop();
        }, function myError(response) {
            //console.log(response);
        });


    };


})

.directive('input', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function(scope, element, attr) {
                element.bind('focus', function(e) {
                    if (scope.onFocus) {
                        $timeout(function() {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function(e) {
                    if (scope.onBlur) {
                        $timeout(function() {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function(e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function() {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })
    .controller('WallCtrl', function($scope, $interval, $rootScope, $state, $http, $stateParams, $timeout, ionicMaterialMotion, $ionicSideMenuDelegate, ionicMaterialInk, $ionicScrollDelegate) {

        //$rootScope.data.myid = localStorage.getItem("userid");
        $interval.cancel($rootScope.data.checkMsgIntervelObj);
        $rootScope.data.isLoadingNext = false;
        $rootScope.data.tabsvisible = true;
        $rootScope.data.pagename = $state.current.pagename;
        console.log($state.current.showSideBar);
        $ionicSideMenuDelegate.canDragContent($state.current.showSideBar);
        $rootScope.data.returnProfile = function(obj) {
            var bio = [];
            if (obj[6] == 'f') {
                bio.gender = 'Female';
            } else if (obj[6] == 'm') {
                bio.gender = 'Male';
            }
            return bio;
        };


        $rootScope.data.wallList = [];
        $scope.loadPersonData = function(thisVal, datamsg, gender, looking, lastPostId, thisCountry) {
            $(".loadPostPrevFrom").attr("data-lastPostId", "0");
            //var thisVal = "";
            //var datamsg = "";
            //var gender = "";
            //var looking = "";
            //$rootScope.data.isLoadingNext = true;
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    country: thisCountry,
                    shwt: thisVal,
                    prevFrom: lastPostId,
                    type: 'getstype'
                }
            }).then(function mySucces(response) {


                angular.forEach(response.data, function(value, key) {
                    $rootScope.data.wallList.push(value);
                });
                //console.log($rootScope.data.wallList);
                $timeout(function() {
                    $(".timeago").timeago();
                    $(".loadPostPrevFrom").attr("data-lastPostId", $rootScope.data.wallList[$rootScope.data.wallList.length - 1][0]);
                    $rootScope.data.isLoadingNext = false;
                    ionicMaterialMotion.fadeSlideIn();
                    ionicMaterialInk.displayEffect();
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }, 0);

            }, function myError(response) {
                //console.log(response);
                $rootScope.data.isLoadingNext = false;
            });

        };


        // $scope.loadPersonData("", "", "", "", "", "");



        $scope.loadNextRecords = function() {
            // var thisVal = $("#selectGenderToSee").val();
            //var thisCountry = $("#selectCountryToSeeFrom").val();
            var lastPostId = $(".loadPostPrevFrom").attr("data-lastPostId");
            //$datamsg = "";
            console.log(lastPostId);
            //if (!$rootScope.data.isLoadingNext)
            $scope.loadPersonData("", "", "", "", lastPostId, "");
        }
        $scope.checkScroll = function() {
            var currentTop = $ionicScrollDelegate.getScrollPosition().top;
            var maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;

            if (currentTop >= (maxTop - 50)) {
                waitForFinalEvent(function() {
                    $scope.loadNextRecords();
                    console.log(currentTop + "--" + maxTop);
                }, 200, "some unique string");

            }
        };
    }).controller('ChatCtrl', function($scope, $interval, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {
        //console.log($rootScope.data.myid + "===" + $rootScope.data.to);

        return;








     


    }).controller('ProfileCtrl', function($scope, $interval, $state, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        //$rootScope.data.myid = localStorage.getItem("userid");
 $timeout(function() {
             
        $rootScope.data.pagename = $state.current.pagename;
        $scope.getMyProfile = function() {
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    frmusr: $rootScope.data.usersession[0],
                    type: 'getUserdetails'
                }
            }).then(function mySucces(response) {
                //console.log(response);
                var data = response.data;
                var el = $("#myGender");
                el.val(data[0][4]).attr('selected', true).siblings('option').removeAttr('selected');
                //el.selectmenu("refresh", true);
                var el = $("#yourGender");
                el.val(data[0][5]).attr('selected', true).siblings('option').removeAttr('selected');
                //el.selectmenu("refresh", true);
                var el = $("#birthAge");
                el.val(data[0][6]).attr('selected', true).siblings('option').removeAttr('selected');
                //el.selectmenu("refresh", true);
                if (!$(".countryName").val().length)
                    $(".countryName").val(data[0][2]);
                if (!$(".stateName").val().length)
                    $(".stateName").val(data[0][3]);

                $(".mYuserName").html(data[0][1]);
                ionicMaterialInk.displayEffect();
                ionicMaterialMotion.fadeSlideIn();
            }, function myError(response) {
                ////console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });

        };
        $scope.getMyProfile();

        $scope.saveProfile = function() {
            var domSave = $("#saveProfile");
            var fill = true;
            var errorText = "";
            $(".saveProfileitem").not('span').each(function() {
                var thisVal = $(this).val().length;
                //console.log(thisVal);
                if (thisVal) {
                    $(this).closest("label").removeClass("error");
                    //fill = true;
                } else {
                    $(this).closest("label").addClass("error");
                    var thisMsg = $(this).attr("data-message");
                    ////console.log(thisMsg);   
                    $(".alertMsg").html(thisMsg);
                    errorText += thisMsg + '\n';
                    fill = false;
                }
            });

            ////console.log(fill);
            if (fill) {
                //$(".alertMsgWrap").removeClass("active");
            } else {
                //$(".alertMsgWrap").addClass("active");
                $scope.showToast(errorText, 'long', 'top');
                return false;
            }

            var mg = $("#myGender").val();
            var yg = $("#yourGender").val();
            var gm = $("#birthAge").val();
            var cn = $(".countryName").val();
            var sn = $(".stateName").val();

            $.ajax({
                type: 'GET',
                url: path + '/master.php',
                data: {
                    mg: mg,
                    yg: yg,
                    gm: gm,
                    cn: cn,
                    sn: sn,
                    user: $.trim($rootScope.data.usersession[0]),
                    type: 'saveset'
                },
                beforeSend: function() {
                    $(".ui-loader").show();
                    $("#saveProfile").html("Saving...");
                    //$("#saveProfile").button("refresh");
                },
                success: function(data) {
                    if (data == 1) {
                        $(".ui-loader").hide();
                        $("#saveProfile").html("Saved! :)");
                        //$("#saveProfile").button("refresh");
                        //alert("Settings Saved!");
                        $scope.showToast("Settings Saved!", 'long', 'top');
                        $("#postMessage").attr("data-setpro", 1);
                        $rootScope.data.setusersession($rootScope.data.usersession[1]);
                        // $rootScope.data.checkIfInfoFilled();
                        //$.mobile.changePage('#showPersons');

                    } else {
                        //$(".ui-loader").hide();
                        $("#saveProfile").html("Error :(");
                        //$("#saveProfile").button("refresh");
                        alert("Oops, there was an error while updating your profile. Sorry about that.");
                    }
                    setTimeout(function() {
                        $("#saveProfile").html("Save profile");
                        //$("#saveProfile").button("refresh");
                    }, 2000);
                },
                error: function() {
                    $(".ui-loader").hide();
                    alert("Oops, there was an error while updating your profile. Sorry about that.");
                }
            });
        }



                    }, 1000);


    }).controller('FilterCtrl', function($scope, $interval, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        // $rootScope.data.myid = localStorage.getItem("userid");




    }).controller('MessagesCtrl', function($scope, $interval, $state, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        //$rootScope.data.myid = localStorage.getItem("userid");
        $scope.allMessages = [];
        $scope.showMsgType = 'resc';

        $rootScope.data.pagename = $state.current.pagename;
        $scope.loadMessages = function(msgtype) {
            $scope.showMsgType = msgtype;
            $scope.allMessages = [];
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    usrid: $rootScope.data.usersession[0],
                    msgtype: msgtype,
                    type: 'getMessagesRec'

                }
            }).then(function mySucces(response) {
                ////console.log(response);

                $scope.allMessages = response.data;
                if ($scope.allMessages.length) {
                    $timeout(function() {
                        $(".timeago").timeago();
                        ionicMaterialMotion.fadeSlideIn();
                        ionicMaterialInk.displayEffect();

                    }, 0);
                }
            }, function myError(response) {
                ////console.log(response);
            });
        };
        $scope.loadMessages('resc');




    }).controller('AboutUserCtrl', function($scope, $interval, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        // console.log($rootScope.data.otheruserid);
        $scope.loadOtherProfile = function(msgtype) {
            $scope.showMsgType = msgtype;
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    frmusr: $rootScope.data.otheruserid,
                    type: 'getUserdetails'

                }
            }).then(function mySucces(response) {

                $scope.otherProfile = response.data[0];
                console.log(response);
            }, function myError(response) {
                ////console.log(response);
            });
        };
        $scope.loadOtherProfile();
        $scope.allPostedInfoStatus = [];
        $scope.getAllPosts = function() {
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    userid: $rootScope.data.otheruserid,
                    type: 'getAllStatus'

                }
            }).then(function mySucces(response) {
                console.log(response);
                $scope.allPostedInfoStatus = response.data;
                if ($scope.allPostedInfoStatus.length) {
                    $timeout(function() {
                        $(".timeago").timeago();
                        ionicMaterialMotion.fadeSlideIn();
                        ionicMaterialInk.displayEffect();
                    }, 0);
                }




            }, function myError(response) {
                ////console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });
        };
        $scope.getAllPosts();

    }).factory('httpPreConfig', ['$http', '$rootScope', function($http, $rootScope) {
        $http.defaults.transformRequest.push(function(data) {
            $rootScope.$broadcast('httpCallStarted');
            return data;
        });
        $http.defaults.transformResponse.push(function(data) {
            $rootScope.$broadcast('httpCallStopped');
            return data;
        })
        return $http;
    }]);
