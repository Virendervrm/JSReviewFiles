"use strict";
    var SaveMode = {
        Save: 1,
        SaveAndClose: 2,
        SaveAndNew: 59,
        Autosave: 70
    };

var isValidationNeeded = true;
    
function RetrieveBeneficiary(executionContext) {
	try {
		//so if there are several save handlers and one of previous already called preventDefault
		//there is no need to do any validations anymore
		if (executionContext.getEventArgs().isDefaultPrevented()) {
			return;
		}

		//getting save mode from event
		var saveMode = executionContext.getEventArgs().getSaveMode();

		//if savemode is not one of listed - just quit the execution and let the record to be saved
		if (saveMode !== SaveMode.Save &&
			saveMode !== SaveMode.SaveAndClose &&
			saveMode !== SaveMode.SaveAndNew &&
			saveMode !== SaveMode.Autosave) {
			return;
		}

		//so if validation was successfully passed - flag is reset
		//and code just leaves the form alone and allows changes to be saved
		if (!isValidationNeeded) {
			isValidationNeeded = true;
			return;
		}

		//getting of the form context from execution context object
		var formContext = executionContext.getFormContext();

		//preventing of the save operation before async operation is started
		executionContext.getEventArgs().preventDefault();

		var id = localStorage.getItem("contactId");
		var query = "?$select=contactid&$expand=cr0e0_Contact_Contact_Beneficiary_cr0e0_Benefic($select=cr0e0_percentageallocation)&$filter=contactid eq '" + id + "'";
		var total = 0;
		var allocationVal = formContext.getAttribute(beneficiaryField.percentageAlcon).getValue();
		total = total + parseInt(allocationVal);
		Xrm.WebApi.retrieveMultipleRecords("contact", query).then(
			function success(results) {
				results.entities.forEach(function (beneficiaries) {
					beneficiaries.cr0e0_Contact_Contact_Beneficiary_cr0e0_Benefic.forEach(function (item){
						total = total + parseInt(item.cr0e0_percentageallocation);
					});
				});
				var excessVal = parseInt(total)-100;
				if(total > 100){
					formContext.ui.setFormNotification("Percentage allocation cannot be more than 100. Remove excess allocation of - " +excessVal +"%", "ERROR", "errorNotif");
				} 
				else {
					isValidationNeeded = false;
					//and save event is called again
					if (saveMode === SaveMode.Save ||
						saveMode === SaveMode.Autosave) {
						formContext.data.entity.save();
					} else if (saveMode === SaveMode.SaveAndClose) {
						formContext.data.entity.save("saveandclose");
					} else {
						formContext.data.entity.save("saveandnew");
					}
				}
				
			},
			function (error) {                
				var errorObjXRM = JSON.parse(error.raw);
				var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
				errorLog("RetrieveBeneficiary","Beneficiary",statusCode,error.message);
			}
		);
	}
	catch (err) {
		errorLog("RetrieveBeneficiary","Beneficiary","NA",err.message);
	}
}
