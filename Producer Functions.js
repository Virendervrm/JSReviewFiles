"use strict";
//Call on-load of producer custom form
var context;
function form_onload(executionContext, webresourceName){
	try {
		var formContext = executionContext.getFormContext();
		saveFormChanges(formContext, webresourceName, 'btnSave'); //Common function
		checkformtype(executionContext);
		context = executionContext;
	}
	catch (err) {
		errorLog("form_onload","Producer","NA",err.message);
	}
}

//On load hide and show of ssnmasked and npn based on formtype is edit or new.
function checkformtype(context) {
	var formContext = context.getFormContext(); // get formContext
	var formType = formContext.ui.getFormType();
	//when formtype is edit
	if(formType === formTypeValue.edit) {
 		formContext.getAttribute(producerFields.npn).controls.get(0).setDisabled(true);
		formContext.getAttribute(fields.ssnMasked).controls.get(0).setVisible(true);
		formContext.getAttribute(fields.ssnMasked).controls.get(0).setDisabled(true);
		formContext.getAttribute(producerFields.onboardingStatus).controls.get(0).setVisible(true);
		formContext.getAttribute(producerFields.onboardingStatus).controls.get(0).setDisabled(true);
	} else {
		formContext.getAttribute(fields.ssnMasked).controls.get(0).setVisible(false);
		formContext.getAttribute(producerFields.onboardingStatus).controls.get(0).setVisible(false);
	}
}

function maskedSSN(context){
	var ssn= context._formContext.getAttribute(fields.ssn).getValue();
	var maskedString="";
	for (var i = 0; i < ssn.length; i++) {
		if(i<5)
			maskedString+= '*';
		else
			maskedString+= ssn[i];   
	}
	context._formContext.getAttribute(fields.ssnMasked).setValue(maskedString);
}

//On click 'Create Contract' button - Producer form ribbon
function callContractFlow(context){
	try {
		var queryString = Xrm.Utility.getGlobalContext().getQueryStringParameters().id;
		var itemId = queryString .substring(1, queryString .length-1);
		var data = {"id" : itemId};
		var schemaName = environmentVarName.createContract;
		var alertMessage = cnfAlertMessage.createContract;
		triggerCloudFlow(schemaName, data, alertMessage, false); //Common function
	}
	catch (err) {
		errorLog("callContractFlow","Producer","NA",err.message);
	}
}

