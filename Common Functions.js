"use strict";
var url;

/*Reference files */
var scriptJquery = document.createElement('script');
var scriptSweetAlert = document.createElement('script');
var scriptSweetAlertCSS = document.createElement('link');
          
scriptJquery.src ="../webresources/cr0e0_jquery1.5.1";
scriptSweetAlert.src ="../webresources/cr0e0_sweetalert";
scriptSweetAlertCSS.href ="../webresources/cr0e0_sweetalertcss";
scriptSweetAlertCSS.rel  = 'stylesheet';
scriptSweetAlertCSS.type = "text/css";
document.head.appendChild(scriptJquery);
document.head.appendChild(scriptSweetAlert);
document.head.appendChild(scriptSweetAlertCSS);
		

/*CRUD Dataverse Web API */

var Sdk = window.Sdk || {};  
  

/**  
 * @function getClientUrl  
 * @description Get the client URL.  
 * @returns {string} The client URL.  
 */  
Sdk.getClientUrl = function () {  
 var context;  
 // GetGlobalContext defined by including reference to   
 // ClientGlobalContext.js.aspx in the HTML page.  
 if (typeof GetGlobalContext != "undefined") {  
  context = GetGlobalContext();  
 } else {  
  if (typeof Xrm != "undefined") {  
   // Xrm.Page.context defined within the Xrm.Page object model for form scripts.  
   context = Xrm.Page.context;  
  } else {  
   throw new Error("Context is not available.");  
  }  
 }  
 return context.getClientUrl();  
  
};  
  
/**  
 * An object instantiated to manage detecting the  
 * Web API version in conjunction with the   
 * Sdk.retrieveVersion function  
 */  
Sdk.versionManager = new function () {  
 //Start with base version  
 var _webAPIMajorVersion = 8;  
 var _webAPIMinorVersion = 0;  
 //Use properties to increment version and provide WebAPIPath string used by Sdk.request;  
 Object.defineProperties(this, {  
  "WebAPIMajorVersion": {  
   get: function () {  
    return _webAPIMajorVersion;  
   },  
   set: function (value) {  
    if (typeof value != "number") {  
     throw new Error("Sdk.versionManager.WebAPIMajorVersion property must be a number.")  
    }  
    _webAPIMajorVersion = parseInt(value, 10);  
   }  
  },  
  "WebAPIMinorVersion": {  
   get: function () {  
    return _webAPIMinorVersion;  
   },  
   set: function (value) {  
    if (isNaN(value)) {  
     throw new Error("Sdk.versionManager._webAPIMinorVersion property must be a number.")  
    }  
    _webAPIMinorVersion = parseInt(value, 10);  
   }  
  },  
  "WebAPIPath": {  
   get: function () {  
    return "/api/data/v" + _webAPIMajorVersion + "." + _webAPIMinorVersion;  
   }  
  }  
 })  
  
}  
    
/**  
 * @function request  
 * @description Generic helper function to handle basic XMLHttpRequest calls.  
 * @param {string} action - The request action. String is case-sensitive.  
 * @param {string} uri - An absolute or relative URI. Relative URI starts with a "/".  
 * @param {object} data - An object representing an entity. Required for create and update actions.  
 * @param {object} addHeader - An object with header and value properties to add to the request  
 * @returns {Promise} - A Promise that returns either the request object or an error object.  
 */  
