document.addEventListener('deviceready', function () {
   initDB();
   createTables();
   var x = JSON.parse('{ "AssessmentID": 3, "AssessorID": 123, "BatchID": 1, "DateOfAssignment": null, "DateOfAssessorEvaluation": null, "BatchName": "1602KL00000BJSSS/Q0101-00000001", "SmartCentreBatchID": 1, "PreferedAssessmentDate": "2016-09-30T00:00:00", "JobRoleID": 17, "CentreID": 11, "CentreName": "FORCE 10 PROTECTION SERVICES PRIVATE LTD", "JobRole": "Unarmed Security Guard", "SectorName": "Security", "CandidateCount": 2, "DateModifed": "2016-10-06T13:19:51.727", "SectorID": 12, "IsReAssessment": false, "ExtendedClosureDate": null, "TrainingTypeValue": "Female", "JobRoleTypeValue": "Female", "AssessmentPeriodValue": null, "AssessmentClosureDate": "2016-09-30T00:00:00", "JobRoleLevel": 1204 }');
   insertAssessorBatches(x);
   selectAssessorBatches();
   x = JSON.parse(' { "CentreID": 1553, "CentreName": "IIS @ IL&FS-Agartala", "CentreType": "149", "Longitude": null, "Latitude": null, "PartnerName": "IL & FS Skills Development Corporation Limited", "Address": "IL&FS Skills Development Corporation Limited, TBM, Opposite ITI, Indranagar,Agartala. PIN - 799006,my sub district,Nicobar,Andaman and Nicobar Island", "Constituency": "Andaman and Nicobar Islands", "CentreSPOCDesignation": "Head", "CentreSPOCAadhaar": "789456123125", "CentreSPOCEmail": "siddharth.choudhary@ilfsindia.con", "CentreSPOCMobNo": null, "NameAsOnBank": "Naveera", "BankAccountNo": "12345678901", "IFSCCode": "SBIN0002773", "BranchName": "STATE BANK OF INDIA-PAKALA (CHITTOOR DIST.)", "SPOCName": null }');
   insertAssessorCentres(x);
   selectAssessorCentres();
   x = JSON.parse('{ "AssessmentID": 1, "BatchID": 2, "BatchName": "1602TC1011JAGR/Q0101-00000002", "SmartCentreBatchID": 2, "JobRoleID": 35, "CentreID": 1553, "IsReAssessment": true, "CandidateName": "Manoj", "SDMSCandidateID": null, "CandID": 1, "JobRoleCode": "AGR/Q0101", "JobRoleTypeValue": "Non Technical", "TrainingTypeValue": "New Skilling", "JobRoleLevel": 4, "CentreCandID": "0", "Attendance": null, "CentreCandIDImage": null }');
   insertCandidatesInAssessorBatches(x);
   selectCandidatesInAssessorBatches();



   //   test cases for updating
    var x = JSON.parse('{ "AssessmentID": 3, "AssessorID": 532164165, "BatchID": 1, "DateOfAssignment": null, "DateOfAssessorEvaluation": null, "BatchName": "1602KL00000BJSSS/Q0101-00000001", "SmartCentreBatchID": 1, "PreferedAssessmentDate": "2016-09-30T00:00:00", "JobRoleID": 17, "CentreID": 11, "CentreName": "FORCE 10 PROTECTION SERVICES PRIVATE LTD", "JobRole": "Unarmed Security Guard", "SectorName": "Security", "CandidateCount": 2, "DateModifed": "2016-10-06T13:19:51.727", "SectorID": 12, "IsReAssessment": false, "ExtendedClosureDate": null, "TrainingTypeValue": "Female", "JobRoleTypeValue": "Female", "AssessmentPeriodValue": null, "AssessmentClosureDate": "2016-09-30T00:00:00", "JobRoleLevel": 1204 }');
    insertAssessorBatches(x);
   selectAssessorBatches();

});