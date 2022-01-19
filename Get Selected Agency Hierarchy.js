"use strict";
function getSelectedAgencyHierarchy(selectedItems){
	var selectedItem = [];
	var i; 
	for(i=0;  i<selectedItems.length;i++){
		selectedItem.push({"id":selectedItems[i].Id,"name":selectedItems[i].Name});
	}
    var data=selectedItem;
    var schemaName = "cr0e0_CreateAgencyHierarchyFile";
    var alertMessage = "Hierarchy file created successfully for the selected agencies";
	var uiContext = Xrm.Page;
	//Common function
    triggerCloudFlow(schemaName,data,alertMessage,uiContext);
}