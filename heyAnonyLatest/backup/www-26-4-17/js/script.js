/*****************Notification START********************/

var pushNotification;
var path = "http://heyanony.website/busiHeyAnony";

function checkIfUserSet(){
	if (typeof localStorage.getItem("username") !== 'undefined' && localStorage.getItem("username") !== null && localStorage.getItem("username").length){
    	return true;
    }else{
    	return false;
    }
}



function setNotification() {

	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			urenm : $.trim(localStorage.getItem("username")),
			gcmdevice : "webBrowserDevice",
			type : 'regdevice'
		},
		beforeSend : function () {},
		success : function (data) {
			if (data == 1) {

				window.location.href = "#/app/wall";

			} else {}
			$(".ui-loader").hide();
		},
		error : function () {
			$(".ui-loader").hide();
		}
	});

	return;
	$("#app-status-ul").append('<li>deviceready event received</li>');

	document.addEventListener("backbutton", function (e) {
		$("#app-status-ul").append('<li>backbutton event received</li>');

		if ($("#home").length > 0) {

			e.preventDefault();
			navigator.app.exitApp();
		} else {
			navigator.app.backHistory();
		}
	}, false);

	try {
		pushNotification = window.plugins.pushNotification;

		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos') {
			pushNotification.register(successHandler, errorHandler, {
				"senderID" : "1090072155773",
				"ecb" : "onNotification"
			}); // required!
		} else {
			pushNotification.register(tokenHandler, errorHandler, {
				"badge" : "true",
				"sound" : "true",
				"alert" : "true",
				"ecb" : "onNotificationAPN"
			}); // required!
		}
	} catch (err) {
		txt = "There was an error on this page.\n\n";
		txt += "Error description: " + err.message + "\n\n";
		//console.log(txt);
	}
}

// handle GCM notifications for Android
function onNotification(e) {
	switch (e.event) {
	case 'registered':
		if (e.regid.length > 0) {
			$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			//alert("regID ------------= " + e.regid);


			$.ajax({
				type : 'GET',
				url : path+'/master.php',
				data : {
					urenm : $.trim(localStorage.getItem("username")),
					gcmdevice : e.regid,
					type : 'regdevice'
				},
				beforeSend : function () {},
				success : function (data) {
					if (data == 1) {

						window.location.href = "#/app/wall";

					} else {}
					$(".ui-loader").hide();
				},
				error : function () {
					$(".ui-loader").hide();
				}
			});

		}
		break;

	case 'message':
		// if this flag is set, this notification happened while we were in the foreground.
		// you might want to play a sound to get the user's attention, throw up a dialog, etc.
		if (e.foreground) {
			$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

			// on Android soundname is outside the payload.
			// On Amazon FireOS all custom attributes are contained within payload
			var soundfile = e.soundname || e.payload.sound;
			// if the notification contains a soundname, play it.
			var my_media = new Media("/android_asset/www/" + soundfile);

			my_media.play();
		} else { // otherwise we were launched because the user touched a notification in the notification tray.
			if (e.coldstart)
				$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
			else
				$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
		}

		$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
		//android only
		$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
		//amazon-fireos only
		$("#app-status-ul").append('<li>MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
		break;

	case 'error':
		$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
		break;

	default:
		$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
		break;
	}
}
function successHandler(result) {}
function errorHandler(error) {}

/*****************Notification END********************/

$.fn.hasAttr = function (name) {
	return this.attr(name) !== undefined;
};

var loadDone = true;

function postNewAd(x) {
	var thisVal = $.trim($("#newAdMessage").val());

	if (!thisVal) {
		alert("Text can't be blank!")
		return false
	}

	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			thisVal : thisVal,
			user : $.trim(localStorage.getItem("username")),
			type : 'saveStatus'
		},
		//data: { thisVal:thisVal,user:"ipsjolly",type:'saveStatus' },
		dataType : 'json',
		beforeSend : function () {
			$(".ui-loader").show();
		},
		success : function (data) {

			$(".ui-loader").hide();
			$("#newAdMessage").val("");
			$("#newAdMessage").attr("placeholder", "Your Status Submitted :)");
			//$("#newAdDiv").slideUp()

			//$("#postMessage").slideDown();


			$.each(data, function (i) {
				if (data[i][1] != "00001") {

					$gender = "";
					if (data[i][6] == 'm') {
						$gender = "Male";
					} else if (data[i][6] == 'f') {
						$gender = "Female";
					}

					$looking = "";
					if (data[i][7] == 'm') {
						$looking = "Male";
					} else if (data[i][7] == 'f') {
						$looking = "Female";
					} else if (data[i][7] == 'e') {
						$looking = "Everyone";
					}

					var thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' myPost" data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><div class="ribbon"><span>My Status</span></div><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><button class="button button-small button-block button-assertive youOwnPost">Really? send msg to Yourself ;)</button></div></div></ion-item>';

					$(".requestForThisGrp").prepend(thisDiv);
					$(".timeago").timeago();
				} else {
					$(".requestForThisGrp").html("No Requests Yet :)");
				}
			});

		},
		error : function () {
			$(".ui-loader").hide();
			alert("Error! Plz Try Again");
		}
	});

}

