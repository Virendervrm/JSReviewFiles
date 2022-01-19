var context;
function addPreseacrh(executionContext) {
	formContext = executionContext.getFormContext();
	context = executionContext;
	formContext.getControl("cr0e0_writing_code_id").addPreSearch(filterAgencyWritingCodes);
        formContext.getAttribute("cr0e0_writing_code_id").addOnChange(checkDuplicateRecord);
debugger;
}
function filterAgencyWritingCodes() {
	var formContext = context.getFormContext();
	var producerId = formContext.getAttribute("cr0e0_producername").getValue()[0].id;
	var writingcodeFilter = "<filter type='and'><condition attribute = 'cr0e0_associatedwriteingcodes' operator = 'in'>";
	var req = new XMLHttpRequest();
	req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/msfsi_producers?$select=_cr0e0_agency_value&$filter=msfsi_producerid eq " + producerId, false);
	req.setRequestHeader("OData-MaxVersion", "4.0");
	req.setRequestHeader("OData-Version", "4.0");
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
	req.onreadystatechange = function () {
		if (this.readyState === 4) {
			req.onreadystatechange = null;
			if (this.status === 200) {
				var results = JSON.parse(this.response);

				if(results.value.length > 0) {
					var agencyid = results.value[0]["_cr0e0_agency_value"];
					var req1 = new XMLHttpRequest();
					req1.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/cr0e0_locations?$filter=_cr0e0_agencytolocation_value eq " + agencyid, false);
					req1.setRequestHeader("OData-MaxVersion", "4.0");
					req1.setRequestHeader("OData-Version", "4.0");
					req1.setRequestHeader("Accept", "application/json");
					req1.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req1.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
					req1.onreadystatechange = function () {
						if (this.readyState === 4) {
							req1.onreadystatechange = null;
							if (this.status === 200) {	
								var results = JSON.parse(this.response);

								for (var i = 0; i < results.value.length; i++) {
									var locationid = results.value[i]["cr0e0_locationid"];
									writingcodeFilter += "<value uitype='cr0e0_location'>{" + locationid + "}</value>";
								}
								writingcodeFilter += "</condition></filter>";

								
								formContext.getControl("cr0e0_writing_code_id").addCustomFilter(writingcodeFilter, "cr0e0_producerwritingcodes");

								
							} else {
								Xrm.Utility.alertDialog(this.statusText);
								var error = JSON.parse(this.response).error;
								errorLog("filterAgencyWritingCodes - agencyID","Producer writingcode",this.status.toString(),error.message);
							}
						}
					};
					req1.send();

				}
			} else {
				Xrm.Utility.alertDialog(this.statusText);
				var error = JSON.parse(this.response).error;
				errorLog("filterAgencyWritingCodes - producerID","Producer writingcode",this.status.toString(),error.message);
			}
		}
	};
	req.send();
}

function checkDuplicateRecord(executionContext) {
	formContext = executionContext.getFormContext();
	context = executionContext;
	if (formContext.getAttribute("cr0e0_writing_code_id").getValue() !== null) {
		producerID = formContext.getAttribute("cr0e0_producername").getValue()[0].id;
		writingcodeID = formContext.getAttribute("cr0e0_writing_code_id").getValue()[0].id;
		var saveEvent = context.getEventArgs();
		debugger

		var query2 = "?$select=cr0e0_writing_code_id&$filter=_cr0e0_producername_value eq '" + producerID + "'";
		Xrm.WebApi.retrieveMultipleRecords("cr0e0_prodwritingcode", query2).then(
			function success(result2) {
				var ary = [];
				result2.entities.forEach(function (prodwritingcodes) {
				debugger;
					ary.push(prodwritingcodes._cr0e0_writing_code_id_value);
					
				});
				var wc_exist = ary.includes(writingcodeID.slice(1,-1).toLowerCase());
				var btnId = "quickCreateSaveAndCloseBtn_".concat(formContext.pageId);
				if (wc_exist == true) {
					alert("This record is already saved. Please select another writing code!");
					//top.document.getElementById("quickCreateSaveAndCloseBtn_1").disabled = true;

					top.document.getElementById(btnId).style.visibility = 'hidden';
					top.document.getElementById("quickCreateSaveAndNewBtn").style.visibility = 'hidden';
                                       formContext.getAttribute("cr0e0_writing_code_id").setValue('');


				} else {
					top.document.getElementById(btnId).style.visibility = '';
					top.document.getElementById("quickCreateSaveAndNewBtn").style.visibility = ''
				}
			},
			function (error) {
				var errorObjXRM = JSON.parse(error.raw);// handle error conditions
				var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
				errorLog("getHierarchyData - result2","Agency",statusCode,error.message);
			}
		);
	}
}