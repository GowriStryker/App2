sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZDEV/ZDEV_WRICEF_APPROVAL/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ZDEV.ZDEV_WRICEF_APPROVAL.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
		
		}
		/*,
		createContent: function() {
				//add master detail pages to split app container control
			var appMain = new sap.ui.view({
				id: "idAppMain",
				viewName: "ZDEV.ZDEV_WRICEF_APPROVAL.view.View1",
				type:"XML"
			});
			
			var osplitApp = appMain.byId("app") ;
			
				var oMaster = new sap.ui.view({
				id: "idster",
				viewName: "ZDEV.ZDEV_WRICEF_APPROVAL.view.masterView",
				type:"XML"
			});
			
			osplitApp.addmMa
			
		} */
	});
});