Sdk.request = function (action, uri, data, addHeader) {  
	if (!RegExp(action, "g").test("POST PATCH PUT GET DELETE")) { // Expected action verbs.  
		throw new Error("Sdk.request: action parameter must be one of the following: " +  
		  "POST, PATCH, PUT, GET, or DELETE.");  
	}  
	if (!typeof uri === "string") {  
		throw new Error("Sdk.request: uri parameter must be a string.");  
	}  
	if ((RegExp(action, "g").test("POST PATCH PUT")) && (!data)) {  
		throw new Error("Sdk.request: data parameter must not be null for operations that create or modify data.");  
	}  
	if (addHeader) {  
		if (typeof addHeader.header != "string" || typeof addHeader.value != "string") {  
			throw new Error("Sdk.request: addHeader parameter must have header and value properties that are strings.");  
	}  
}  
  
 // Construct a fully qualified URI if a relative URI is passed in.  
 if (uri.charAt(0) === "/") {  
  //This sample will try to use the latest version of the web API as detected by the   
  // Sdk.retrieveVersion function.  
  uri = Sdk.getClientUrl() + Sdk.versionManager.WebAPIPath + uri;  
 }  
  
 return new Promise(function (resolve, reject) {  
  var request = new XMLHttpRequest();  
  request.open(action, encodeURI(uri), true);  
  request.setRequestHeader("OData-MaxVersion", "4.0");  
  request.setRequestHeader("OData-Version", "4.0");  
  request.setRequestHeader("Accept", "application/json");  
  request.setRequestHeader("Content-Type", "application/json; charset=utf-8");  
  if (addHeader) {  
   request.setRequestHeader(addHeader.header, addHeader.value);  
  }  
  request.onreadystatechange = function () {  
   if (this.readyState === 4) {  
    request.onreadystatechange = null;  
    switch (this.status) {  
     case 200: // Operation success with content returned in response body.  
     case 201: // Create success.   
     case 204: // Operation success with no content returned in response body.  
      resolve(this);  
      break;  
     default: // All other statuses are unexpected so are treated like errors.  
      var error;  
      try {  
       error = JSON.parse(request.response).error;  
      } catch (e) {  
       error = new Error("Unexpected Error");  
      }  
      reject(error);  
      break;  
    }  
   }  
  };  
  request.send(JSON.stringify(data));  
 });  
};  
  function customalert(txt)
{
debugger;
alert(txt);
}


/*CRUD Dataverse Web API */

//calling on load of form
function saveFormChanges(formContext, webresourceName, btn) {
	var wrControl = formContext.getControl(webresourceName);
	if (wrControl) {
		wrControl.getContentWindow().then(
			function (contentWindow) {
				contentWindow.getFieldValues(Xrm, formContext);
				var obj = wrControl.getObject();
				obj.contentWindow.document.getElementById(btn).onclick = function()
				{
					contentWindow.saveChanges(Xrm, formContext);
				}
			}
				
		)
	}
}

//Power automate flow - common function
function triggerCloudFlow(schemaName,data,alertMessage,uiContext, screenName) {
	var organizationURI = "https://" + window.location.href.split('/')[2];
	var req = new XMLHttpRequest()
	req.open("GET", encodeURI(organizationURI + "/api/data/v9.0/environmentvariablevalues?$select=value,_environmentvariabledefinitionid_value&$expand=EnvironmentVariableDefinitionId($select=schemaname)"), true);
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.setRequestHeader("OData-MaxVersion", "4.0");
	req.setRequestHeader("OData-Version", "4.0");
	req.onreadystatechange = function () {
		if (this.readyState == 4 /* complete */) {
			req.onreadystatechange = null;
			if (this.status == 200) {
				var results = JSON.parse(this.response).value;
				for(var i = 0; i < results.length; i++){
				if(results[i].EnvironmentVariableDefinitionId["schemaname"] == schemaName) {
					url = results[i].value;
					}
				}
				var method = "POST";
				//Async to be true, to prevent other execution from waiting for response
				var shouldBeAsync = true;
				var request = new XMLHttpRequest(); 
				request.onload = function () {   
					var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
					var reponseData = request.responseText; // Returned data, e.g., an HTML document.
					if (status  === 200 || status  === 202) {
						if(alertMessage !== "NA" || !alertMessage){
							alert(alertMessage);
						}
						if (uiContext) {
							if(uiContext == "NA"){
								ajax_icon_handling(true);
							}
							else{
								uiContext.ui.close();								
							}
						}
					} 
					else {
						if(uiContext=="NA"){
								ajax_icon_handling(false);
						}
						else {
							alert('Error Occured');
						}
						//Error log on POST data (cloud flow)
						var errorObj = JSON.parse(this.response).error;
						errorLog("triggerCloudFlow - POST",screenName,status.toString(),errorObj.message);
					}
				}
				request.open(method, url, shouldBeAsync);
				request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				request.send(JSON.stringify({data}));
			} 
			else {
				//Error log on environment variable get request
				var error = JSON.parse(this.response).error;
				errorLog("triggerCloudFlow - GET",screenName,this.status.toString(),error.message);
			}
		}
	};
	req.send();
}