function generateUID() {
	return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
}

function sendMsg() {

	$("#sendMsg").focus();
	var msg = $.trim($("#sendMsg").val());

	if (!$("#sendMsgButton").hasClass("disable") && msg.length > 0) {

		var time = new Date();
		var timedate = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

		$.ajax({
			type : 'GET',
			url : path+'/master.php',
			data : {
				msg : msg,
				toUserid : $("#chatWindow").attr("data-userid"),
				toUsernm : $("#chatWindow").attr("data-usrnm"),
				frmusr : $.trim(localStorage.getItem("username")),
				frmusrid : $.trim(localStorage.getItem("userid")),
				not : 'n',
				type : 'privmsg'
			},
			beforeSend : function () {
				uniq = generateUID();

				//alert($("#chatWindow").attr("data-userid")+"---"+$("#chatWindow").attr("data-usrnm"));

				$(".getData").append("<div   class='allMsg showUserPro'><span class='imageClass myImage femaleImage'   style='background-image:url()'></span><div id='" + uniq + "' class='femaleMsg myMsg addMsg'><span class='textMsg'>" + msg + "</span><span class='timeMsg timeago' title='" + timedate + "'></span><span class='notsentmsg' id='m" + uniq + "'></div></div>");
				//$("body").animate({ scrollTop:$(".ui-content:visible").height()}, 600);

				$('.scroll').css('-webkit-transform', 'translate3d(0,0,0)');

				$("#" + uniq).css("opacity", "0.6");
				$(".timeago").timeago();
			},
			success : function (data) {

				setTimeout(function () {
					$.ajax({
						type : 'GET',
						url : path+'/master.php',
						data : {
							msg : msg,
							toUserid : $("#chatWindow").attr("data-userid"),
							toUsernm : $("#chatWindow").attr("data-usrnm"),
							frmusr : $.trim(localStorage.getItem("username")),
							frmusrid : $.trim(localStorage.getItem("userid")),
							type : 'chatalert'
						},
						beforeSend : function () {
							// $("#sendMsg").attr("placeholder","Sending...");
						},
						success : function (data) {},
						error : function () {
							$(".ui-loader").hide();
							console.log("error in saving msg");
						}
					});

				}, 2000);

				$("#" + uniq).animate({
					opacity : 1
				}, 500);

			},
			error : function () {
				$(".ui-loader").hide();
				$("#m" + uniq).html("Msg Not Sent!");
			}
		});

	}
	$("#sendMsg").val("");

}

