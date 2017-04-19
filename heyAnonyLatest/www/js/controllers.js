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

.controller('AppCtrl', function($scope, $location, $stateParams, $http, $rootScope, httpPreConfig, $ionicLoading, $ionicModal, $ionicPopover, $timeout, $cordovaToast, localStorageService) {
    // Form data for the login modal
    $scope.loginData = {};
    // $scope.isExpanded = false;
    // $scope.hasHeaderFabLeft = false;
    // $scope.hasHeaderFabRight = false;
    $scope.enableToast = false;
    $rootScope.data = [];
    $scope.alreadyLogged = false;
    $rootScope.data.username = "";
    $rootScope.data.tabsvisible = true;
    $rootScope.data.pagename = "";
    $rootScope.data.showTopNav = false;
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


    $scope.$on('httpCallStarted', function(e) {
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="10" stroke-miterlimit="10"></circle></svg></div>'
        });
    });
    $scope.$on('httpCallStopped', function(e) {
        //$timeout(function() {
        $ionicLoading.hide();
        //}, 300);
    });


    //  $scope.$on('$viewContentLoaded', function(){

    // });

    // $scope.$on("$ionicView.beforeEnter", function(event, data, toState){
    //     $rootScope.data.tabsvisible = false;
    //     $rootScope.data.pagename = "";
    //     $rootScope.data.showTopNav = false;
    //     console.log("State Params: ", event);
    //     console.log("State Params: ", data);
    // });

    // $scope.$on("$ionicView.enter", function(event, data){
    //    // handle event
    //    console.log("State Params: ", data.stateParams);
    // });

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
        $location.path(path);
    }

    $rootScope.data.openChat = function(toid) {

        $rootScope.data.toid = toid; //3013;
        //console.log($rootScope.data.myid + "===" + $rootScope.data.toid);
        //window.location.href = "#/app/chat";
        $location.path('/app/chat');
    };
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
                console.log(response);
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
            window.location.href = "#/app/wall";
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
            }, function myError(response) {
                //console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });
        }
        console.log(localStorageService.get("usersession"));
    };

    $scope.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
            console.log("The toast was shown");
        }, function(error) {
            console.log("The toast was not shown due to " + error);
        });
    }

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        //document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        // document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        // var content = document.getElementsByTagName('ion-content');
        // for (var i = 0; i < content.length; i++) {
        //     if (content[i].classList.contains('has-header')) {
        //         content[i].classList.toggle('has-header');
        //     }
        // }
    };

    $scope.setExpanded = function(bool) {
        //$scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        // var hasHeaderFabLeft = false;
        // var hasHeaderFabRight = false;

        // switch (location) {
        //     case 'left':
        //         hasHeaderFabLeft = true;
        //         break;
        //     case 'right':
        //         hasHeaderFabRight = true;
        //         break;
        // }

        // $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        // $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        // var content = document.getElementsByTagName('ion-content');
        // for (var i = 0; i < content.length; i++) {
        //     if (!content[i].classList.contains('has-header')) {
        //         content[i].classList.toggle('has-header');
        //     }
        // }

    };

    $scope.hideHeader = function() {
        // $scope.hideNavBar();
        // $scope.noHeader();
    };

    $scope.showHeader = function() {
        // $scope.showNavBar();
        // $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        // var fabs = document.getElementsByClassName('button-fab');
        // if (fabs.length && fabs.length > 1) {
        //     fabs[0].remove();
        // }
    };

})