//Function to show ajax popup on call of flows from Automation screen
function ajax_icon_handling(type) {
			switch (type) {
            case 'load':
                swal.fire({
                    title: '',
                    html: '<div class="save_loading"><svg viewBox="0 0 140 140" width="140" height="140"><g class="outline"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="rgba(0,0,0,0.1)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="circle"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="#71BBFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="200" stroke-dasharray="300"></path></g></svg></div><div><h4>Triggering flow ...</h4></div>',
                    showConfirmButton: false,
                    allowOutsideClick: false
                });
                break;
            case false:
                setTimeout(function(){
                    $('#swal2-content').html('<div class="sa"><div class="sa-error"><div class="sa-error-x"><div class="sa-error-left"></div><div class="sa-error-right"></div></div><div class="sa-error-placeholder"></div><div class="sa-error-fix"></div></div></div><div><h4>An error has occurred!</h4></div><button class="confirm swal-close" style="display: inline-block; border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);" onclick=" closePopup()">OK</button>');
                }, 1000);				   
                break;
            case true:
                setTimeout(function(){
                    $('#swal2-content').html('<div class="sa"><div class="sa-success"><div class="sa-success-tip"></div><div class="sa-success-long"></div><div class="sa-success-placeholder"></div><div class="sa-success-fix"></div></div></div><div><h4>Flow has been triggered successfully!</h4></div>');
                }, 1000);
                setTimeout(function() {
                    swal.close(true);
                }, 2000);
                break;
        }
}
//Soft alert for response saved
function ajax_icon_handlingSave(type) {
		switch (type) {
			case 'load':
				swal.fire({
					title: '',
					html: '<div class="save_loading"><svg viewBox="0 0 140 140" width="140" height="140"><g class="outline"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="rgba(0,0,0,0.1)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></g><g class="circle"><path d="m 70 28 a 1 1 0 0 0 0 84 a 1 1 0 0 0 0 -84" stroke="#71BBFF" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dashoffset="200" stroke-dasharray="300"></path></g></svg></div><div><h4>Saving response...</h4></div>',
					showConfirmButton: false,
					allowOutsideClick: false
				});
				break;
			case false:
				setTimeout(function(){
					$('#swal2-content').html('<div class="sa"><div class="sa-error"><div class="sa-error-x"><div class="sa-error-left"></div><div class="sa-error-right"></div></div><div class="sa-error-placeholder"></div><div class="sa-error-fix"></div></div></div><div><h4>An error has occurred; please contact web support for assistance.</h4></div><button class="confirm swal-close" style="display: inline-block; border-left-color: rgb(48, 133, 214); border-right-color: rgb(48, 133, 214);">OK</button>');
				}, 1000);
						$('.swal-close').on('click', function() { swal.closeModal(); });
				break;
			case true:
				setTimeout(function(){
					$('#swal2-content').html('<div class="sa"><div class="sa-success"><div class="sa-success-tip"></div><div class="sa-success-long"></div><div class="sa-success-placeholder"></div><div class="sa-success-fix"></div></div></div><div><h4>Response has been saved successfully!</h4></div>');
				}, 1000);
				setTimeout(function() {
					swal.close(true);
				}, 2000);
				break;
		}
	
}

function getSelectedAgencyHierarchy(selectedItems){
	var selectedItem = [];
	var i; 
	for(i=0;  i<selectedItems.length;i++){
		selectedItem.push({"id":selectedItems[i].Id,"name":selectedItems[i].Name});
	}
    var data=selectedItem;
    var schemaName = environmentVarName.getSelectedAgencyHierarchy;
    var alertMessage = cnfAlertMessage.getSelectedAgencyHierarchy;
	var uiContext = Xrm.Page;
	//Common function
    triggerCloudFlow(schemaName,data,alertMessage,uiContext);
}

//Function to close the pop up
function closePopup(){
	swal.close(true);
}

//Error Log
function errorLog(sourceMethod,sourceScreen,statusCode,description){   
	eventLog.cr0e0_sourcemethod = sourceMethod;
	eventLog.cr0e0_sourcescreen = sourceScreen;
	eventLog.cr0e0_statuscode = statusCode;
	eventLog.cr0e0_description = description;
	eventLog.cr0e0_logtime = new Date();
	Sdk.request("POST", entitySetName.eventLog, eventLog)  
	.then(function (request) {  
		// Process response from previous request.
		console.log("error logged"); 		
	})	
}