function setProfile() {
return;
	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			user : $.trim(localStorage.getItem("username")),
			type : 'getUserDetails'
		},
		dataType : 'json',
		beforeSend : function () {
			$(".ui-loader").show();
		},
		success : function (data) {
			$.each(data, function (i) {
				var el = $("#myGender");
				el.val(data[i][8]).attr('selected', true).siblings('option').removeAttr('selected');
				//el.selectmenu("refresh", true);
				var el = $("#yourGender");
				el.val(data[i][9]).attr('selected', true).siblings('option').removeAttr('selected');
				//el.selectmenu("refresh", true);
				var el = $("#birthAge");
				el.val(data[i][10]).attr('selected', true).siblings('option').removeAttr('selected');
				//el.selectmenu("refresh", true);
				if (!$(".countryName").val().length)
					$(".countryName").val(data[i][3]);
				if (!$(".stateName").val().length)
					$(".stateName").val(data[i][4]);

				$(".mYuserName").html(data[i][1]);
			});
			$(".ui-loader").hide();
			return true;
		},
		error : function () {
			$(".ui-loader").hide();
			//alert("Error! Plz Try Again");
			return false;
		}
	});

}

function checkNotifi() {
	if (checkIfUserSet()) {
		$.ajax({
			type : 'GET',
			url : path+'/master.php',
			data : {
				usrid : localStorage.getItem("userid"),
				type : 'checkNotification'
			},
			success : function (data) {
				if (data == 0) {
					$(".notificationIconred").html(data);
					$(".notificationIconred").fadeOut();
				} else {
					$(".notificationIconred").html(data);
					$(".notificationIconred").fadeIn();
				}
				$(".notificationIconred").hide();
			},
			error : function () {
				$(".ui-loader").hide();
			}
		});
	}
}

function setMyid(x) {
	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			frmusr : x,
			type : 'getUserdetails'
		},
		beforeSend : function () {},
		success : function (data) {
			localStorage.setItem("userid", parseInt(data));
		},
		error : function () {
			$(".ui-loader").hide();
		}
	});

}

var getMsg;

function getlastid(x) {
	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			user : localStorage.getItem("userid"),
			to : x,
			type : 'getlastid'
		},
		//data: { user:"1327",to:x,type:'getlastid'},
		beforeSend : function () {},
		success : function (data) {
			$("#chatWindow").attr("data-lastId", data);
			var lastId = data;
			function getold(x) {
				$.ajax({
					type : 'GET',
					url : path+'/master.php',
					data : {
						user : localStorage.getItem("userid"),
						to : x,
						lastId : lastId,
						type : 'getOlderMsg'
					},
					//data: { user:"1327",to:x,lastId:lastId,type:'getOlderMsg'},
					dataType : 'json',
					beforeSend : function () {
						//$('#ajax-panel').html('<div class="loading"><img src="/images/loading.gif" alt="Working..." /></div>');
					},
					success : function (data) {
						var lastid = 0;
						$.each(data, function (i) {
							if (data[i][1] == parseInt(localStorage.getItem("userid"))) {
								//if(data[i][1] == parseInt("1327")){

								$(".getData").append("<div class='allMsg'><span class='imageClass myImage femaleImage'  style='background-image:url()'></span><div class='femaleMsg myMsg addMsg'><span class='textMsg'>" + data[i][5] + "</span><span class='timeMsg timeago' title='" + data[i][7] + "'></span></div></div>");

							} else {
								$(".getData").append("<div class='allMsg showUserPro'><span class='imageClass frmImage maleImage' style='background-image:url()'></span><div class='maleMsg frmMsg addMsg'><span class='textMsg'>" + data[i][5] + "</span><span class='timeMsgblu timeago' title='" + data[i][7] + "'></span></div></div>");

							}
							$(".timeago").timeago();
							lastid = data[i][0];

						});
						$(".loadearliermsg").show();
						$("#chatWindow").attr("data-lastId", lastid);
						//console.log(data[0][0]);
						$("#chatWindow").attr("data-lastold", data[0][0]);
						$("body").animate({
							scrollTop : $(".ui-content:visible").height()
						}, 600);

						if ($(".getData").text().length < 70)
							$(".loadearliermsg").hide();
						else
							$(".loadearliermsg").show();

						if (!(typeof x === 'undefined')) {
							var sent = false;
							function getMsgSent() {

								if ($("#chatWindow").is(":hidden"))
									return;

								getMsg = setTimeout(function () {
										var lastId = $("#chatWindow").attr("data-lastId");

										$.ajax({
											type : 'GET',
											url : path+'/master.php',
											data : {
												user : localStorage.getItem("userid"),
												to : x,
												lastId : lastId,
												type : 'getMsg'
											},
											//data: { user:"1327",to:x,lastId:lastId,type:'getMsg'},
											dataType : 'json',
											beforeSend : function () {
												$('#ajax-panel').html('<div class="loading"><img src="/images/loading.gif" alt="Working..." /></div>');
											},
											success : function (data) {

												$.each(data, function (i) {
													if (data[i][1] == parseInt(localStorage.getItem("userid"))) {}
													else {
														$(".getData").append("<div class='allMsg showUserPro'><span class='imageClass frmImage maleImage' style='background-image:url()'></span><div class='maleMsg frmMsg addMsg'><span class='textMsg'>" + data[i][5] + "</span><span class='timeago timeMsgblu' title='" + data[i][7] + "'></span></div></div>");

														$("body").animate({
															scrollTop : $(".ui-content:visible").height()
														}, 600);
													}
													$("#chatWindow").attr("data-lastId", data[i][0]);
												});
												$(".timeago").timeago();
												sent = true;
												if (sent)
													getMsgSent();
											},
											error : function () {
												$(".ui-loader").hide();
												console.log("error3");
											}
										});

										sent = false;
									}, 1000);
							}
							getMsgSent();
						}

					},
					error : function () {
						$(".ui-loader").hide();
						console.log("error2");
						getold(x);
					}
				});
			}
			getold(x);

		},
		error : function () {
			$(".ui-loader").hide();
			console.log("error1");
		}
	});

}

