// CONSTANTS
//sanjay time
// var date1= new date();
// getDBDate(d;
// var CERTURL="https://c20uatweb100.saas.talismaonline.com/CandidateVerificationWebAPI/Candidate/CandidateDetails?CandCertificateNumber=" + Certifacateno
function showSpinner() {
    $("#loadingSpinner").show()
}

function hideSpinner() {
    $("#loadingSpinner").hide()
}
function scan() {
    console.log("inside");
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                if (result.format != "QR_CODE") {
                } else {
                    var value = result.text;
                    var s1 = value.split("Link:");
                    console.log(s1[1]);
                    var s2=value.split(",");
                    // Name:Mr. Prakyath,
                    //     Sector:Construction,
                    //     QP Number:CON/Q0101,
                    //     Job Role:Helper Mason,
                    //     NSQF Level:1,
                    //     Grade:Grade B,
                    //     Date of Issuance:Feb 7, 2017,
                    var name=s2[0].slice(5);
                    var sector=s2[1].slice(8);
                    var qp=s2[2].slice(11);
                    var job=s2[3].slice(10);
                    var nsqf=s2[4].slice(12);
                    var grade=s2[5].slice(7);
                    var date=s2[6].concat(s2[7]);
                    console.log(name);
                    console.log(sector);
                    console.log(qp);
                    console.log(job);
                    console.log(nsqf);
                    console.log(grade);
                    console.log(date);
                    var Certifacateno1 = s1[1].slice(44);
                    var cert = String(Certifacateno1);
                    function myTrim(x) {
                        return x.replace(/^\s+|\s+$/gm, '');
                    }
                    var Certifacateno = myTrim(cert);
                    console.log(Certifacateno);
                    // navigator.notification.alert(Certifacateno);
                    var dummy="B6AC7D120889458FA0C362D8C55E5FC8";
                    showSpinner();
                    $.ajax({
                        url: "https://c20uatweb100.saas.talismaonline.com/CandidateVerificationWebAPI/Candidate/CandidateDetails?CandCertificateNumber=" + Certifacateno//Enrollid, Certifacateno)
                        , type: 'GET'
                        , traditional: true
                        , timeout: 10000
                        , headers: {}
                        , statusCode: {
                            200: function (result) {
                                hideSpinner();
                                console.log(result);
var resultname=result.Salutation+" "+result.CandidateName;
                                if (result.Grade === grade && result.SectorName===sector && result.JobRole ===job && result.NSQF===nsqf && resultname === name ) {
                                    // navigator.notification.alert("Certificate Found");
                                    document.querySelector('#myNavigator').pushPage('html/Certificate.html', {
                                        data: result
                                    });

                                } else {
                                    navigator.notification.alert("NO DETAILS FOUND",alertDismissed);
                                    function alertDismissed() {
                                        scan();
                                    }
                                }

                            }
                            , 400: function (response) {
                                console.log(e);
                                navigator.notification.alert("user name Or password wrong");
                            }
                            , 0: function (response) {
                                navigator.notification.alert('Some thing went wrong : Check your connectivity',alertDismissed);
                                function alertDismissed()
                                {
                                    scan();
                                }
                            }
                        }
                    });

                }
            }
        },
        function (error) {
            // navigator.notification.alert("Scanning failed: " + error);
            navigator.notification.alert("INVALID DATA FORMAT");
            scan();
            console.log(error);
        }
    );
}
/**
 * Created by Sanjay on 1/31/2017.
 */

