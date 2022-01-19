"use strict";
var url;
function submitRequest(context){
	try {
		var appointmentStatusVal = context.getAttribute(appointmentFields.appointmentStatus).getValue();
		//If status is 'Ready to send'
		if(appointmentStatusVal === appointmentStatus.readyToSend) {
			var queryString = Xrm.Utility.getGlobalContext().getQueryStringParameters().id;
			var itemId = queryString.substring(1, queryString .length-1);
			var data={"id":itemId};
			var schemaName = environmentVarName.submitAppointment;
			var uiContext = context;
			var alertMessage = cnfAlertMessage.submitAppointment;
			triggerCloudFlow(schemaName,data,alertMessage,uiContext);
		}
		else {
			alert(cnfAlertMessage.submitAppointmentStatus);
		}
	}
	catch (err) {
		errorLog("submitRequest","Appointment","NA",err.message);
	}
}

function setAppointmentStatus(executeContext) { 
	try {
		var optionvalue = executeContext._formContext.getAttribute(appointmentFields.appointmentStatus).getSelectedOption().value ;
		//when Appointment Status is Ready for Review or Ready to Send, then remove Active, Expired, Ready for Renewal, Pending
		if (optionvalue === appointmentStatus.readyToSend || optionvalue === appointmentStatus.readyForReview) {    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.active);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.expired);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForRenewal);    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.pending);
		} else if (optionvalue === appointmentStatus.active) {    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForReview);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyToSend);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.expired);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForRenewal);    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.pending);
		}	else if (optionvalue === appointmentStatus.expired) {    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForReview);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyToSend);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.active);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForRenewal);    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.pending);
		}	else if (optionvalue === appointmentStatus.readyForRenewal) {    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForReview);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyToSend);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.active);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.expired);    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.pending);
		} else if (optionvalue === appointmentStatus.pending) {    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForReview);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyToSend);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.active);
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.expired);    
			Xrm.Page.getControl(appointmentFields.appointmentStatus).removeOption(appointmentStatus.readyForRenewal);
		}
	}
	catch (err) {
		errorLog("setAppointmentStatus","Appointment","NA",err.message);
	}
	//Code to be verified - PCF
	//setTimeout(function(){submitAppointment(executeContext) }, 1000);
}

function submitAppointment(context){
	var formContext = context.getFormContext();
	var status = formContext.getAttribute(appointmentFields.appointmentStatus).getValue();
	if(status === appointmentStatus.readyToSend){
		formContext.getAttribute("btnSubmit").controls.get(0).setVisible(true);
	}
	else{
		formContext.getAttribute("btnSubmit").controls.get(0).setVisible(false);
	}
}