function loadoldmsges(x, y) {

	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			user : localStorage.getItem("userid"),
			to : y,
			lastId : x,
			type : 'loadOlderMsg'
		},
		dataType : 'json',
		beforeSend : function () {
			$(".loadingoldermsgimage").show();
		},
		success : function (data) {
			var lastid = 0;
			$.each(data, function (i) {

				if (data[i][1] == parseInt(localStorage.getItem("userid"))) {

					$(".getData").prepend("<div class='allMsg'><span class='imageClass myImage femaleImage'  style='background-image:url()'></span><div class='femaleMsg myMsg addMsg'><span class='textMsg'>" + data[i][5] + "</span><span class='timeMsg timeago' title='" + data[i][7] + "'></span></div></div>");

				} else {

					$(".getData").prepend("<div class='allMsg showUserPro'><span class='imageClass frmImage maleImage'  style='background-image:url()'></span><div class='maleMsg frmMsg addMsg'><span class='textMsg'>" + data[i][5] + "</span><span class='timeMsgblu timeago' title='" + data[i][7] + "'></span></div></div>");

				}
				lastid = data[i][0];

			});
			$(".loadingoldermsgimage").hide();
			$("#chatWindow").attr("data-lastold", lastid);

			setTimeout(function () {
				$(".timeago").timeago();
			}, 2000);
		},
		error : function () {
			$(".ui-loader").hide();
			// failed request; give feedback to user
			console.log("error2");
		}
	});
}