//Used in Background Questions webresource
function getFieldValues(xrm, formContext){
	try {
		window.Xrm = xrm;
		window._formContext = formContext;

		if(formContext.getAttribute(bgQuestions.misdemeanor).getValue()){
			document.getElementById("misdemeanorYes").checked=true;
		} else {
			document.getElementById("misdemeanorNo").checked=true;
		} 
		if(formContext.getAttribute(bgQuestions.felony).getValue() === bgQuestions.felonyYes){
			document.getElementById("felonyYes").checked=true;
		}
		else if(formContext.getAttribute(bgQuestions.felony).getValue() === bgQuestions.felonyNo){
			document.getElementById("felonyNo").checked=true;
		}
		else {
			document.getElementById("felonyNA").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.felonyConviction).getValue() === bgQuestions.felonyYes){
			document.getElementById("felonyConvictionYes").checked=true;
		}
		else if(formContext.getAttribute(bgQuestions.felonyConviction).getValue() === bgQuestions.felonyNo){
			document.getElementById("felonyConvictionNo").checked=true;
		}
		else {
			document.getElementById("felonyConvictionNA").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.consent).getValue() === bgQuestions.felonyYes){
			document.getElementById("consentYes").checked=true;
		}
		else if(formContext.getAttribute(bgQuestions.consent).getValue() === bgQuestions.felonyNo){
			document.getElementById("consentNo").checked=true;
		}
		else {
			document.getElementById("consentNA").checked=true;
		}
		debugger;
		if(formContext.getAttribute(bgQuestions.militaryOffense).getValue()){
			document.getElementById("militaryoffenseYes").checked=true;
		}
		else{
			document.getElementById("militaryoffenseNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.finra).getValue()){
			document.getElementById("FINRAYes").checked=true;
		}
		else{
			document.getElementById("FINRANo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.bankruptcy).getValue()){
			document.getElementById("bankruptcyYes").checked=true;
		}
		else{
			document.getElementById("bankruptcyNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.jurisdiction).getValue()){
			document.getElementById("jurisdictionYes").checked=true;
		}
		else{
			document.getElementById("jurisdictionNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.liable).getValue()){
			document.getElementById("liableYes").checked=true;
		}
		else{
			document.getElementById("liableNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.misconduct).getValue()){
			document.getElementById("misconductYes").checked=true;
		}
		else{
			document.getElementById("misconductNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.arrearage).getValue()){
			document.getElementById("arrearageYes").checked=true;
		}
		else{
			document.getElementById("arrearageNo").checked=true;
		}
		 if(formContext.getAttribute(bgQuestions.identifyJurisdiction).getValue()){ 
			document.getElementById("jurisdictionName").value = formContext.getAttribute(bgQuestions.identifyJurisdiction).getValue();
		} 
		else{
			document.getElementById("jurisdictionName").value = "";
		}
		if(formContext.getAttribute(bgQuestions.repayment).getValue()){
			document.getElementById("repaymentYes").checked=true;
		}
		else{
			document.getElementById("repaymentNo").checked=true;
		}
		if(formContext.getAttribute(bgQuestions.subpoena).getValue()){
			document.getElementById("subpoenaYes").checked=true;
		}
		else{
			document.getElementById("subpoenaNo").checked=true;
		}
		 if(formContext.getAttribute(bgQuestions.arrearageMonths).getValue()){ 
			document.getElementById("arrearageMonths").value = formContext.getAttribute(bgQuestions.arrearageMonths).getValue();
		} 
		else{
			document.getElementById("arrearageMonths").value = "";
		}
	}
	catch (err) {
		errorLog("getFieldValues","Producer","NA",err.message);
	}
}

function saveChanges(xrm, formContext){
var errormes="";
if(document.getElementById("jurisdictionYes").checked==true && document.getElementById("jurisdictionName").value=="")
{
errormes="Jurisdiction is required";

}
if(document.getElementById("arrearageYes").checked==true && document.getElementById("arrearageMonths").value=="")
{
if(errormes!="")
{
errormes="Jurisdiction  and arrearage Months are required";
}
else
{
errormes="arrearage Months is required";
}

}
if(errormes!="")
{
alert(errormes);
}

else
{
	try {
		ajax_icon_handlingSave('load');
		window.Xrm = xrm;
		window._formContext = formContext;
		formContext.getAttribute(bgQuestions.misdemeanor).setValue(document.getElementById("misdemeanorYes").checked);
		if(document.getElementById("felonyYes").checked === true){
			formContext.getAttribute(bgQuestions.felony).setValue(bgQuestions.felonyYes);
		}
		else if(document.getElementById("felonyNA").checked === true){
			formContext.getAttribute(bgQuestions.felony).setValue(bgQuestions.felonyNA);
		}
		else{
			formContext.getAttribute(bgQuestions.felony).setValue(bgQuestions.felonyNo);
		}

		if(document.getElementById("felonyConvictionYes").checked === true){
			formContext.getAttribute(bgQuestions.felonyConviction).setValue(bgQuestions.felonyYes);
		}
		else if(document.getElementById("felonyConvictionNA").checked === true){
			formContext.getAttribute(bgQuestions.felonyConviction).setValue(bgQuestions.felonyNA);
		}
		else{
			formContext.getAttribute(bgQuestions.felonyConviction).setValue(bgQuestions.felonyNo);
		}

		if(document.getElementById("consentYes").checked === true){
			formContext.getAttribute(bgQuestions.consent).setValue(bgQuestions.felonyYes);
		}
		else if(document.getElementById("consentNA").checked === true){
			formContext.getAttribute(bgQuestions.consent).setValue(bgQuestions.felonyNA);
		}
		else{
			formContext.getAttribute(bgQuestions.consent).setValue(bgQuestions.felonyNo);
		}
		formContext.getAttribute(bgQuestions.militaryOffense).setValue(document.getElementById("militaryoffenseYes").checked);
		formContext.getAttribute(bgQuestions.finra).setValue(document.getElementById("FINRAYes").checked);
		
		formContext.getAttribute(bgQuestions.bankruptcy).setValue(document.getElementById("bankruptcyYes").checked);
		formContext.getAttribute(bgQuestions.jurisdiction).setValue(document.getElementById("jurisdictionYes").checked);
		formContext.getAttribute(bgQuestions.liable).setValue(document.getElementById("liableYes").checked);
		formContext.getAttribute(bgQuestions.misconduct).setValue(document.getElementById("misconductYes").checked);
		formContext.getAttribute(bgQuestions.arrearage).setValue(document.getElementById("arrearageYes").checked);
		
		formContext.getAttribute(bgQuestions.identifyJurisdiction).setValue(document.getElementById("jurisdictionName").value);
		
		formContext.getAttribute(bgQuestions.repayment).setValue(document.getElementById("repaymentYes").checked);
		formContext.getAttribute(bgQuestions.subpoena).setValue(document.getElementById("subpoenaYes").checked);
		if(document.getElementById("arrearageMonths").value.length !== 0) {
			formContext.getAttribute(bgQuestions.arrearageMonths).setValue(document.getElementById("arrearageMonths").value);
		}
		ajax_icon_handling(true);
	}
	catch (err) {
		errorLog("saveChanges","Producer","NA",err.message);
	}
}
}