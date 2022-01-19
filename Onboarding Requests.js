"use strict";
var url;
//On click 'Fetch NIPR details' button - Onboarding Requests form ribbon (NIPR lookup tab)
function callNIPRflow(context){
if(!checkforduplicaterecord(context))
{
	// try {
		// //var itemId = context.substring(1, context.length-1);
// var itemId=context._data._entity._entityId.guid;
		// var data={"id": itemId};
		// var schemaName = environmentVarName.callNIPRflow;
		// var alertMessage = cnfAlertMessage.callNIPRflow;
		// //Common function
		// triggerCloudFlow(schemaName,data,alertMessage,false,"Onboarding Requests");
	// }
	// catch (err) {
		// errorLog("callNIPRflow","Onboarding Requests","NA",err.message);
	// }
}

}
function checkforduplicaterecord(context) {	
var status=false;
var lastname=context.getAttribute("cr0e0_lastname").getValue();
var ssn=context.getAttribute("cr0e0_ssn").getValue();
var npn=context.getAttribute("cr0e0_npn").getValue();
	var query = "?$select=cr0e0_lastname,cr0e0_niprstatus,cr0e0_npn,cr0e0_ssn&$filter=(cr0e0_lastname eq '" + lastname + "'and cr0e0_ssn eq '"+ssn+"' and cr0e0_niprstatus eq 523240001) or (cr0e0_npn eq '" + npn + "') "
	Xrm.WebApi.retrieveMultipleRecords("cr0e0_onboard", query).then(
		function success(results) {
			if(results.entities.length>0)
			{
alert('Record already exist');
status=true;
			}
			else
			{
				try {
		//var itemId = context.substring(1, context.length-1);
						var itemId=context._data._entity._entityId.guid;
								var data={"id": itemId};
								var schemaName = environmentVarName.callNIPRflow;
								var alertMessage = cnfAlertMessage.callNIPRflow;
								//Common function
								triggerCloudFlow(schemaName,data,alertMessage,false,"Onboarding Requests");
							}
							catch (err) {
								errorLog("callNIPRflow","Onboarding Requests","NA",err.message);
							}
			}

		},
		function (error) {
			var errorObjXRM = JSON.parse(error.raw);
			var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
			errorLog("checkforduplicaterecord","onboard",statusCode,error.message);
		}
	);
return status;
}

function maskedSSN(context) {
	try {
		var ssn = context._formContext.getAttribute(fields.ssn).getValue();
		var searchBy = context._formContext.getAttribute(onBoardFields.searchBy).getValue();
		if(ssn && searchBy == onBoardFields.searchBySSN) {
			var maskedString="";
			for (var i = 0; i < ssn.length; i++) {
				if(i<5)
					maskedString+= '*';
				else
					maskedString+= ssn[i];   
			}
			context._formContext.getAttribute(fields.ssnMasked).setValue(maskedString);
		}
	}
	catch (err) {
		errorLog("maskedSSN","Onboarding Requests","NA",err.message);
	}
}

function checkformtype(executionContext) {
	try {
		var formContext = executionContext.getFormContext(); // get formContext
		var formType = formContext.ui.getFormType();
		//If form type edit
		if(formType === formTypeValue.edit) {
			formContext.getAttribute(fields.ssn).controls.get(0).setVisible(false);
			formContext.getAttribute(fields.ssnMasked).controls.get(0).setVisible(true);
			formContext.getAttribute(fields.ssnMasked).controls.get(0).setDisabled(true);
		}
		else {
			formContext.getAttribute(fields.ssnMasked).controls.get(0).setVisible(false); //Added by Divya
			formContext.getAttribute(lookupFields.columnProducer).controls.get(0).setVisible(false);
		}
	}
	catch (err) {
		errorLog("checkformtype","Onboarding Requests","NA",err.message);
	}
	maskedSSN(executionContext);
}