function loadMsgs() {

	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			usrid : localStorage.getItem("userid"),
			type : 'getMessagesRec'
		},
		//data: { usrid:"1327",type:'getMessagesRec' },
		dataType : 'json',
		beforeSend : function () {
			$(".ui-loader").show();
		},
		success : function (data) {
			$(".messagesrecivedhere").html("");
			$.each(data, function (i) {
				if (data[i][1] != "00001") {

					$gender = "";
					if (data[i][17] == 'm') {
						$gender = "Male";
					} else if (data[i][17] == 'f') {
						$gender = "Female";
					}

					$looking = "";
					if (data[i][18] == 'm') {
						$looking = "Male";
					} else if (data[i][18] == 'f') {
						$looking = "Female";
					} else if (data[i][18] == 'e') {
						$looking = "Everyone";
					}

					$seen = "";
					if (data[i][8] == '0') {
						$seen = "unseen";
					}

					var thisDiv = '<ion-item class="openChat item adBlockOuter ' + $gender + ' ' + $seen + '"><div class="outer messageReccontainer Male " data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><div class="notificationIcongreen"></div><div style="padding:0px;" class="innerMsgDiv"><span class="statusTitle">' + data[i][5] + '</span><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][13] + ',' + data[i][12] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">20</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][7] + '">' + data[i][7] + ' </span></div></div></td></tr></tbody></table></div></div></ion-item>';

					$(".messagesrecivedhere").append(thisDiv);
					$(".timeago").timeago();
				} else {
					$(".messagesrecivedhere").html("No Messages Yet :)");
				}
			});
			$(".ui-loader").hide();
		},
		error : function () {
			$(".ui-loader").hide();
			//alert("Error! Plz Try Again");
		}
	});
	//clearTimeout(getMsg);

	//if($(".noInterConnection").is(":visible"))
	//checkNotifi();


}

function loadCountries() {
	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			type : 'getCountryNames'
		},
		dataType : 'json',
		beforeSend : function () {
			$(".ui-loader").show();
		},
		success : function (data) {

			$("#selectCountryToSeeFrom").html("");

			//$('#selectCountryToSeeFrom').selectmenu('refresh');
			$("#selectCountryToSeeFrom").append("<option value=''>Planet Earth</option>");
			$.each(data, function (i) {
				if (data[i][1] != "00001") {

					var thisVallAdd = "<option value='" + data[i][0] + "'>" + data[i][0] + "</option>";
					$("#selectCountryToSeeFrom").append(thisVallAdd);
					//$(".timeago").timeago();
				} else {
					$(".requestForThisGrp").html("No Requests Yet :)");
				}
			});
			//$('#selectCountryToSeeFrom').selectmenu('refresh');
			$(".ui-loader").hide();
		},
		error : function () {
			$(".ui-loader").hide();
			//alert("Error! Plz Try Again");
		}
	});
}

function loadPersonData() {
	$(".loadPostPrevFrom").attr("data-lastPostId", "0");
	var thisVal = "";
	$datamsg = "";
	$.ajax({
		type : 'GET',
		url : path+'/master.php',
		data : {
			shwt : thisVal,
			type : 'getstype'
		},
		dataType : 'json',
		beforeSend : function () {
			$(".ui-loader").show();
		},
		success : function (data) {
			//loadPrson = data;
			//console.log(loadPrson);
			//return;
			$(".requestForThisGrp").html("");
			$.each(data, function (i) {
				if (data[i][1] != "00001") {

					$gender = "";
					if (data[i][6] == 'm') {
						$gender = "Male";
					} else if (data[i][6] == 'f') {
						$gender = "Female";
					}

					$looking = "";
					if (data[i][7] == 'm') {
						$looking = "Male";
					} else if (data[i][7] == 'f') {
						$looking = "Female";
					} else if (data[i][7] == 'e') {
						$looking = "Everyone";
					}

					//console.log($looking);


					var thisDiv = '';

					if (data[i][1] == $.trim(localStorage.getItem("userid"))) {
						thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' myPost" data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><div class="ribbon"><span>My Status</span></div><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><button class="button button-small button-block button-assertive youOwnPost">Really? send msg to Yourself ;)</button></div></ion-item>';
					} else {
						thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' " data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><div class="inner mobile100 adExtras" style="text-align:left;padding:0px;"><div><div class="list"><label class="item item-input"><textarea class="coolTextarea ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow" placeholder="Private message..."></textarea></label></div></div><button class="button button-block button-positive submitPrivateMessage">Submit Message</button></div></div></ion-item>';
					}

					$datamsg = $datamsg + thisDiv;
					//$(".requestForThisGrp").append(thisDiv);
					//$(".timeago").timeago();
				} else {
					$(".requestForThisGrp").html("No Posts Yet... Try Posting Yours Using Above Form... :)");
					//$(".loadPostPrevFrom").hide();
				}

				$(".loadPostPrevFrom").attr("data-lastPostId", data[i][0]);
			});
			//console.log($datamsg);
			$(".requestForThisGrp").append($datamsg);
			$(".timeago").timeago();
			$(".loadPostPrevFrom").fadeIn();

			$(".ui-loader").hide();
		},
		error : function () {
			$(".ui-loader").hide();
			//alert("Error! Plz Try Again");
		}
	});

};

