"use strict";
function maskedSSN(context){
debugger;
	var ssn= context._formContext.getAttribute(producerFields.ssn).getValue();
	var maskedString="";
	for (var i = 0; i < ssn.length; i++) {
		if(i<5)
			maskedString+= '*';
		else
			maskedString+= ssn[i];   
	}
	context._formContext.getAttribute(producerFields.ssnMasked).setValue(maskedString);
}