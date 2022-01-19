'use strict';
var url, formContext;
//Calling on load of Agency form - Agency Onload Webresource
function form_onload(executionContext, webresourceName) {
	try {
		formContext = executionContext.getFormContext();
		//Common function
		saveFormChanges(formContext,webresourceName,'btnSaveResponse');
	}
	catch (err) {
		errorLog("checkformtype","Agency","NA",err.message);
	}
	checkForInactiveProducers(executionContext);
}
//Load this function on click of Hierarchy button from Agency form - hierarchy onload webresource
function hierarchyform_onload(primaryControl) {
	var id = primaryControl.entityReference.id;
	var name = primaryControl.getAttribute("msfsi_name").getValue();
	localStorage.setItem("agencyId", id);
	localStorage.setItem("agencyname", name);
	var pageInput = {
		pageType: "webresource",
		webresourceName: webResource.agencyHierarchy
	};
	Xrm.Navigation.navigateTo(pageInput).then(
		function success() {
			// Run code on success
		},
		function error(err) {
			var errorObjXRM = JSON.parse(error.raw);
			var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
			errorLog("hierarchyform_onload","Agency",statusCode,err.message);
		}
	);
}
//Check for inactive producers
function checkForInactiveProducers(executionContext) {
	formContext = executionContext.getFormContext();
	var itemId = executionContext.getFormContext().entityReference.id;
	var id=itemId.substring(1, itemId.length-1);	
	var status=[];
	var query = "?$select=msfsi_agencyid&$expand=cr0e0_msfsi_producer_cr0e0_Agency_msfsi_a($select=statecode)&$filter=msfsi_agencyid eq '" + id + "'";
	Xrm.WebApi.retrieveMultipleRecords("msfsi_agency", query).then(
		function success(results) {
			results.entities.forEach(function (producers) {
				producers.cr0e0_msfsi_producer_cr0e0_Agency_msfsi_a.forEach(function (item){					
					status.push(item.statecode);
				});
			});
			
			if(status.includes(1)){
				formContext.getAttribute(agencyFields.inactiveProducer).setValue(agencyInactiveProducer.yes)
			} else {
				formContext.getAttribute(agencyFields.inactiveProducer).setValue(agencyInactiveProducer.no)
			}
		},
		function (error) {
			var errorObjXRM = JSON.parse(error.raw);
			var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
			errorLog("checkForInactiveProducers","Agency",statusCode,error.message);
		}
	);
}
//Heirarchy structure for Agency starts here
function getHierarchyData() {
	window.Xrm = window.parent.Xrm;
	document.getElementById("level-1 agency").innerHTML = localStorage.getItem("agencyname");
	var id = localStorage.getItem("agencyId");
	var location_names = [];
	//query for locations starts
	var query = "?$select=msfsi_agencyid&$expand=cr0e0_msfsi_Agency_AgencyToLocation_cr0e0_Locat($select=cr0e0_name,cr0e0_isprimarylocation)&$filter=msfsi_agencyid eq '" + id + "'";
	Xrm.WebApi.retrieveMultipleRecords("msfsi_agency", query).then(
		function success(results) {
			results.entities.forEach(function (locations) {
				locations.cr0e0_msfsi_Agency_AgencyToLocation_cr0e0_Locat.forEach(function (item){
					location_names.push({"id": item.cr0e0_locationid, "name": item.cr0e0_name, "parent_id": "0", "parent_name": "location", "primary_loc" : item.cr0e0_isprimarylocation});
					//query for writing codes starts
					var query1 = "?$select=cr0e0_locationid&$expand=cr0e0_Location_Associatedwriteingcodes_cr($select=cr0e0_writingcodename)&$filter=cr0e0_locationid eq '" + item.cr0e0_locationid + "'";
					Xrm.WebApi.retrieveMultipleRecords(lookupFields.columnLocation, query1).then(
						function success1(results1) {
							results1.entities.forEach(function (producerwritingcodes) {
								producerwritingcodes.cr0e0_Location_Associatedwriteingcodes_cr.forEach(function (item){
									location_names.push({"id": item.cr0e0_producerwritingcodesid, "name": item.cr0e0_writingcodename, "parent_id": item._cr0e0_associatedwriteingcodes_value, "parent_name": "wc"});
									//query for producers starts
									var query2 = "?$select=cr0e0_producerwritingcodesid&$expand=cr0e0_ProdWritingCode_writing_code_id_cr0($select=_cr0e0_producername_value)&$filter=cr0e0_producerwritingcodesid eq '" + item.cr0e0_producerwritingcodesid + "'";
									Xrm.WebApi.retrieveMultipleRecords(lookupFields.columnProducerWritingCode, query2).then(
										function success(result2) {
											result2.entities.forEach(function (prodwritingcodes) {
												prodwritingcodes.cr0e0_ProdWritingCode_writing_code_id_cr0.forEach(function (item){ 
													if (item._cr0e0_producername_value !== null) {
														location_names.push({"id": item.cr0e0_prodwritingcodeid, "name": item["_cr0e0_producername_value@OData.Community.Display.V1.FormattedValue"], "parent_id": item._cr0e0_writing_code_id_value, "parent_name": "producer"});
													}
												});
											});
											loadHierarchy(location_names);
										},
										function (error) {
											var errorObjXRM = JSON.parse(error.raw);// handle error conditions
											var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
											errorLog("getHierarchyData - result2","Agency",statusCode,error.message);
										}
									);
								});
							});
						},
						function (error) {                
							var errorObjXRM = JSON.parse(error.raw);// handle error conditions
							var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
							errorLog("getHierarchyData - result1","Agency",statusCode,error.message);
						}
					);
				});
			});
			loadHierarchy(location_names);
		},
		function (error) {                
			var errorObjXRM = JSON.parse(error.raw);// handle error conditions
			var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
			errorLog("getHierarchyData - result","Agency",statusCode,error.message);
		}
	);
}
function loadHierarchy(location_names) {
	try {
		location_names.sort(function (a, b) {
			return -(a.primary_loc - b.primary_loc);
		});
		var endMenu = getMenu("0");
		function getMenu(parentID){
			return location_names.filter(function(node){ return ( node.parent_id === parentID ) ; }).sort(function(a,b){return a.index > b.index}).map(function(node){
				var exists = location_names.some(function(childNode){  return childNode.parent_id === node.id; });
				var subMenu = (exists) ? '<ul class="nested'+node.parent_name+'">'+ getMenu(node.id).join('') + '</ul>' : "";
				var span_name = "";
				if(node.parent_name == "location") {
					span_name = '<span class="square loc-square"><span class="l-text">L</span></span><span class="loc-name'+ ((exists) ? ' caret' : "" ) +'">';
				} else if (node.parent_name == "wc") {
					span_name = '<span class="square wc-square"><span class="l-text">WC</span></span><span class="wc-name'+ ((exists) ? ' caret' : "" ) +'">';
				}else if (node.parent_name == "producer") {
					span_name = '<span class="square producer-square"><span class="l-text">C</span></span>';
				}
				return '<li class="'+node.parent_name+'"><span class="hiphen">&#8212;</span>'+span_name+node.name+((node.primary_loc == true) ? '<span class="star">&starf;</span></span>' : "</span>") + subMenu + '</li>' ;
			});
		}
		document.getElementById('myUL').innerHTML = '<li><ul id="level-location">'+endMenu.join('')+ '</ul></li>';
		//Location on load Line height 
		var agencyH = document.querySelector('#myUL');
		var agencyLineHeight = 44 + (document.querySelector('#level-location').children.length - 1)* 55
		agencyH.style.setProperty('--height', agencyLineHeight+'px');

		var toggler = document.getElementsByClassName("caret");
		var i;
		for (i = 0; i < toggler.length; i++) {
			toggler[i].addEventListener("click", function() {
				//javascript for toogle hide and show starts
				if(this.className === 'wc-name caret' || this.className === 'wc-name caret caret-down') {
					this.parentElement.querySelector(".nestedwc").classList.toggle("active");
				} else if(this.className === 'loc-name caret' || this.className === 'loc-name caret caret-down'){
					this.parentElement.querySelector(".nestedlocation").classList.toggle("active");
				}
				this.classList.toggle("caret-down");  //javascript for toogle hide and show ends
				
				//Agency lineheight on change of WC 
				var agencyLine = document.querySelector('#myUL');
				var fullulHeight = window.getComputedStyle(document.querySelector("#level-location")).height;
				var lastliHeight = window.getComputedStyle(document.querySelector("#level-location li.location:last-child")).height;
				fullulHeight = fullulHeight.slice(0, -2);
				lastliHeight = lastliHeight.slice(0, -2);
				var newagencyHeight = (fullulHeight - lastliHeight) + 43;
				agencyLine.style.setProperty('--height', newagencyHeight+'px');
				
				//WC line height
				var wcUL = this.parentElement.querySelector(".nestedwc");
				if (wcUL !== null) {
					var wcUlHeight = 50 + (wcUL.children.length - 1)* 55;
					wcUL.style.setProperty('--height', wcUlHeight+'px');
				}

				//Location line height
				var locUl = this.parentElement.querySelector(".nestedlocation");
				var wcUL1 = this.parentElement.querySelector(".nestedwc.active");
				var locHeight1 = 0;
				if (locUl == null) {
					var newlocUl = this.parentNode.parentElement;
					if (wcUL1 !== null && wcUL1.children.length >=1 && newlocUl.children.length > 1) { 
						locHeight1 += window.getComputedStyle(newlocUl).height;
						locHeight1 = locHeight1.slice(0, -2);
						lastelemntHeight = window.getComputedStyle(this.parentNode.parentElement.lastElementChild).height;
						lastelemntHeight = lastelemntHeight.slice(0, -2);
						locHeight1 = (parseInt(locHeight1) - parseInt(lastelemntHeight)) + 51;

						newlocUl.style.setProperty('--height', locHeight1+'px');
					} else if(locUl == null && wcUL1 == null) { 
						locHeight1 += window.getComputedStyle(newlocUl).height;
						locHeight1 = locHeight1.slice(0, -2);
						lastelemntHeight = window.getComputedStyle(this.parentNode.parentElement.lastElementChild).height;
						lastelemntHeight = lastelemntHeight.slice(0, -2);
						locHeight1 = (parseInt(locHeight1) - parseInt(lastelemntHeight)) + 51;
						newlocUl.style.setProperty('--height', locHeight1+'px');
					}  
				} else if(locUl !== null && wcUL1 !== null) { 
					locHeight1 += window.getComputedStyle(locUl).height;
					locHeight1 = locHeight1.slice(0, -2);
					lastelemntHeight = window.getComputedStyle(locUl.lastElementChild).height;
					lastelemntHeight = lastelemntHeight.slice(0, -2);
					locHeight1 = (parseInt(locHeight1) - parseInt(lastelemntHeight)) + 51;
					newlocUl.style.setProperty('--height', locHeight1+'px');
				} else {
					var locHeight = 50 + (locUl.children.length - 1)* 55 + locHeight1;
					locUl.style.setProperty('--height', locHeight+'px');
				}
			});
		}
	}
	catch (err) {
		errorLog("loadHierarchy","Agency","NA",err.message);
	}
}
//Heirarchy for Agency ends here
//Agenency Settings for resume, suspend,terminate starts here
function getAgencyAction(action, itemId) {
	try {
		var setAction;
		switch(action) {
			case "Resume Agency" :
				setAction = { cr0e0_name: "Resume Agency " + Xrm.Page.getAttribute("msfsi_name").getValue(), cr0e0_action: agencyTaskAction.resumeAgency, cr0e0_agency:itemId};
				return setAction;
				break;
			case "Suspend Agency" :
				setAction = { cr0e0_name: "Suspension of " + Xrm.Page.getAttribute("msfsi_name").getValue(), cr0e0_action: agencyTaskAction.suspendAgency, cr0e0_agency:itemId};
				return setAction;
				break;
			case "Resume Location" :
				setAction = { cr0e0_name: "Resume Location",  cr0e0_action: agencyTaskAction.resumeLocation, cr0e0_agency:itemId };
				return setAction;
				break;
			case "Resume Producer" :
				setAction = { cr0e0_name: "Resume Producer" ,  cr0e0_action: agencyTaskAction.resumeProducer, cr0e0_agency:itemId };
				return setAction;
				break;
			case "Terminate Location" :
				setAction = { cr0e0_name: "Termination of Location ",  cr0e0_action: agencyTaskAction.terminateLocation, cr0e0_agency:itemId };
				return setAction;
				break;
			case "Terminate Producer" :
				setAction = { cr0e0_name: "Termination of Producer" ,  cr0e0_action: agencyTaskAction.terminateProducer, cr0e0_agency:itemId };
				return setAction;
				break;
		}
	}
	catch (err) {
		errorLog("getAgencyAction","Agency","NA",err.message);
	}
}
function agencySettings(context, action) {
	var id = context.entityReference.id;
	var itemId =id.substring(1, id.length-1);
	var thisAccount = {
		entityType: "msfsi_agency",
		id: itemId 
	};
	var callback = function (obj) {
		console.log("Created new " + obj.savedEntityReference.entityType + " named '" + obj.savedEntityReference.name + "' with id:" + obj.savedEntityReference.id);
	}
	//Call getAgencyAction
	var setName = new getAgencyAction(action, itemId);
	Xrm.Utility.openQuickCreate(agencyFields.agencyControl, thisAccount, setName).then(callback, function (error) {
		var errorObjXRM = JSON.parse(error.raw);
		var statusCode = JSON.parse(errorObjXRM.raw)._httpStatusCode;
		errorLog("agencySettings - result","Agency",statusCode,error.message);
	});
}
//Agenency Settings for resume, suspend,terminate ends here

