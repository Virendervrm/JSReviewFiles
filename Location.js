var formContext;
//Load on quick create form
function checkPrimaryLocation(executionContext) {
	formContext = executionContext.getFormContext();
	var itemId = formContext.getAttribute(locationFields.agencyToLocation).getValue()[0].id
	var id=itemId.substring(1, itemId.length-1);	
	var status=[];
	var isPrimary=false;
	var query = "?$select=msfsi_agencyid&$expand=cr0e0_msfsi_Agency_AgencyToLocation_cr0e0_Locat($select=cr0e0_isprimarylocation)&$filter=msfsi_agencyid eq '" + id + "'";
	Xrm.WebApi.retrieveMultipleRecords("msfsi_agency", query).then(
		function success(results) {
			results.entities.forEach(function (locations) {
				locations.cr0e0_msfsi_Agency_AgencyToLocation_cr0e0_Locat.forEach(function (item) {
					if(item.cr0e0_isprimarylocation==true) { 
						formContext.getAttribute(locationFields.isPrimaryLocation).controls.get(0).setDisabled(true);
					}
					status.push(item.cr0e0_isprimarylocation);
				});
			});
			console.log('is primary:',status);
		},
		function (error) {                
			var errorObjXRM = JSON.parse(error.raw);
			var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
			errorLog("checkPrimaryLocation","Location",statusCode,error.message);
		}
	);
}

//Load on main form
function checkForPrimaryLocationMainForm(executionContext) {
	try {
		formContext = executionContext.getFormContext();
		var formType = formContext.ui.getFormType();
		if(formType === formTypeValue.edit) { 
			if( formContext.getAttribute(locationFields.isPrimaryLocation).getValue()==true){
				formContext.getAttribute(locationFields.isPrimaryLocation).controls.get(0).setDisabled(false);
			} else {
				checkPrimaryLocation(executionContext);
			}
		}
	}
	catch (err) {
		errorLog("checkForPrimaryLocationMainForm","Location","NA",err.message);
	}
}