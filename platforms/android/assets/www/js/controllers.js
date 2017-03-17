/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/
// Constansts
var totalSyncTransactionsHappened = 0
var splashTime = 1000;
var assessmentScreenData = {};
var AssessorID = 0;
var assessmentDetailsScreenData = {};
var currentAssessorBatch = {};
var currentAssessorCentre = {};
var currentCandidatesInAssessorBatch = {};
// var cert={};
myApp.controllers = {
    //////////////////////////
    // splash Page Controller //
    //////////////////////////
    splashPage: function (page) {
        var currentPage = "";
        document.addEventListener("deviceready", scan, false);

        function onDeviceReady() {
            document.addEventListener("backbutton", function () {
                var currentPage = "";
                $("ons-page").each(function () {
                    if ($(this).css("display") == "block") currentPage = $(this).attr("id")
                });
                if (currentPage == "splashPage" || currentPage == "loginpage") {
                    navigator.home.home()
                }
                else {
                    document.querySelector('#myNavigator').popPage();
                }
            }, false);
        }

        var splashTimeCompleted = false;
        setTimeout(function () {
            splashTimeCompleted = true;
            if (isLoggedIn()) {
                scan()
            }
            else {
                scan()
            }
        }, splashTime);
        initOperatingSystem();
        document.addEventListener('deviceready', function () {
        });

        function initOperatingSystem() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            // Windows Phone must come first because its UA also contains "Android"
            if (/windows phone/i.test(userAgent)) {
                $("body").addClass("platform-windows")
                return "Windows Phone";
            }
            if (/android/i.test(userAgent)) {
                $("body").addClass("platform-android")
                return "Android";
            }
            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                $("body").addClass("platform-ios")
                return "iOS";
            }
            return "unknown";
        }
    }, //////////////////////////
    // login Page Controller //
    //////////////////////////
    loginPage: function (page) {
        page.querySelector('[component="button/forgotPassword"]').onclick = function () {
            document.querySelector('#myNavigator').pushPage('html/forgot_password.html');
        };
        // Set button functionality to login
        page.querySelector('[component="button/loginAction"]').onclick = function () {
            //if(checkConnection()) 
            {
                tryToLogin();
                //                document.querySelector('#myNavigator').pushPage('html/splitter.html');
            }
        };

        function makeSync() {
            $.ajax({
                url: getLoginURL(username, password)
                , type: 'GET'
                , traditional: true
                , timeout: 1000
                , headers: {
                    "Authorization-Token": getTokenKey()
                    , "My-Second-Header": "second value"
                }
                , statusCode: {
                    200: function (result) {
                        console.log(result);
                        //                            document.querySelector('#myNavigator').pushPage('html/splitter.html');
                    }
                    , 400: function (response) {
                        console.log(e);
                        alert("username Or password wrong");
                    }
                    , 0: function (response) {
                        alert('Some thing went wrong');
                    }
                }
            });
        }

        function tryToLogin() {
            var username = $("#username").val()
            var password = $("#password").val();
            if (validateLoginCLick(username, password)) {
                LoginRequest(username, password);
            }
            return true;
        }
    }, //////////////////////////
    // forgotPassword Page Controller //
    //////////////////////////
    forgotPasswordPage: function (page) {
        //      console.log("forgotPasswordPage fine");
        // Set button functionality to open/close the menu.
        page.querySelector('[component="button/back"]').onclick = function () {
            document.querySelector('#myNavigator').popPage();
        };
        // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        var onSuccess = function (position) {
            //            alert('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: ' + position.coords.longitude + '\n' + 'Altitude: ' + position.coords.altitude + '\n' + 'Accuracy: ' + position.coords.accuracy + '\n' + 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' + 'Heading: ' + position.coords.heading + '\n' + 'Speed: ' + position.coords.speed + '\n' + 'Timestamp: ' + position.timestamp + '\n');
        };
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            //            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        // Set button functionality to login
        //        page.querySelector('[component="button/loginAction"]').onclick = function () {
        //        };
        //        
        $("#forgotPasswordSubmit").click(function () {
            var emailID = $("#email-field").val();
            if (checkConnection())
                if (emailID != "") {
                    tryToGetPassword(emailID);
                }
                else {
                    alert("Please fill the required details")
                }
        })

        function tryToGetPassword(emailID) {
            //http://sanjayspinta-001-site1.btempurl.com/api/data/forgotpassword?emailId=nikhilesh@spintadigital.com
            //            emailID = "16A18969F"
            showSpinner()
            $.ajax({
                url: getForgotPassword(emailID)
                , dataType: 'json'
                , success: function (response) {
                    hideSpinner()
                    var result = $.parseJSON(JSON.stringify(response));
                    console.log(result)
                    if (response == "success") {
                        navigator.notification.alert("Email sent successfully", success, 'Confirmation', 'ok');

                        function success() {
                            document.querySelector('#myNavigator').popPage();
                        }
                    }
                }
                , error: function (xhr, ajaxOptions, thrownError) {
                    hideSpinner()
                    console.log("error");
                    console.log(xhr.readyState);
                    if (xhr.readyState == 4) {
                        // HTTP error (can be checked by xhr.status and xhr.statusText)
                        if (xhr.status == 0) {
                            alert('Network Connection Error');
                        }
                        else if (xhr.status == 400) {
                            if (xhr.responseJSON == "User ID or associated Email ID does not exist") {
                                alert("Entered User ID or  email id does not exist");
                            }
                        }
                        else if (xhr.status == 404) {
                            alert('Requested page not found. [404]');
                        }
                        else if (xhr.status == 500) {
                            alert('Internal Server Error [500].');
                        }
                        else if (thrownError === 'parsererror') {
                            alert('Requested JSON parse failed.');
                        }
                        else if (thrownError === 'timeout') {
                            alert('Time out error.');
                        }
                        else if (thrownError === 'abort') {
                            alert('Ajax request aborted.');
                        }
                        else {
                            alert('Uncaught Error.n');
                        }
                    }
                    else if (xhr.readyState == 0) {
                        alert('No internet Network Connection Error');
                    }
                    else {
                        //
                        console.log("something went wrong");
                    }
                }
            });
        }
    }, //////////////////////////
    // syncronizeAll Page Controller //
    //////////////////////////
    syncronizeAll: function (page) {
        console.log("we are coll in syncronizeAll")
        //        if(testing){
        //            document.querySelector('#myNavigator').resetToPage('html/updateApp.html');
        //        } else {
        getAllDataAjax();
        //        }
        //        
        //        document.querySelector('#myNavigator').pushPage('html/syncronizeAll.html');
    }, /////////////////////////////////
    // syncronizeAll Page Controller //
    ///////////////////////////////////
    updateApp: function (page) {
        console.log("we are coll in updateApp")
        //        document.querySelector('#myNavigator').pushPage('html/syncronizeAll.html');
    }, //////////////////////////
    // sync Page Controller //
    //////////////////////////
    syncPage: function (page) {
        var neverSyncedText = "never Synced";
        var tempText;
        showSyncTimeOnScreen();
        $("#syncSubmit").click(function () {
            // alert("working on it");
            // location.reload();
            // getAllDataAjax();
            // getAllDataAjax1();
            document.querySelector('#myNavigator').resetToPage('html/synchronizeAll.html');
        })
        // For  Home Tab
    }, /////////////////////////////
    // history Page Controller //
    ////////////////////////////
    historyPage: function (page) {
        var date = new Date();
        $(".tillDateHolder").html(getFormattedDate(date))
        date.setMonth(date.getMonth() - 2);
        $(".twoMonthBeforeDate").html(getFormattedDate(date))
        var d = new Date();
        d.setMonth(d.getMonth() - 3)
        var HistoryDetails = JSON.parse(localStorage["HistoryDetails"])[0]
        $("#TotalAssessments").html(HistoryDetails.TotalAssessments)
        $("#TotalAssessedStudents").html(HistoryDetails.TotalAssessedStudents)
        $("#TotalAssessmentsInTwoMonths").html(HistoryDetails.TotalAssessmentsInTwoMonths)
        $("#TotalAssessedStudentsInTwoMonths").html(HistoryDetails.TotalAssessedStudentsInTwoMonths)
    }, //////////////////////////
    // homeNews Page Controller //
    //////////////////////////
    homeNewsPage: function (page) {
        document.addEventListener('ons-tabbar:init', function (e) {
            alert("yes")
        });
        var data;
        console.log("homeNewsPagecool");
        $("#ScheduleStatsContainer").click(function () {
            changeTab(2)
        });
        $("#OverDueStatsContainer").click(function () {
            changeTab(3)
        });
        $("#SyncStatsContainer").click(function () {
            changeTab(5)
        })
        showSyncTimeOnScreen()

        function changeTab(tabNumber) {
            tabNumber -= 1
            var myTabbar = document.querySelector("ons-tabbar")
            myTabbar.setActiveTab(tabNumber)
            //            $("ons-tab.tab-bar__item.tab-bar--material__item.tab-bar--top__item:eq(" + tabNumber + ")").trigger("click")
            //            alert($("ons-tab.tab-bar__item.tab-bar--material__item.tab-bar--top__item:eq(" + tabNumber + ")").length)
        }
    }, //////////////////////////
    // schedule Page Controller //
    //////////////////////////
    schedulePage: function (page) {
        var data;
        console.log("scheduleDetailsPagecool");
        // $("#schduleList .card").click(function () {
        //     document.querySelector('#myNavigator').pushPage('html/home/schedule_details.html');
        // });
        //        $(document).on('click', '#schduleList .card', function () {
        //        });
        dateForShowingCurrentDay();
        var AssessmentCompletedArray = getAssessmentCompleted().split(",")
        var reOpenedIds = getAssessmentReopenedID();
        var reOpenedJSON = getAssessmentReopenedJSON();
        selectAssessorBatches(function (tx, rs) {
            data = rs.rows;

            console.log(rs.rows)
            var counter = 0;
            var datacontent = '';
            for (var j = 0; j < data.length; j++) {
                var obj = data.item(j);
                AssessorID = obj.AssessorID;
                var completedClass = ""
                if (contains.call(AssessmentCompletedArray, obj.AssessmentID)) completedClass = "completedAss"
                console.log(obj.PreferedAssessmentDate);
                var dayDiff = getDayDifference(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate))
                var overDueText = getOverDueText(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate))
                if (dayDiff >= 0 && !contains.call(AssessmentCompletedArray, obj.AssessmentID)) {
                    counter += 1
                    datacontent += '<div id="schduleList" class="' + completedClass + '">' + ' <div class="card schedule waves-effect ' + colorClassGenerator(convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '" component="button/assesmentDetailsPage" assessmentRowID = "' + j + '"> <h3 class ="nameof" id="nameofbatch">' + obj.BatchName + '</h3>' + '<div>' + '<span  class="1more" id="1moreday"><ons-icon icon="md-calendar"></ons-icon> ' + GetFormattedDate(convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '</span>' + ' <span id="overdue"><ons-icon icon="md-calendar"></ons-icon> Overdue <span class="overdueVal" value="' + getDayDifference(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '">' + overDueText + ' <span></span>' + ' </div> </div></div>';
                }
                else if ((contains.call(reOpenedIds, obj.AssessmentID) && reOpenedJSON[obj.AssessmentID]) && !contains.call(AssessmentCompletedArray, obj.AssessmentID)) {
                    var dayDiff = getDayDifference(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate))
                    var overDueText = getOverDueText(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate))
                    counter += 1
                    datacontent += '<div id="schduleList" class="' + completedClass + '">' + ' <div class="card schedule waves-effect ' + colorClassGenerator(convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '" component="button/assesmentDetailsPage" assessmentRowID = "' + j + '"> <h3 class ="nameof" id="nameofbatch">' + obj.BatchName + '</h3>' + '<div>' + '<span  class="1more" id="1moreday"><ons-icon icon="md-calendar"></ons-icon> ' + GetFormattedDate(convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '</span>' + ' <span id="overdue"><ons-icon icon="md-calendar"></ons-icon> Overdue <span class="overdueVal" value="' + getDayDifference(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '">' + overDueText + ' <span></span>' + ' </div> </div></div>';
                }
            }
            $('.contentview').html(datacontent);
            // For Home Stats
            if (data) $("#ScheduleStatsValue").html(counter)
            $('#schduleList .schedule').unbind('click').click(function () {
                if (parseInt($(this).find(".scheduleCandidatesList").attr("value")) > 1) {
                    futureFeatureMessage()
                    console.log("");
                }
                else {
                    assessmentScreenData = data.item($(this).attr("assessmentRowID"))
                    if (contains.call(AssessmentCompletedArray, assessmentScreenData.AssessmentID)) {
                        alert("Assessment already taken")
                    }
                    else {
                        currentAssessorBatch = assessmentScreenData;
                        document.querySelector('#myNavigator').pushPage('html/home/schedule_details.html');
                        console.log($(this).attr("assessmentRowID"))
                        console.log(data.item($(this).attr("assessmentRowID")))
                    }
                }
            })
        });
    }, //////////////////////////
    // overDue Page Controller //
    //////////////////////////
    overDuePage: function (page) {
        console.log("overDuePagecool");
        //        $(document).on('click', '#schduleList .card', function () {
        //            document.querySelector('#myNavigator').pushPage('html/home/schedule_details.html');
        //        });
        dateForShowingCurrentDay();
        var reOpenedIds = getAssessmentReopenedID();
        var reOpenedJSON = getAssessmentReopenedJSON();
        selectAssessorBatches(function (tx, rs) {
            data = rs.rows;
            console.log(rs.rows)
            var OverDueBatchesCount = 0;
            var datacontent = '';
            for (var j = 0; j < data.length; j++) {
                var obj = data.item(j);
                if (contains.call(reOpenedIds, obj.AssessmentID) && reOpenedJSON[obj.AssessmentID]) {
                }
                else {
                    if (colorClassGenerator(convertDBDateToJSDate(obj.PreferedAssessmentDate)) == "red") {
                        var dayDiff = getDayDifference(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate))
                        var overDueText = getOverDueText(new Date(), convertDBDateToJSDate(obj.PreferedAssessmentDate))
                        datacontent += '<div id="schduleList" class="overDueBatch" assId = "' + obj.AssessmentID + '">' + ' <div class="card waves-effect ' + colorClassGenerator(convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '" component="button/assesmentDetailsPage" assessmentRowID = "' + j + '"> <h3 class ="nameof" id="nameofbatch">' + obj.BatchName + '</h3>' + '<div>' + '<span  class="1more" id="1moreday"><ons-icon icon="md-calendar"></ons-icon> ' + GetFormattedDate(convertDBDateToJSDate(obj.PreferedAssessmentDate)) + '</span>' + ' <span id="overdue"><ons-icon icon="md-calendar"></ons-icon> Overdue ' + overDueText + ' </span>' + ' </div> </div></div>';
                        OverDueBatchesCount += 1;
                    }
                }
            }
            if (OverDueBatchesCount == 0) datacontent += "<h3>No Overdue exist.</h3>"
            // For Home Stats
            $("#OverDueStatsValue").html(OverDueBatchesCount)
            $('.overDuecontentview').html(datacontent);
            $('.overDueBatch').unbind('click').click(function () {
                if (confirm("Would you like to re-open the assessment for 1-day?")) {
                    setAssessmentReopened($(this).attr("assId"));
                    console.log("assId: " + $(this).attr("assId"))
                    document.querySelector('#myNavigator').resetToPage('html/synchronizeAll.html');
                }
            })
        });
    }, //////////////////////////
    // scheduleDetailsPage Page Controller //
    //////////////////////////
    scheduleDetailsPage: function (page) {
        console.log(assessmentScreenData);
        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        })
        $(".actions .col.s4.take").click(function () {
            document.querySelector('#myNavigator').pushPage('html/home/schedule_candidates.html');
        })

        function stopassessment() {
            var title = "Confirmation!";
            var buttonName = "Cancel,OK";
            navigator.notification.confirm('Are you sure you have entered marks for all the students?', confirmCallback, title, buttonName)

            function confirmCallback(buttonIndex) {
                if (buttonIndex == 2) {
                    navigator.notification.confirm('You are ending Assessment', confirmCallback1, 'Confirmation!', 'Cancel,OK')

                    function confirmCallback1() {
                        if (buttonIndex == 2) {
                            function onSuccess(position) {
                                console.log(position)
                                console.log('after update end location')
                                assessmentDetailsScreenData.endlong = position.coords.longitude;
                                assessmentDetailsScreenData.endlat = position.coords.latitude;
                                updateendlocation(currentAssessorBatch.AssessmentID, assessmentDetailsScreenData.endlong, assessmentDetailsScreenData.endlat, function (tx, rs) {
                                    console.log("end location DB update success success");
                                    if (updateAllData(currentAssessorBatch.AssessmentID, currentAssessorBatch.BatchID, currentAssessorBatch.CentreID)) {
                                        document.querySelector('#myNavigator').resetToPage('html/synchronizeAll.html');
                                        console.log("stop assessment");
                                    }
                                    else {
                                        // alert("Some thing went wrong, could not end Assessment")
                                    }
                                })
                            }

                            function onError(error) {
                                alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                            }

                            navigator.geolocation.getCurrentPosition(onSuccess, onError);
                        }
                    }
                }
            }
        }

        var obj = assessmentScreenData
        currentAssessorBatch = obj;
        // checking wether its RPL or new skilling
        if (obj.TrainingTypeValue == TrainingTypeValueNewSkilling) {
            $("#scheduleDetailsContainer").addClass("newSkilling")
        }
        else {
            $("#scheduleDetailsContainer").addClass("RPL")
        }
        //        $("#startAssessment").unbind("click").click(
        //sanjay
        //sanjay
        function checkToStartOrNo() {
            var prefredDate = convertDBDateToJSDate(obj.PreferedAssessmentDate)
            var currentDate = new Date()
            console.log(currentDate)
            var oneDay = 24 * 60 * 60 * 1000;
            var diff = ((-currentDate.getTime() + prefredDate.getTime()) / (oneDay))
            if (diff <= 0) {
                startAssessmentAlert()
                var gotLoc = function (position) {
                    localStorage.setItem('startlong', position.coords.longitude);
                    localStorage.setItem('startlat', position.coords.latitude);
                    assessmentDetailsScreenData.startlong = localStorage.getItem('startlong');
                    assessmentDetailsScreenData.startlat = localStorage.getItem('startlat');
                    updatestartlocation(currentAssessorBatch.AssessmentID, assessmentDetailsScreenData.startlong, assessmentDetailsScreenData.startlat, function (tx, rs) {
                        cosole.log("startlocation");
                    })
                };

                function onError(error) {
                    alert("something went wrong")
                    alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(gotLoc, onError);
            }
            else {
                alert("Preferred aseesment date is: " + getFormattedDateForscreen(prefredDate))
            }
        }

        document.getElementById("startAssessment").addEventListener("click", checkToStartOrNo);
        document.getElementById("stopAssessment").addEventListener("click", stopassessment);
        document.getElementById("batchnameinass").innerHTML = obj.BatchName;
        document.getElementById("preferredassmentdate").innerHTML = getFormattedDateForscreen(convertDBDateToJSDate(obj.PreferedAssessmentDate));
        if (obj.TrainingTypeValue == TrainingTypeValueNewSkilling || obj.TrainingTypeValue == TrainingTypeValueNewSkilling1) {
            document.getElementById("trainingtypevalue").innerHTML = "Short Term Training";
            // obj.TrainingTypeValue;
        }
        else {
            document.getElementById("trainingtypevalue").innerHTML = obj.ProjectTypeValue;
            //            document.getElementById("trainingtype").innerHTML = obj.ProjectType;
        }
        document.getElementById("sectorname").innerHTML = obj.SectorName;
        document.getElementById("Subsector").innerHTML = obj.SubSectorName;
        document.getElementById("jobrole").innerHTML = obj.JobRole + " (" + obj.JobRoleLevel + ")";
        assessmentDetailsScreenData.AssessmentID = obj.CentreID;
        assessmentDetailsScreenData.BatchID = obj.BatchID
        assessmentDetailsScreenData.CentreID = obj.CentreID
        selectAssessorCentres(obj.CentreID, function (tx, rs) {
            console.log(rs.rows);
            console.log("selectAssessorCentres");
            var obj1 = rs.rows.item(0);
            currentAssessorCentre = obj1
            console.log(obj1)
            document.getElementById("tcname").innerHTML = obj1.CentreName;
            document.getElementById("tcaddress").innerHTML = obj1.Address;
            document.getElementById("partnername").innerHTML = obj1.PartnerName;
            document.getElementById("spocname").innerHTML = obj1.SPOCName;
            console.log(obj1.SPOCName, "spoc name");
            if (obj1.Longitude == "null") {
                $("#locationPusher").attr("href", "geo:13.6288,79.4192?q=13.6288,79.4192")
            }
            else {
                $("#locationPusher").attr("href", "geo:" + obj1.Latitude + "," + obj1.Longitude + "?q=" + obj1.Latitude + "," + obj1.Longitude)
            }
        })
    }, //////////////////////////
    // schedulecandidatePage Page Controller //
    //////////////////////////
    scheduleCandidatesPage: function (page) {
        var students = []
        console.log(assessmentDetailsScreenData)
        console.log("assessmentDetailsScreenData")
        // cameraaction
        $("#cameraaction").click(function () {
            camerasam();
        })
        $(".ion-android-arrow-back").click(function () {
            document.querySelector('#myNavigator').popPage();
        });
        console.log(currentAssessorBatch.AssessmentID + ", " + currentAssessorBatch.BatchID + ", " + currentAssessorBatch.CentreID)
        selectCandidatesInAssessorBatches(currentAssessorBatch.AssessmentID, currentAssessorBatch.BatchID, currentAssessorBatch.CentreID, function (tx, rs) {
            console.log("selectCandidatesInAssessorBatches");
            console.log(rs.rows);
            students = rs.rows;
            var datacontent = '';
            var contentType = "image/png";
            var folderpath = cordova.file.externalRootDirectory + "/nsdc/";
            console.log(folderpath)
            for (var j = 0; j < students.length; j++) {
                var obj = students.item(j);
                //base64
                var filename = currentAssessorBatch.AssessmentID + currentAssessorBatch.BatchID + obj.CentreCandID + ".png";
                var imagePath = "imgs/background.jpg";
                var i;
                // console.log(obj.CentreCandIDImage);
                if (obj.CentreCandIDImage != null) {
                    myBase64 = obj.CentreCandIDImage
                }
                else {
                    myBase64 = "imgs/background.jpg";
                }
                savebase64AsImageFile(folderpath, filename, myBase64, contentType);
                console.log("image name" + filename);
                var srcpics = folderpath + filename;
                console.log(srcpics);
                // localStorage.setItem("imgurls", imagePath);
                var col = parseInt(obj.IsSubmitted);

                function colorcreate() {
                    if (col === 1) {
                        return COMPLETED_STUDENT_INMARKS_UPDATE;
                    }
                    return ACTIVE_STUDENT_IN_MARKS_UPDATE;
                }

                datacontent += '<div class="card horizontal row waves-effect ' + colorcreate() + ' " id="' + j + '"><div class="col s2"><img class="studentImage"  src="' + srcpics + '"></div><div class="col s10 row data"><div class="row dataInCandita"><div class="col s8">' + obj.CandidateName + '</div><div class="col s4">' + obj.CentreCandID + '</div></div></div></div>';
                //                datacontent += '<div class="scheduleCandidatesList">' + '<div class="card horizontal row waves-effect" id="'+ j +'">' + '<div class="col s2">' + '<img class="studentImage" src="imgs/background.jpg">' + '</div>' + '<div class="col s10 row data">' + '<div class="row dataInCandita">' + '<div class="col s8">' + '' + obj.CandidateName + '' + '</div>' + '<div class="col s4">' + '' + obj.SDMSCandidateID + '' + '</div>' + '</div>' + '</div>' + '</div>';
                //            datacontent += '<div class="scheduleCandidatesList">' + '<div class="card horizontal row waves-effect">' + '<div class="col s2">' + '<img class="studentImage" src="imgs/background.jpg">' + '</div>' + '<div class="col s10 row data">' + '<div class="row">' + '<div class="col s8">' + '' + obj.CandidateName + '' + '</div>' + '<div class="col s4">' + '' + obj.SDMSCandidateID + '' + '</div>' + '</div>' + '<div class="row dataCont">' + '   <div class="col s8"> Attendance</div>' + '  <div class="col s4">' + '     <ons-switch modifier="material"></ons-switch>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
            }
            $('.studentslist .scheduleCandidatesList').html(datacontent);
            if (students.length == 0) {
                alert("NO students in this batch")
                $('.studentslist .scheduleCandidatesList').html('<h4><center>No students in this batch</center></h4>');
            }
            $('.studentslist .card').unbind("click").click(function () {
                currentCandidateInAssessorBatch = students.item(parseInt($(this).attr("id")))
                if (currentCandidateInAssessorBatch.CandID) assessmentDetailsScreenData.CandID = currentCandidateInAssessorBatch.CandID
                $("." + ACTIVE_STUDENT_IN_MARKS_UPDATE).removeClass(ACTIVE_STUDENT_IN_MARKS_UPDATE);
                $(this).addClass(ACTIVE_STUDENT_IN_MARKS_UPDATE)
                document.querySelector('#myNavigator').pushPage('html/home/schedule_candidates_marks_update.html');
            });
            $("#searchInput").unbind("keyup").keyup(function () {
                var inputValue = $(this).val()
                if (inputValue == "") {
                    $(".studentslist .scheduleCandidatesList .card").show();
                }
                else {
                    $(".studentslist .scheduleCandidatesList .card").hide();
                    $(".studentslist .scheduleCandidatesList .card:Contains(" + inputValue + ")").show();
                }
            })
        })
    }, //////////////////////////
    // scheduleCandidatesMarksUpdatePage Page Controller //
    //////////////////////////
    scheduleCandidatesMarksUpdatePage: function (page) {
        $("#updateAction").hide()
        var filename = currentAssessorBatch.AssessmentID + currentAssessorBatch.BatchID + currentCandidateInAssessorBatch.CentreCandID + ".png";
        var folderpath = cordova.file.externalRootDirectory + "/nsdc/";
        var srcpics = folderpath + filename;
        $('#studentimages').prepend('<img  class="studentImage" src="' + srcpics + '" />')
        if (currentCandidateInAssessorBatch.CandidateName) $(".userData .name").html(currentCandidateInAssessorBatch.CandidateName)
        if (currentCandidateInAssessorBatch.CentreCandID) $(".userData .id").html(currentCandidateInAssessorBatch.CentreCandID)
        if (currentCandidateInAssessorBatch.AadhaarNumber && (currentCandidateInAssessorBatch.AadhaarNumber != null || currentCandidateInAssessorBatch.AadhaarNumber != "null")) {
            $(".userData .idType").html("Aadhaar No");
            $(".userData .idNumber").html(currentCandidateInAssessorBatch.AadhaarNumber.match(/.{1,4}/g).join(" "))
        }
        else if (currentCandidateInAssessorBatch.AlternateIDType && (currentCandidateInAssessorBatch.AlternateIDNumber != null || currentCandidateInAssessorBatch.AlternateIDNumber != "null")) {
            $(".userData .idType").html(currentCandidateInAssessorBatch.AlternateIDType)
            $(".userData .idNumber").html(currentCandidateInAssessorBatch.AlternateIDNumber)
        }
        $(document).ready(function () {
            $('select').material_select();
        });
        $("#cadatt").hide();
        $("#attendance").change(function () {
            $("input[type=text]").unbind("change").change(function () {
                if ($(this).val() > $(this).attr("max")) {
                    alert("Maximum allowed marks for this exam is: " + $(this).attr("max"))
                    $(this).val("")
                }
            })
            var selectedValue = document.getElementById("attendance").value;
            if (selectedValue == 2) {
                $("#updateAction").show();
                $("#cadatt").hide();
                $("#marksUpdateList .card").hide();
                $("input[type=checkbox]:checked").trigger("click");
                $("." + ACTIVE_STUDENT_IN_MARKS_UPDATE).removeClass(ACTIVE_STUDENT_IN_MARKS_UPDATE).addClass(COMPLETED_STUDENT_INMARKS_UPDATE);
                $("#updateAction").show();
            }
            if (selectedValue == 1) {
                if (currentAssessorBatch.TrainingTypeValue == TrainingTypeValueNewSkilling) {
                    console.log("its new")
                    $("#cadatt").show();
                }
                else {
                    $("#marksUpdateList .card").show()
                    $("#updateAction").show()
                }
            }
        })
        var nosesList = []
        $("input[type=checkbox]").change(function () {
            console.log($("input[type=checkbox]:checked"))
            if ($("input[type=checkbox]:checked").length == 1) {
                $("#marksUpdateList .card").show()
                $("#updateAction").show()
            }
            else {
                $("#marksUpdateList .card").hide()
                $("#updateAction").hide()
            }
        })
        $(".ion-android-arrow-back").click(function () {
            document.querySelector('#myNavigator').popPage();
        })
        //        console.log(currentAssessorBatch.AssessmentID + ", " + assessmentDetailsScreenData.BatchID + ", " + assessmentDetailsScreenData.CentreID + ", " + assessmentDetailsScreenData.CandID);
        //        //        selectCandidatesNosesMapping(1, 2, 1553, 15,
        selectCandidatesNosesMapping(currentAssessorBatch.AssessmentID, assessmentDetailsScreenData.BatchID, assessmentDetailsScreenData.CentreID, assessmentDetailsScreenData.CandID, function (tx, rs) {
            console.log("selectCandidatesInAssessorBatches");
            console.log(rs.rows);
            nosesList = rs.rows;
            var trigger = false;
            var datacontent = '';
            for (var j = 0; j < nosesList.length; j++) {
                var obj = nosesList.item(j);
                console.log(obj)
                var className = "core";
                console.log("obj.NOSTypeName: " + obj.NOSTypeName)
                if (obj.NOSTypeName == "OPTIONAL") {
                    className = "nonCore";
                }
                var actionValue = "update"
                if ((isNaN(obj.TheoryMarks) || obj.TheoryMarks == null || obj.TheoryMarks == "")) {
                    actionValue = "insert"
                }
                else {
                    if (obj.TheoryMarks == "0" && obj.PracticalMarks == "0") {
                    }
                    else {
                        trigger = true
                    }
                    if (trigger) {
                        $(".select-dropdown").val("Present");
                        if (currentAssessorBatch.TrainingTypeValue == TrainingTypeValueNewSkilling) $("#cadatt").show();
                        $("input[type=checkbox]").not(":checked").trigger("click")
                        $("#marksUpdateList .card").show()
                        $("#updateAction").show()
                    }
                    else {
                        $(".select-dropdown").addClass("Absent")
                        $(".select-dropdown").val("Absent");
                        $("#updateAction").show()
                    }
                }
                var template = '<div class="card ' + className + '" action="' + actionValue + '">' + '<h3 class="heading ">' + obj.NOSName + '<p class="NoseType">' + obj.NOSTypeName.replace("NOS", "") + '</p></h3>' + '<div class="row">' + '<div class="col s6">' +
                    '<ons-input  onkeyup="return fun_AllowOnlyAmountAndDot(this);"onkeypress="if(this.value.length >= 5 ) return false" pattern="(?:\d*\.)?\d+" type="number" min="0" max="' + obj.MaxMarksTheory + '" placeholder="Theory (' + obj.MaxMarksTheory + ')" value="' + obj.TheoryMarks + '" float></ons-input>' +
                    '</div>' + '<div class="col s6">' +
                    '<ons-input  onkeyup="return fun_AllowOnlyAmountAndDot(this);"onkeypress="if(this.value.length >= 5) return false" pattern="(?:\d*\.)?\d+" type="number" min="0" max="' + obj.MaxMarksPractical + '" placeholder="Practical (' + obj.MaxMarksPractical + ')" value="' + obj.PracticalMarks + '" float></ons-input>' + '</div>' + '</div>' + '</div>';
                datacontent += template;
            }
            if (datacontent != "") {
                $("#marksUpdateList").html(datacontent);
                if ($("input[type=checkbox]:checked").length == 1) {
                    $("#marksUpdateList .card").show()
                }
                else {
                    $("#marksUpdateList .card").hide()
                }
                $("#updateAction").unbind('click').click(function () {
                    if ($("#attendance").val() == 2 || ($("#attendance").val() == null && $(".select-dropdown").hasClass("Absent"))) {
                        startAbsentUpdates()
                        $("." + ACTIVE_STUDENT_IN_MARKS_UPDATE).removeClass(ACTIVE_STUDENT_IN_MARKS_UPDATE) //.addClass(COMPLETED_STUDENT_INMARKS_UPDATE);
                        document.querySelector('#myNavigator').popPage();
                    }
                    else {
                        var error = false;
                        if ($("input[type=checkbox]:checked").length == 1 || currentAssessorBatch.TrainingTypeValue != TrainingTypeValueNewSkilling) {
                            $("#marksUpdateList input").each(function () {
                                if ($(this).val() == "") {
                                    error = true
                                    alert(MARKS_NOT_ENTERED)
                                    return false;
                                }
                                if (parseInt($(this).val()) > parseInt($(this).attr("max"))) {
                                    error = true
                                    alert("Entered marks should not be greater than max marks")
                                    return false;
                                }
                            })
                        }
                        if (!error) {
                            {
                                selectComputeResultsWithGrades(function (tx, rs) {
                                    console.log("selectComputeResultsWithGrades");
                                    console.log(rs.rows);
                                    var rules = []
                                    for (i = 0; i < rs.rows.length; i++) {
                                        var xx = rs.rows.item(i)
                                        xx.ToMark = parseInt(xx.ToMark)
                                        xx.FromMark = parseInt(xx.FromMark)
                                        rules[rules.length] = xx
                                    }
                                    var x = {}
                                    x.Grades = rules
                                    var result = calculatePercentage()
                                    var grade = calculateGrade(x, result.percentage, parseInt(currentAssessorBatch.JobRoleLevel), currentAssessorBatch.JobRoleTypeValue)
                                    if (grade == "") grade = "fail"
                                    result.grade = grade
                                    console.log("grade: " + grade)
                                    successForUpdate(result)
                                });
                            }
                        }
                    }
                })
                // for max mark validation
                $("#marksUpdateList input[type=number]").change(function () {
                    if (!($(this).val() <= parseInt($(this).attr("max")))) {
                        $(this).val("")
                        alert("Exceeded Max Marks")
                    }
                    console("ok changed")
                })
            }
            else {
                $("#marksUpdateList").html('<h4 style="text-align: center;">' + NO_SUBJECTS_TO_SHOW + '</h4>');
                alert(NO_SUBJECTS_TO_SHOW);
                $("#updateAction").hide()
            }
        })

        function getResult() {
            var x = {}
            x = calculatePercentage()
            x.grade = calculateGrade(x.percentage)
            return x;
        }

        var theoryMarksArray = []
        var practcalMarksArray = []
        var actionsArray = []

        function calculatePercentage() {
            var coreMarks = 0
            var coreMaxMarks = 0
            var nonCoreMarks = 0
            var nonCoreMaxMarks = 0
            $("#marksUpdateList .card").each(function (i) {
                var currentNose = nosesList.item(i);
                var theoryMark = parseFloat($(this).find("input[type=number]:first").val())
                var practicalMark = parseFloat($(this).find("input[type=number]:last").val())
                theoryMarksArray[theoryMarksArray.length] = theoryMark
                practcalMarksArray[practcalMarksArray.length] = practicalMark
                actionsArray[actionsArray.length] = $(this).attr("action")
                if (currentNose.NOSTypeName == "NON-CORE NOS") {
                    nonCoreMarks += parseFloat(theoryMark) + parseFloat(practicalMark)
                    nonCoreMaxMarks += parseFloat(currentNose.MaxMarksTheory) + parseFloat(currentNose.MaxMarksPractical)
                }
                else {
                    coreMarks += parseFloat(theoryMark) + parseFloat(practicalMark)
                    coreMaxMarks += parseFloat(currentNose.MaxMarksTheory) + parseFloat(currentNose.MaxMarksPractical)
                }
            })
            var percentage = 0;
            if (currentAssessorBatch.TrainingTypeValue == TrainingTypeValueNewSkilling) {
                console.log("its new")
                //                alert("Logic : ((" + coreMarks + " + " + nonCoreMarks + ") / (" + coreMaxMarks + " + " + nonCoreMaxMarks + ")) x 100")
                console.log(((coreMarks + nonCoreMarks) / (coreMaxMarks + nonCoreMaxMarks)) * 100)
                percentage = ((coreMarks + nonCoreMarks) / (coreMaxMarks + nonCoreMaxMarks)) * 100
            }
            else {
                console.log("its old")
                //                alert('Logic : ((' + coreMarks + ' / ' + coreMaxMarks + ' ) X 70) + ((' + nonCoreMarks + '/' + nonCoreMaxMarks + ') X 30)')
                if (nonCoreMaxMarks == 0) {
                    percentage = ((coreMarks / coreMaxMarks) * 70)
                }
                else if (coreMaxMarks == 0) {
                    percentage = ((nonCoreMarks / nonCoreMaxMarks) * 30)
                }
                else {
                    percentage = ((coreMarks / coreMaxMarks) * 70) + ((nonCoreMarks / nonCoreMaxMarks) * 30)
                }
                console.log("percentage:" + percentage)
            }
            var x = {}
            x.percentage = percentage
            x.totalMarks = parseFloat(coreMarks) + parseFloat(nonCoreMarks)
            x.totalMaxMarks = parseFloat(coreMaxMarks) + parseFloat(nonCoreMaxMarks)
            return x;
        }

        function successForUpdate(result) {
            console.log("successForUpdate")
            console.log(result)
            //sanjay
            // camerasam();
            alert("For Total Marks: " + result.totalMarks + "/" + result.totalMaxMarks + " Percent: " + result.percentage.toFixed(2)) // + " Grade: " + result.grade)
            $("." + ACTIVE_STUDENT_IN_MARKS_UPDATE).removeClass(ACTIVE_STUDENT_IN_MARKS_UPDATE).addClass(COMPLETED_STUDENT_INMARKS_UPDATE);
            startUpdates(result)
            document.querySelector('#myNavigator').popPage();
        }

        function startAbsentUpdates() {
            var staginarray = [];
            $("#marksUpdateList .card").each(function (i) {
                actionsArray[actionsArray.length] = $(this).attr("action")
            });
            for (var i = 0; i < nosesList.length; i++) {
                var v = nosesList.item(i);
                var x = {}
                x.IsSubmitted = 1;
                x.AssessorID = currentAssessorBatch.AssessorID
                x.AssessmentID = v.AssessmentID
                x.CentreID = v.CentreID
                x.BatchID = v.BatchID
                x.AssessmentDate = getDBDate(new Date())
                x.CandidateAssessedOn = getDBDate(new Date())
                x.JobroleId = currentAssessorBatch.JobRoleID
                x.CandidateCount = currentAssessorBatch.CandidateCount
                x.FailedCandidateCount = 0
                x.ClosureDate = currentAssessorBatch.AssessmentClosureDate
                x.ExtendedClosureDate = currentAssessorBatch.ExtendedClosureDate
                x.SectorID = currentAssessorBatch.SectorID
                x.TrainingTypeValue = currentAssessorBatch.TrainingTypeValue
                x.JobroleTypeValue = currentAssessorBatch.JobRoleTypeValue
                x.NosId = v.NOSID
                x.TheoryMarks = 0
                x.PracticalMarks = 0
                x.TotalMarks = 0
                x.UpdatedAt = getDBDate(new Date())
                x.IsReassessment = currentAssessorBatch.IsReAssessment
                x.Result = ""
                x.Grade = ""
                x.JobroleLevel = currentAssessorBatch.JobRoleLevel
                x.Attendance = true
                x.CandidateId = v.CandID
                x.SdmsCandidateId = 0
                x.MarkPercent = 0
                x.CandidateName = currentCandidateInAssessorBatch.CandidateName
                x.action = actionsArray[i]
                x.CandidateAttendance = "Absent"
                x.StartLatitude = assessmentDetailsScreenData.startlat
                x.StartLongitude = assessmentDetailsScreenData.startlong
                x.EndLatitude = assessmentDetailsScreenData.endlat
                x.EndLongitude = assessmentDetailsScreenData.endlong
                console.log(x)
                staginarray[staginarray.length] = x
            }
            console.log(staginarray)
            updateNoses(staginarray);
        }

        function startUpdates(result) {
            var staginarray = [];
            for (var i = 0; i < nosesList.length; i++) {
                var v = nosesList.item(i);
                var x = {}
                x.IsSubmitted = 1
                x.AssessorID = currentAssessorBatch.AssessorID
                x.AssessmentID = v.AssessmentID
                x.CentreID = v.CentreID
                x.BatchID = v.BatchID
                x.AssessmentDate = getDBDate(new Date())
                x.CandidateAssessedOn = getDBDate(new Date())
                x.JobroleId = currentAssessorBatch.JobRoleID
                x.CandidateCount = currentAssessorBatch.CandidateCount
                x.FailedCandidateCount = 0
                x.ClosureDate = currentAssessorBatch.AssessmentClosureDate
                x.ExtendedClosureDate = currentAssessorBatch.ExtendedClosureDate
                x.SectorID = currentAssessorBatch.SectorID
                x.TrainingTypeValue = currentAssessorBatch.TrainingTypeValue
                x.JobroleTypeValue = currentAssessorBatch.JobRoleTypeValue
                x.NosId = v.NOSID
                x.TheoryMarks = theoryMarksArray[i]
                x.PracticalMarks = practcalMarksArray[i]
                x.TotalMarks = theoryMarksArray[i] + practcalMarksArray[i]
                x.UpdatedAt = getDBDate(new Date())
                x.IsReassessment = currentAssessorBatch.IsReAssessment
                x.Result = ""
                x.Grade = result.grade
                x.JobroleLevel = currentAssessorBatch.JobRoleLevel
                x.Attendance = true
                x.CandidateId = v.CandID
                x.SdmsCandidateId = 0
                x.MarkPercent = result.percentage
                x.CandidateName = currentCandidateInAssessorBatch.CandidateName
                x.action = actionsArray[i]
                x.CandidateAttendance = "Present"
                x.StartLatitude = assessmentDetailsScreenData.startlat
                x.StartLongitude = assessmentDetailsScreenData.startlong
                x.EndLatitude = assessmentDetailsScreenData.endlat
                x.EndLongitude = assessmentDetailsScreenData.endlong
                console.log(x)
                staginarray[staginarray.length] = x
            }
            console.log(staginarray)
            updateNoses(staginarray);
        }

        function updateNoses(staginarray) {
            for (var i = 0; i < staginarray.length; i++) {
                var action = staginarray[i].action
                delete staginarray[i]["action"]
                console.log(staginarray[i])
                insertAssessmentResultsStaging(staginarray[i], action, function () {
                    console.log('rows inserted: OK');
                })
            }
        }

        //
    },
    //////////////////////////
    // Tabbar Page Controller //
    //////////////////////////
    homeTabPage: function (page) {
    }, ////////////////////////
    // Menu Page Controller //
    ////////////////////////
    menuPage: function (page) {
    }, ////////////////////////
    // Assessor profile Controller //
    ////////////////////////
    assessorProfilePage: function (page) {
        getAssessorProfile([], function (response) {
            hideSpinner();
            frameAssessorProfile(response)

            $(".assessorProfileEdit").unbind("click").click(function () {
                //            document.querySelector('#myNavigator').popPage();
                if (response) document.querySelector('#myNavigator').pushPage('html/assessor_profile_edit.html', {data: response});
            });
        })


        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        })
        $(document).ready(function () {
            $('select').material_select();
        });
    }, ////////////////////////
    // Assessor profile edit Controller //
    ////////////////////////
    assessorProfilePageEdit: function (page) {


        var assessorProfilePageData = page.data


        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        })

        $("#ChangePicture").click(function () {
            openFilePicker("mapIcon")
        })
        getDropDowns([], function (response) {
            hideSpinner();
            frameAssessorProfileEdit(response, assessorProfilePageData)

            $("#saveAssessor").click(function () {

                updateUpdateAssessorProfileinServer(buildUpdateAssessorProfile(), function (response) {
//                    document.querySelector('#myNavigator').popPage();    
                    hideSpinner();
                    document.querySelector('#myNavigator').resetToPage('html/synchronizeAll.html');
                })

            })
        })
        $(document).ready(function () {
            $('select').material_select();
        });
    }, ////////////////////////
    // Assessor-agency profiles List Controller //
    ////////////////////////
    agencyProfilesListPage: function (page) {


        getAgencyProfile([], function (response) {
            hideSpinner();
            frameAgencyProfilesList(response);
        })


        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        })
        $(document).ready(function () {
            $('select').material_select();
        });
    }, ////////////////////////
    // Assessor-agency profile Controller //
    ////////////////////////
    agencyProfilePage: function (page) {
        var agencyProfileTest = page.data
        frameAgencyProfile(agencyProfileTest);
        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        })
        $(document).ready(function () {
            $('select').material_select();
        });
    },
    ////////////////////////
    // certificate Page Controller //
    ////////////////////////
    cerficateresult: function (page) {
        console.log(page.data);
        var data = page.data;
        $('#name').html(data.Salutation + data.CandidateName);
         $("#Sector").html(data.SectorName);
         $("#CandidateName").html(data.CandidateName);
         $("#Qpnumber").html(data.JobRoleCode);
         $("#jobrole").html(data.JobRole);
         $("#NSQFlevel").html(data.NSQF);
         $("#Grade").html(data.Grade);
         $("#DateOfIssuance").html(data.DateOfIssuance);

        $('#back').click(function () {
            document.querySelector('#myNavigator').popPage();
            scan()
        })

        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
            scan()
        })

        $(document).ready(function () {
            $('select').material_select();
        });
    }, ////////////////////////////
    // New Task Page Controller //
    ////////////////////////////
    newTaskPage: function (page) {
    }, ////////////////////////////////
    // Details Task Page Controller //
    ///////////////////////////////
    detailsTaskPage: function (page) {

    }, ////////////////////////////////
    // Form List Task Page Controller //
    ///////////////////////////////
    formsListPage: function (page) {
    }, ////////////////////////////////
    // Form Page Controller //
    ///////////////////////////////
    formPage: function (page) {

    }, ////////////////////////////////
    // select Train Page Controller //
    ///////////////////////////////
    selectTrainPage: function (page) {

    }
};