//Constants
var environmentVarName = 
{
	callNIPRflow : "cr0e0_FetchNIPRDetails",
	createContract :  "cr0e0_CreateContract",
	getSelectedAgencyHierarchy : "cr0e0_CreateAgencyHierarchyFile",
	submitProducer : "cr0e0_SubmitProducer",
	submitAppointment : "cr0e0_SubmitAppointment",
	rejectAgencyTask : "cr0e0_RejectAgencyTask",
	approveAgencyTask : "cr0e0_ApproveAgencyTask",
	licenseApprovalFlow : "cr0e0_ProcessLicenseFlow",
	appointmentFlow : "cr0e0_ProcessAppointmentFlow",
	trainingFlow : "cr0e0_ProcessTrainingFlow",
	renewalFlow : "cr0e0_ProcessRenewalFlow",
	getHierarchyFlow : "cr0e0_LoadProducerHierarchy",
	getNIPRFlow : "cr0e0_ProcessNIPRLookup",
	runAgencyTasks : "cr0e0_ProcessAgencyTasks"
}

var cnfAlertMessage =
{
	callNIPRflow : "Details fetched successfully",
	getSelectedAgencyHierarchy : "Hierarchy file created successfully for the selected agencies",
	rejectAgencyTask : "Request has been rejected!!!",
	approveAgencyTask : "Request has been approved!!!",
	createContract : "Contract has been created successfully",
	submitAppointment : "Request Submitted Successfully",
	submitAppointmentStatus : "The status should be Ready to send"
}

var eventLog = {  
	cr0e0_eventtype : 523240001,
	cr0e0_logtime : new Date(),
	cr0e0_source : 523240000,
	cr0e0_sourcemethod : null,
	cr0e0_sourcescreen : null,
	cr0e0_statuscode : null,
	cr0e0_description : null,
};

var entitySetName = {
	eventLog : "/cr0e0_eventlogs"
};

var formTypeValue =
{
	edit : 2
}

var webResource = 
{
	agencyHierarchy : "cr0e0_Agency_Hierarchy"
}

var agencyTaskAction = 
{
	resumeProducer : 523240005,
	resumeLocation : 523240004,
	terminateProducer : 523240003,
	terminateLocation : 523240002,
	resumeAgency : 523240001,
	suspendAgency : 523240000
	 
}

var lookupFields =
{
	columnAction : "cr0e0_action",
	columnProducer : "cr0e0_producer",
	columnLocation : "cr0e0_location",
	columnProducerWritingCode : "cr0e0_producerwritingcodes"
}

var agencyInactiveProducer = 
{
	yes : 523240000,
	no : 523240001,
}
var agencyFields =
{
	agencyControl : "cr0e0_agencycontrol",
	inactiveProducer : "cr0e0_inactiveproducers"
}

var producerFields =
{
	npn : "cr0e0_npn",
	onboardingStatus : "cr0e0_onboardingstatus",
}

var bgQuestions = 
{
	misdemeanor : "cr0e0_misdemeanor",
	felony : "cr0e0_felony",
	felonyConviction : "cr0e0_felonyconviction",
	consent : "cr0e0_consent",
	felonyYes : 523240000,
	felonyNo : 523240001,
	felonyNA : 523240002,
	militaryOffense : "cr0e0_militaryoffense",
	finra : "cr0e0_finra",
	notified : "cr0e0_notified",
	overdue : "cr0e0_overdue",
	liable : "cr0e0_liable",
	insured : "cr0e0_insured",
	jurisdiction : "cr0e0_jurisdiction",
	bankruptcy : "cr0e0_bankruptcy",
	misconduct : "cr0e0_misconduct",
	arrearage : "cr0e0_arrearage",
	identifyJurisdiction : "cr0e0_identifythejurisdictions",
	repayment : "cr0e0_repayment",
	subpoena : "cr0e0_subpoena",
	arrearageMonths : "cr0e0_arrearagemonths",
}

var appointmentFields =
{
	appointmentStatus : "cr0e0_appointmentstatus"
}

var appointmentStatus =
{
	active : 523240002,
	expired : 523240003,
	readyForRenewal : 523240004,
	pending : 523240005,
	readyForReview : 523240000,
	readyToSend : 523240001
}

var locationFields =
{
	agencyToLocation : "cr0e0_agencytolocation",
	isPrimaryLocation : "cr0e0_isprimarylocation"	
}

var fields =
{
	ssnMasked : "cr0e0_ssnmasked",
	ssn : "cr0e0_ssn"
}

var onBoardFields = 
{
	searchBySSN : 523240000,
	searchBy : "cr0e0_searchby"
}

var beneficiaryField = 
{
	percentageAlcon : "cr0e0_percentageallocation"
}