.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $timeout, $stateParams, ionicMaterialInk, $ionicSideMenuDelegate, localStorageService) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
    $ionicSideMenuDelegate.canDragContent($state.current.showSideMenu);
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
        var urn = "ipsjolly"; //$.trim($scope.data.username).toLowerCase();
        var pas = "reaction9"; //$.trim($scope.data.password);
        if (!urn.length) {
            if ($scope.enableToast)
                $scope.showToast("Enter Username!", 'long', 'bottom');


            //alert("Enter Username!");
            $(".username").focus();
            return false;
        } else if (!pas.length) {
            alert("Enter Password");
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

                } else {
                    $rootScope.data.setusersession(urn);
                }
            }, function myError(response) {
                console.log(response);
                alert(path + '/master.php');
                alert("Oops, there was an error while registering/signing in. Sorry about that.");
            });


        }
    }



})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('PostCtrl', function($scope, $http, $rootScope, $state, $ionicPopup, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {
    console.log($rootScope.data.usersession);
    $rootScope.data.myid = localStorage.getItem("userid");
    $scope.allPostedStatus = [];

    $rootScope.data.pagename = $state.current.pagename;
    $scope.getAllPosts = function() {
        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                userid: $rootScope.data.myid,
                type: 'getAllStatus'

            }
        }).then(function mySucces(response) {
            console.log(response);
            $scope.allPostedStatus = response.data;
            $timeout(function() {
                $(".timeago").timeago();
                ionicMaterialMotion.fadeSlideIn();
                ionicMaterialInk.displayEffect();
            }, 0);

            ionicMaterialInk.displayEffect();
        }, function myError(response) {
            console.log(response);
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
            console.log(response);
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
                userId: $rootScope.data.myid,
                type: 'saveStatus'

            }
        }).then(function mySucces(response) {
            console.log(response);
            $("#newAdMessage").val("");
            $scope.getAllPosts();
            $ionicScrollDelegate.scrollTop();
        }, function myError(response) {
            console.log(response);
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

        $rootScope.data.myid = localStorage.getItem("userid");
        $interval.cancel($rootScope.data.checkMsgIntervelObj);
        $rootScope.data.isLoadingNext = false;
        $rootScope.data.tabsvisible = true;
        $rootScope.data.pagename = $state.current.pagename;
        $ionicSideMenuDelegate.canDragContent($state.current.showSideMenu);
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
                console.log($rootScope.data.wallList);
                $timeout(function() {
                    $(".timeago").timeago();
                    $(".loadPostPrevFrom").attr("data-lastPostId", $rootScope.data.wallList[$rootScope.data.wallList.length - 1][0]);
                    $rootScope.data.isLoadingNext = false;
                    ionicMaterialMotion.fadeSlideIn();
                    ionicMaterialInk.displayEffect();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, 0);

            }, function myError(response) {
                console.log(response);
                $rootScope.data.isLoadingNext = false;
            });

        };


        $scope.loadPersonData("", "", "", "", "", "");

        $scope.itemWallClass = function(obj){
            if(obj[6] == 'm'){
                return "custom-item-gredient-m";
            }else if(obj[6] == 'f'){
                return "custom-item-gredient-f";
            }else{
                return "custom-item-gredient";
            }
        }

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
        console.log($rootScope.data.myid + "===" + $rootScope.data.toid);
        $scope.lastMsgId = "";
        $rootScope.data.checkMsgIntervelObj = null;
        $scope.checkRecentMsg = function() {
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    user: $rootScope.data.myid,
                    to: $rootScope.data.toid,
                    lastId: $scope.lastMsgId,
                    type: 'getMsg'
                }
            }).then(function mySucces(response) {

                //ar d = response.data[7];
                //d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
                angular.forEach(response.data, function(value, key) {
                    console.log($rootScope.data.myid + "---" + value[1]);
                    console.log($rootScope.data.myid != value[1]);
                    $scope.messages.push({
                        other: $rootScope.data.myid == value[1],
                        text: value[5],
                        time: value[7]
                    });
                    $scope.lastMsgId = value[0];
                });


            }, function myError(response) {
                console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });
            console.log("checking latest msg");
        }

        $rootScope.data.startCheckMsg = function() {
            $rootScope.data.checkMsgIntervelObj = $interval(function() {
                $scope.checkRecentMsg();
            }, 2000);
        }



        $http({
            method: "GET",
            url: path + '/master.php',
            params: {
                user: $rootScope.data.myid,
                to: $rootScope.data.toid,
                type: 'getlastid'
            }
        }).then(function mySucces(response) {
            console.log(response.data);
            $scope.lastMsgId = response.data;


            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    user: $rootScope.data.usersession[0],
                    to: $rootScope.data.toid,
                    lastId: $scope.lastMsgId,
                    type: 'getOlderMsg'
                }
            }).then(function mySucces(response) {
                console.log(response.data);
                //ar d = response.data[7];
                //d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
                angular.forEach(response.data, function(value, key) {
                    console.log($rootScope.data.myid + "---" + value[1]);
                    console.log($rootScope.data.myid != value[1]);
                    $scope.messages.push({
                        other: $rootScope.data.myid == value[1],
                        text: value[5],
                        time: value[7]
                    });
                    $scope.lastMsgId = value[0];
                });
                $ionicScrollDelegate.scrollBottom();
                // $rootScope.data.startCheckMsg();
            }, function myError(response) {
                console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });


        }, function myError(response) {
            console.log(response);
            //$rootScope.data.isLoadingNext = false;
        });




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
                    toUserid: $rootScope.data.toid,
                    toUsernm: "toUsrnm",
                    frmusr: "frmMe",
                    frmusrid: $rootScope.data.myid,
                    not: 'y',
                    type: 'privmsg'
                }
            }).then(function mySucces(response) {
                console.log(response);
                $ionicScrollDelegate.scrollBottom();
            }, function myError(response) {
                console.log(response);
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
            $ionicScrollDelegate.scrollBottom(true);

        };


        $scope.inputUp = function() {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function() {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);

        };

        $scope.inputDown = function() {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };

        $scope.closeKeyboard = function() {
            // cordova.plugins.Keyboard.close();
        };


        $scope.data = {};
        $scope.myId = $rootScope.data.myid;
        $scope.messages = [];



    }).controller('ProfileCtrl', function($scope, $interval, $state, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        $rootScope.data.myid = localStorage.getItem("userid");

        $rootScope.data.pagename = $state.current.pagename;
        $scope.getMyProfile = function() {
            $http({
                method: "GET",
                url: path + '/master.php',
                params: {
                    frmusr: $rootScope.data.myid,
                    type: 'getUserdetails'
                }
            }).then(function mySucces(response) {
                console.log(response);
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
            }, function myError(response) {
                console.log(response);
                //$rootScope.data.isLoadingNext = false;
            });

        };
        $scope.getMyProfile();

        $scope.saveProfile = function() {
            var domSave = $("#saveProfile");
            var fill = true;
            $(".saveProfileitem").not('span').each(function() {
                var thisVal = domSave.val().length;
                //console.log(thisVal);
                if (thisVal) {
                    domSave.closest("label").removeClass("error");
                    //fill = true;
                } else {
                    domSave.closest("label").addClass("error");
                    var thisMsg = domSave.attr("data-message");

                    $(".alertMsg").html(thisMsg);
                    fill = false;
                }
            });

            //console.log(fill);
            if (fill) {
                $(".alertMsgWrap").removeClass("active");
            } else {
                $(".alertMsgWrap").addClass("active");
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
                    user: $.trim(localStorage.getItem("username")),
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
                        alert("Settings Saved!");
                        $("#postMessage").attr("data-setpro", 1);
                        //$.mobile.changePage('#showPersons');

                    } else {
                        $(".ui-loader").hide();
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






    }).controller('FilterCtrl', function($scope, $interval, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        $rootScope.data.myid = localStorage.getItem("userid");




    }).controller('MessagesCtrl', function($scope, $interval, $state, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        $rootScope.data.myid = localStorage.getItem("userid");
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
                    usrid: $rootScope.data.myid,
                    msgtype: msgtype,
                    type: 'getMessagesRec'

                }
            }).then(function mySucces(response) {
                console.log(response);

                $scope.allMessages = response.data;
                $timeout(function() {
                    $(".timeago").timeago();
                    ionicMaterialMotion.fadeSlideIn();
                    ionicMaterialInk.displayEffect();

                }, 0);
            }, function myError(response) {
                console.log(response);
            });
        };
        $scope.loadMessages('resc');




    }).controller('AboutUserCtrl', function($scope, $interval, $document, $rootScope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicScrollDelegate) {

        console.log($rootScope.data.otheruserid);
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
                console.log(response);
                $scope.otherProfile = response.data[0];
            }, function myError(response) {
                console.log(response);
            });
        };
        $scope.loadOtherProfile();
        $scope.allPostedStatus = [];
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
                $scope.allPostedStatus = response.data;
                $timeout(function() {
                    $(".timeago").timeago();
                }, 0);
                // $ionicScrollDelegate.scrollBottom();
            }, function myError(response) {
                console.log(response);
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