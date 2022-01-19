"use strict";
var url;
var id, itemId, schemaName, data, alertMessage;
//Agency approval task
function agencyTaskApproval(context) {
	try {
		schemaName = environmentVarName.approveAgencyTask;
		id = context.entityReference.id;
		itemId = id.substring(1, id.length-1);	
		data = { "id" : itemId };
		alertMessage = cnfAlertMessage.approveAgencyTask;
		//common function
		triggerCloudFlow(schemaName, data, alertMessage, context, "Agency Tasks");
	}
	catch (err) {
		errorLog("agencyTaskApproval","Agency Tasks","NA",err.message);
	}
}
//Agency Rejection task
function RejectAgencyTask(context) {
	try {
		schemaName = environmentVarName.rejectAgencyTask;
		id = context.entityReference.id;
		itemId = id.substring(1, id.length-1);	
		data = { "id" : itemId };
		alertMessage = cnfAlertMessage.rejectAgencyTask;
		//common function
		triggerCloudFlow(schemaName, data, alertMessage, context, "Agency Tasks");
	}
	catch (err) {
		errorLog("RejectAgencyTask","Agency Tasks","NA",err.message);
	}
}
//Agency settings set tasks - ribbon
function checkAgencyTasksAction(context){
	try {
		var formContext=context.getFormContext();
		var action = formContext.getAttribute(lookupFields.columnAction).getValue();
		switch(action) {
			case agencyTaskAction.resumeProducer:
				formContext.getControl(lookupFields.columnProducer).setDefaultView("{4348a8af-8bd1-4ac3-b0be-1b25b4349a7c}")
				break;
			case agencyTaskAction.resumeLocation :
				formContext.getControl(lookupFields.columnLocation).setDefaultView("{7d7c57a7-51b6-45a9-bef4-301b0948db13}")
				break;
			case agencyTaskAction.terminateLocation :
				formContext.getControl(lookupFields.columnLocation).setDefaultView("{49822b05-ea14-40d2-9aa2-a8196020eb3e}")
				break;
			case agencyTaskAction.terminateProducer :
				formContext.getControl(lookupFields.columnProducer).setDefaultView("{e491218e-4403-48d6-b2e5-766b6521dae7}")
				break;
		}
	}
	catch (err) {
		errorLog("checkAgencyTasksAction","Agency Tasks","NA",err.message);
	}
}