//document.addEventListener("deviceready", setNotification, false);


$(function () {
	//	alert(1);
	//checkNotifi();
	setTimeout(function () {
		$(".CompleteComplan .inner").fadeIn();
	}, 800);
	setTimeout(function () {
		$(".bubbleSize").addClass("active");
	}, 1600);
	//localStorage.setItem("username", "");
	//alert(localStorage.setItem("username",""));
	
	
	$usr = checkIfUserSet();

	//console.log($usr.length);
	
	
	// if ($("#pageindex").is(":visible")) {
	// 	if (!$usr) {
	// 		setTimeout(function () {

	// 			$("#pageindex").find(".CompleteComplan").addClass("active");
	// 			//window.location.href = "index.html";
	// 		}, 2500);
	// 	} else {
	// 		setTimeout(function () {
	// 			//$.mobile.changePage('#showPersons');
	// 			//setNotification();
	// 			window.location.href = "#/app/wall";
	// 		}, 2500);
	// 	};
		
		
	// }else{
	// 	if (!$usr) {
	// 		setTimeout(function () {

	// 			$("#pageindex").find(".CompleteComplan").addClass("active");
	// 			alert("Logged Out! Sign in again");
	// 			window.location.href = "index.html";
	// 		}, 2500);
	// 	}
		
	// }

	$(document).on("click", ".closesWallSet", function () {
		setTimeout(function () {
			clearTimeout(getMsg);
		}, 30);
	});

	$(document).on("click", ".mainAdStuff", function () {
		$(this).closest(".adBlockOuter").toggleClass("active");
		//$(this).closest(".adBlockOuter").find(".yourNoteHasBeenSent").slideUp();
		//$(this).next(".adExtrasContainer").slideToggle();
	});

	$(document).on("click", "#write-float-icon", function () {
		$("#postMessage").trigger("click");
	});

	$(document).on("click", ".loadPostPrevFrom", function () {
return;
		var thisVal = $("#selectGenderToSee").val();
		var thisCountry = $("#selectCountryToSeeFrom").val();
		var lastPostId = $(".loadPostPrevFrom").attr("data-lastPostId");
		$datamsg = "";
		$.ajax({
			type : 'GET',
			url : path+'/master.php',
			data : {
				country : thisCountry,
				shwt : thisVal,
				prevFrom : lastPostId,
				type : 'getstype'
			},
			dataType : 'json',
			beforeSend : function () {
				$(".ui-loader").show();
				loadDone = false;
			},
			success : function (data) {
				$(".requestForThisGrp").html("");
				$.each(data, function (i) {
					if (data[i][1] != "00001") {

						$gender = "";
						if (data[i][6] == 'm') {
							$gender = "Male";
						} else if (data[i][6] == 'f') {
							$gender = "Female";
						}

						$looking = "";
						if (data[i][7] == 'm') {
							$looking = "Male";
						} else if (data[i][7] == 'f') {
							$looking = "Female";
						} else if (data[i][7] == 'e') {
							$looking = "Everyone";
						}

						var thisDiv = '';

						if (data[i][1] == $.trim(localStorage.getItem("userid"))) {
							thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' myPost" data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><div class="ribbon"><span>My Status</span></div><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><button class="button button-small button-block button-assertive youOwnPost">Really? send msg to Yourself ;)</button></div></ion-item>';
						} else {
							thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' " data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><div class="inner mobile100 adExtras" style="text-align:left;padding:0px;"><div><div class="list"><label class="item item-input"><textarea class="coolTextarea ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow" placeholder="Private message..."></textarea></label></div></div><button class="button button-block button-positive submitPrivateMessage">Submit Message</button></div></div></ion-item>';
						}

						$datamsg = $datamsg + thisDiv;
						//$(".requestForThisGrp div.list").append(thisDiv);
						//$(".timeago").timeago();
					} else {
						$(".requestForThisGrp").append("<div class='noMore'>No More Posts :)</div>");
						//$(".loadPostPrevFrom").hide();
					}

					$(".loadPostPrevFrom").attr("data-lastPostId", data[i][0]);
				});
				$(".requestForThisGrp").append($datamsg);
				$('.scroll').css('-webkit-transform', 'translate3d(0,0,0)');
				$(".timeago").timeago();
				$(".ui-loader").hide();
				loadDone = true;
			},
			error : function () {
				$(".ui-loader").hide();
				//alert("Error! Plz Try Again");
			}
		});

	});

	$(document).on("click", ".side-menu-list .item", function () {
		$(".side-menu-list .item").removeClass("active-list");
		$(this).addClass("active-list");
	});

	$(document).on("click", "#updateWall", function () {

		var thisVal = $("#selectGenderToSee").val();
		var thisCountry = $("#selectCountryToSeeFrom").val();
		var lastPostId = '';
		var thisC = $(this);
		$datamsg = "";
		$.ajax({
			type : 'GET',
			url : path+'/master.php',
			data : {
				country : thisCountry,
				shwt : thisVal,
				type : 'getstype'
			},
			dataType : 'json',
			beforeSend : function () {
				$(".ui-loader").show();
			},
			success : function (data) {
				$(".requestForThisGrp").html("");
				$.each(data, function (i) {
					if (data[i][1] != "00001") {

						$gender = "";
						if (data[i][6] == 'm') {
							$gender = "Male";
						} else if (data[i][6] == 'f') {
							$gender = "Female";
						}

						$looking = "";
						if (data[i][7] == 'm') {
							$looking = "Male";
						} else if (data[i][7] == 'f') {
							$looking = "Female";
						} else if (data[i][7] == 'e') {
							$looking = "Everyone";
						}

						var thisDiv = '';

						if (data[i][1] == $.trim(localStorage.getItem("userid"))) {
							thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' myPost" data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><div class="ribbon"><span>My Status</span></div><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><button class="button button-small button-block button-assertive youOwnPost">Really? send msg to Yourself ;)</button></div></ion-item>';
						} else {
							thisDiv = '<ion-item  class="item outer adBlockOuter ' + $gender + ' " data-usrnm="' + data[i][2] + '" data-userid="' + data[i][1] + '" adid="' + data[i][0] + '"><button  adid="' + data[i][0] + '" style="display:none;" class="button button-small button-block button-balanced yourNoteHasBeenSent"  adid="954">Your note to ' + data[i][2] + ' has been sent!</button><div class="mainAdStuff" style=""><div class="statusTitle">' + data[i][5] + '</div><table style="width:100%;"><tbody><tr><td><div class="adLocation">' + data[i][4] + ',' + data[i][3] + "<br>Looking for " + $looking + '</div></td><td><div class="adUsername"><span class="fColor">' + data[i][2] + '<span class="ageItem">' + data[i][10] + '</span><span class="femaleItem"><i class="icon ion-female"></i></span><span class="maleItem"><i class="icon ion-male"></i></span></span><br><div class="userStat"><span class="timeago" title="' + data[i][9] + '">' + data[i][9] + '</span></div></div></td></tr></tbody></table><div style="clear:both;"></div></div><div class="adExtrasContainer" adid="' + data[i][0] + '"><div class="inner mobile100 adExtras" style="text-align:left;padding:0px;"><div><div class="list"><label class="item item-input"><textarea class="coolTextarea ui-input-text ui-shadow-inset ui-body-inherit ui-corner-all ui-textinput-autogrow" placeholder="Private message..."></textarea></label></div></div><button class="button button-block button-positive submitPrivateMessage">Submit Message</button></div></div></ion-item>';
						}

						$datamsg = $datamsg + thisDiv;
						//$(".requestForThisGrp").append(thisDiv);
						thisC.html("Updated :)");
						//$(".timeago").timeago();
						$(".closesWallSet").trigger("click");
					} else {
						$(".requestForThisGrp").html("No Requests Yet :)");
					}

					$(".loadPostPrevFrom").attr("data-lastPostId", data[i][0]);
				});
				$(".ui-loader").hide();
				$(".requestForThisGrp").append($datamsg);
				$(".timeago").timeago();
			},
			error : function () {
				$(".ui-loader").hide();
				//alert("Error! Plz Try Again");
			}
		});
		$(".noMore").remove();
		$(".loadPostPrevFrom").show();

	})

	$(document).on("click", "#saveProfile", function () {
return;
		var fill = true;
		$(".saveProfileitem").not('span').each(function () {
			var thisVal = $(this).val().length;
			//console.log(thisVal);
			if (thisVal) {
				$(this).closest("label").removeClass("error");
				//fill = true;
			} else {
				$(this).closest("label").addClass("error");
				var thisMsg = $(this).attr("data-message");

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
			type : 'GET',
			url : path+'/master.php',
			data : {
				mg : mg,
				yg : yg,
				gm : gm,
				cn : cn,
				sn : sn,
				user : $.trim(localStorage.getItem("username")),
				type : 'saveset'
			},
			beforeSend : function () {
				$(".ui-loader").show();
				$("#saveProfile").html("Saving...");
				//$("#saveProfile").button("refresh");
			},
			success : function (data) {
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
				setTimeout(function () {
					$("#saveProfile").html("Save profile");
					//$("#saveProfile").button("refresh");
				}, 2000);
			},
			error : function () {
				$(".ui-loader").hide();
				alert("Oops, there was an error while updating your profile. Sorry about that.");
			}
		});

	});

	$(document).on("click", ".submitPrivateMessage", function () {

		$this = $(this);
		var toUserid = $(this).closest(".adBlockOuter").attr("data-userid");
		var toUsrnm = $(this).closest(".adBlockOuter").attr("data-usrnm");
		var frmusrid = localStorage.getItem("userid");
		var thisVal = $.trim($(this).closest(".adBlockOuter").find(".coolTextarea").val());

		if (!thisVal) {
			alert("Message can't be blank!");
			return false;
		}

		$.ajax({
			type : 'GET',
			url : path+'/master.php',
			data : {
				msg : thisVal,
				toUserid : toUserid,
				toUsernm : toUsrnm,
				frmusr : $.trim(localStorage.getItem("username")),
				frmusrid : frmusrid,
				not : 'y',
				type : 'privmsg'
			},
			beforeSend : function () {
				$(".ui-loader").show();
			},
			success : function (data) {

				if (data == 1) {
					//console.log($this.closest(".adExtrasContainer").length);
					$this.closest(".adExtrasContainer").slideUp();
					$this.closest(".adBlockOuter").find(".yourNoteHasBeenSent").slideDown();
					$(".ui-loader").hide();
					$this.closest(".adBlockOuter").find(".coolTextarea").val("");
					$this.closest(".adBlockOuter").removeClass("active");

				}
			},
			error : function () {
				$(".ui-loader").hide();
				//alert("Error! Plz Try Again");
			}
		});
	});

	$(document).on("click", "#registerSignin", function () {



	});

	$(document).on("keypress", ".registeringForm input", function (e) {
		if (e.which == 13) {
			$("#registerSignin").trigger("click");
		}
	});

	$(document).on("click", ".loadolderbutton", function () {
		var oldid = $("#chatWindow").attr("data-lastold");
		var foruid = $("#chatWindow").attr("data-userid");

		if (oldid != 0)
			loadoldmsges(oldid, foruid);
		else
			$(".loadolderbutton").hide();
	});

});