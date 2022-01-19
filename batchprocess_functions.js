"use strict";
$( document ).ready(function() {

$("#timestamp").hide();
		
});
//document ready closes

function callLicenseApprovalFlow(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.licenseApprovalFlow;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("callLicenseApprovalFlow","Administration","NA",err.message);
	}
}

function runAppointmentflow(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.appointmentFlow;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("runAppointmentflow","Administration","NA",err.message);
	}
}

function runTrainingflow(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.trainingFlow;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("runTrainingflow","Administration","NA",err.message);
	}
}

function runAppointmentRenewalflow(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.renewalFlow;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("runAppointmentRenewalflow","Administration","NA",err.message);
	}
}

function runGetHierarchy(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.getHierarchyFlow;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("runGetHierarchy","Administration","NA",err.message);
	}
}

function runGetNIPR(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.getNIPRFlow;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("runGetNIPR","Administration","NA",err.message);
	}
}    
		
function runAgencyTasks(){
	try {
		ajax_icon_handling('load');
		var schemaName = environmentVarName.runAgencyTasks;
		var data = '';
		var alertMessage = 'NA';
		var uiContext = 'NA';
		triggerCloudFlow(schemaName,data,alertMessage,uiContext,"Administration");
	}
	catch (err) {
		errorLog("runAgencyTasks","Administration","NA",err.message);
	}
}

function addLastRun(){
	try {
		var currentdate = new Date(); 
		var datetime = "Last run :  "+currentdate.getDate() + "/"
		+ (currentdate.getMonth()+1)  + "/" 
		+ currentdate.getFullYear() + " @ "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() + ":" 
		+ currentdate.getSeconds();
		$("#lbltimestampLicense").text(datetime);
	}
	catch (err) {
		errorLog("addLastRun","Administration","NA",err.message);
	}
}
