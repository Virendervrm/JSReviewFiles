//Webresource new_validateAddressCount
function validateAddressCount(executionContext) {
	"use strict";
	Xrm.Page.ui.clearFormNotification('29');
  var formContext = executionContext.getFormContext(); // get formContext
  var formType = formContext.ui.getFormType();
  var recordCount = Xrm.Page.getControl("Subgrid_1").getGrid().getTotalRecordCount();
  if(formType === 2 && recordCount === 0 ) {
    Xrm.Page.ui.setFormNotification('Please enter atleast one Address', 'ERROR', '29');
    executionContext._eventArgs._preventDefault = true;
		return false;
	}
  return true;
}

//Webresource validateAddressTypeNew
function validateAddressTypeNew(executeContext){
  "use strict";
  Xrm.Page.ui.clearFormNotification('1');
  var producerType= executeContext._formContext.getAttribute("cr0e0_producertype").getValue();
}

//Webresource new_validateDOB
function validateDOB(executeContext) {
	"use strict";
	Xrm.Page.ui.clearFormNotification('8');
	var dob= executeContext._formContext.getAttribute("cr0e0_dateofbirth").getValue();
	var date1 = new Date(dob); 
	var date2 = new Date();
	var yearsDiff =  date2.getFullYear() - date1.getFullYear();
	if (yearsDiff <= 21) {    
		Xrm.Page.ui.setFormNotification('Producer Should be minimum 21 Years of age', 'ERROR', '8'); 
			executeContext._eventArgs._preventDefault = true
		return false;
	}  
	return true;
}

//Webresource  validateEmail
function validateEmail(email){
	"use strict";
	Xrm.Page.getControl(email).clearNotification()
	var formType = Xrm.Page.ui.getFormType();
	var mail = Xrm.Page.getAttribute(email).getValue();
	var mailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (mailExp.test(mail) === false ) {
		Xrm.Page.getControl(email).setNotification("Please enter correct email");
		return false;
	}
	Xrm.Page.ui.clearFormNotification('1');
	return true;
}

//Webresource  validateEmailForm
function validateEmailForm(executeContext){
	"use strict";
	Xrm.Page.ui.clearFormNotification('1');
	var email= executeContext._formContext.getAttribute("cr0e0_email").getValue();
	if (email !== null && email !== undefined) {
		var emailExp=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (emailExp.test(email) === false) {    
			Xrm.Page.ui.setFormNotification('Error! Invalid Email', 'ERROR', '1'); 
			executeContext._eventArgs._preventDefault = true
			return false;
		}  
		return true;
	}
}

//Webresource validatePhone
function validatePhone(executeContext){
	"use strict";
	Xrm.Page.ui.clearFormNotification('2');
	var num= executeContext._formContext.getAttribute("cr0e0_phonenumber").getValue();
	var phoneExp=/^[1-9]{1}[0-9]{9}$/;
  if (num !== null && num !== undefined) {
		if (phoneExp.test(num) === false) {    
			Xrm.Page.ui.setFormNotification('Error! Mobile number should be 10 digits', 'ERROR', '2'); 
      executeContext._eventArgs._preventDefault = true
    	return false;
    }  
    return true;
  }
}

//Webresource validateSsnValue
function validateSsnField(ssn) { 
	"use strict";
	Xrm.Page.getControl("cr0e0_ssn").clearNotification();
	var formType = Xrm.Page.ui.getFormType();
  var num = Xrm.Page.getAttribute("cr0e0_ssn").getValue();
	if(num !== undefined || num !== null){
  	var test=  num.replace(/(\d{3})(\d{2})(\d{4})/,"$1-$2-$3");
 		Xrm.Page.getAttribute("cr0e0_ssn").setValue(test);
    var mob = /^\d{3}-\d{2}-\d{4}$/;
    if (mob.test(test) === false) {
			Xrm.Page.getControl("cr0e0_ssn").setNotification("SSN format should be xxx-xx-xxxx");
			return false;
    }
    return true;
	}
}

//Webresource validateZip
function validateZip(executeContext) { 
  Xrm.Page.ui.clearFormNotification('10');
 	var zipCode= executeContext._formContext.getAttribute("cr0e0_zipcode").getValue();
	Xrm.Page.getControl("cr0e0_zipcode").clearNotification();
	//var zipCode = Xrm.Page.getAttribute("cr0e0_zipcode").getValue();
	var zipExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  if (zipExp.test(zipCode) == false) {
 		Xrm.Page.ui.setFormNotification('Error! Invalid Zipcode', 'ERROR', '10'); 
		executeContext._eventArgs._preventDefault = true
    return false;
  }
 	return true; 
}   

//Webresource validateZipcode
function validateZip(zip){ 
	"use strict";
	Xrm.Page.getControl(zip).clearNotification();
	var zipCode = Xrm.Page.getAttribute(zip).getValue();
	var zipExp= /(^\d{5}$)|(^\d{5}-\d{4}$)/;
	if (zipExp.test(zipCode) === false) {
		Xrm.Page.getControl(zip).setNotification("Invalid Zip code");
		return false;
	}
 return true;    
}