//Agency Background Questions
function getFieldValues(xrm, formContext){
	try {
		window.Xrm = xrm;
		window._formContext = formContext;
		if(formContext.getAttribute(bgQuestions.misdemeanor).getValue()){
			document.getElementById("misdemeanorYes").checked=true;
		}	else {
			document.getElementById("misdemeanorNo").checked=true;
		}
		if (formContext.getAttribute(bgQuestions.felony).getValue() === bgQuestions.felonyYes) {
			document.getElementById("felonyYes").checked=true;
		} else if(formContext.getAttribute(bgQuestions.felony).getValue() === bgQuestions.felonyNo) {
			document.getElementById("felonyNo").checked=true;
		} else {
			document.getElementById("felonyNA").checked=true;
		}
		if (formContext.getAttribute(bgQuestions.felonyConviction).getValue() === bgQuestions.felonyYes) {
			document.getElementById("felonyConvictionYes").checked=true;
		} else if(formContext.getAttribute(bgQuestions.felonyConviction).getValue() === bgQuestions.felonyNo) {
			document.getElementById("felonyConvictionNo").checked=true;
		} else {
			document.getElementById("felonyConvictionNA").checked=true;
		}
		if (formContext.getAttribute(bgQuestions.consent).getValue() === bgQuestions.felonyYes) {
			document.getElementById("consentYes").checked=true;
		} else if(formContext.getAttribute(bgQuestions.consent).getValue() === bgQuestions.felonyNo) {
			document.getElementById("consentNo").checked=true;
		} else {
			document.getElementById("consentNA").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.militaryOffense).getValue()) {
			document.getElementById("militaryoffenseYes").checked=true;
		} else {
			document.getElementById("militaryoffenseNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.finra).getValue()) {
			document.getElementById("FINRAYes").checked=true;
		} else {
			document.getElementById("FINRANo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.notified).getValue()) {
			document.getElementById("NotifiedYes").checked=true;
		} else {
			document.getElementById("NotifiedNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.overdue).getValue()) {
			document.getElementById("OverdueYes").checked=true;
		} else {
			document.getElementById("OverdueNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.overdue).getValue()) {
			document.getElementById("OverdueYes").checked=true;
		} else {
			document.getElementById("OverdueNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.liable).getValue()){
			document.getElementById("LiableYes").checked=true;
		} else {
			document.getElementById("LiableNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.insured).getValue()) {
			document.getElementById("InsuredYes").checked=true;
		}
		else {
			document.getElementById("InsuredNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.jurisdiction).getValue()) { 
			document.getElementById("txtJurisdiction").value = formContext.getAttribute(bgQuestions.jurisdiction).getValue();
		} 
		else {
			document.getElementById("txtJurisdiction").value = "";
		}
	}
	catch (err) {
		errorLog("getFieldValues","Agency","NA",err.message);
	}
}

function saveChanges(xrm, formContext){
	if(document.getElementById("NotifiedYes").checked==true && document.getElementById("txtJurisdiction").value=="")
	{
		alert("Jurisdiction is required");
	}
	else
	{
		try {
			ajax_icon_handlingSave('load');
			window.Xrm = xrm;
			window._formContext = formContext;
			formContext.getAttribute(bgQuestions.misdemeanor).setValue(document.getElementById("misdemeanorYes").checked);
			if (document.getElementById("felonyYes").checked === true) {
				formContext.getAttribute(bgQuestions.felony).setValue(bgQuestions.felonyYes);
			}
			else if (document.getElementById("felonyNA").checked === true) {
				formContext.getAttribute(bgQuestions.felony).setValue(bgQuestions.felonyNA);
			}
			else {
				formContext.getAttribute(bgQuestions.felony).setValue(bgQuestions.felonyNo);
			}
			if (document.getElementById("felonyConvictionYes").checked === true) {
				formContext.getAttribute(bgQuestions.felonyConviction).setValue(bgQuestions.felonyYes);
			}
			else if (document.getElementById("felonyConvictionNA").checked === true) {
				formContext.getAttribute(bgQuestions.felonyConviction).setValue(bgQuestions.felonyNA);
			}
			else {
				formContext.getAttribute(bgQuestions.felonyConviction).setValue(bgQuestions.felonyNo);
			}
			if (document.getElementById("consentYes").checked === true) {
				formContext.getAttribute(bgQuestions.consent).setValue(bgQuestions.felonyYes);
			}
			else if (document.getElementById("consentNA").checked === true) {
				formContext.getAttribute(bgQuestions.consent).setValue(bgQuestions.felonyNA);
			}
			else {
				formContext.getAttribute(bgQuestions.consent).setValue(bgQuestions.felonyNo);
			}
			formContext.getAttribute(bgQuestions.militaryOffense).setValue(document.getElementById("militaryoffenseYes").checked);
			formContext.getAttribute(bgQuestions.finra).setValue(document.getElementById("FINRAYes").checked);
			formContext.getAttribute(bgQuestions.notified).setValue(document.getElementById("NotifiedYes").checked);
			formContext.getAttribute(bgQuestions.overdue).setValue(document.getElementById("OverdueYes").checked);
			formContext.getAttribute(bgQuestions.liable).setValue(document.getElementById("LiableYes").checked);
			formContext.getAttribute(bgQuestions.insured).setValue(document.getElementById("InsuredYes").checked);
			formContext.getAttribute(bgQuestions.jurisdiction).setValue(document.getElementById("txtJurisdiction").value);
			ajax_icon_handlingSave(true);
		}
		catch (err) {
			errorLog("saveChanges","Agency","NA",err.message);
		}
			
	}
}
