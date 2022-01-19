function checkformtype(executionContext)
{
  "use strict";
  var formContext = executionContext.getFormContext(); // get formContext
  var formType = formContext.ui.getFormType();
  if(formType === 2) {
     formContext.getAttribute("cr0e0_ssn").controls.get(0).setVisible(false);
     formContext.getAttribute("cr0e0_ssnmasked").controls.get(0).setVisible(true);
     formContext.getAttribute("cr0e0_ssnmasked").controls.get(0).setDisabled(true);
    //formContext.getAttribute("cr0e0_producer").controls.get(0).setVisible(true);
    //formContext.getAttribute("cr0e0_producer").controls.get(0).setDisabled(true);
    //formContext.getAttribute("new_submit").controls.get(0).setVisible(true);
		if( formContext.getAttribute("cr0e0_niprstatus").getValue() === '523240001'){
			 formContext.getAttribute("new_submit").controls.get(0).setVisible(false);
		}
		else{
		 formContext.getAttribute("new_submit").controls.get(0).setVisible(true);
		}
	}
	else {
    formContext.getAttribute("cr0e0_ssnmasked").controls.get(0).setVisible(false); //Added by Divya
	  formContext.getAttribute("cr0e0_producer").controls.get(0).setVisible(false);
	  formContext.getAttribute("new_submit").controls.get(0).setVisible(false);
	}
}