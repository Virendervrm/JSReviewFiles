"use strict";

function setContactID(executionContext){
	try {
		var formContext = executionContext.getFormContext();
		window._formContext = formContext;
		var contactId = formContext.data.entity.getId();
		if(contactId !== ''){
			contactId = contactId.split("{")[1].split("}")[0];
			localStorage.setItem("contactId", contactId);		
		}
	}
	catch (err) {
		errorLog("setContactID","Contacts","NA",err.message);
	}
}
