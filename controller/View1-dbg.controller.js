//APP 2 ROOT Controller
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageBox, Filter, FilterOperator, formatter) {
	"use strict";

	return Controller.extend("ZDEV.ZDEV_WRICEF_APPROVAL.controller.View1", {
	
		onInit: function () {

			

			var oDetail = new sap.ui.view({
				id: "detailView",
				viewName: "ZDEV.ZDEV_WRICEF_APPROVAL.view.detailView",
				type: "XML"
			});

			var oMaster = new sap.ui.view({
				id: "masterView",
				viewName: "ZDEV.ZDEV_WRICEF_APPROVAL.view.masterView",
				type: "XML"
			});

			this.getView().byId("app").addMasterPage(oMaster).addDetailPage(oDetail);


			this.valueHelpModel = this.getOwnerComponent().getModel("searchHelp");
			//Call Odata with parameter as current User
			var userId = sap.ushell.Container.getService("UserInfo").getId();
	
			this.valueHelpModel.read("/SUBMIT_REQUESTSet", {
				filters: [
					new Filter({
						path: "SERVICE_CALLER",
						operator: FilterOperator.EQ,
						value1: userId
					})
				],
				success: function (data) {
					if (data.results.length !== 0) {
						var newMod = new sap.ui.model.json.JSONModel(data);
						newMod.iSizeLimit = 99999;
						this.getView().setModel(newMod);

						//disable busy indicator of master list
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setBusy(false);

						//set first item as selected (by default nothing is selected)
						
						var ItemOne = this.getView().byId("app").getMasterPages()[0].byId("masterList").getItems()[0];

						this.getView().byId("app").getMasterPages()[0].byId("masterList").setSelectedItem(ItemOne);

						//set first item binding on detail page

						var sPath = this.getView().byId("app").getMasterPages()[0].byId("masterList").getItems()[0].getBindingContextPath();
						this.getView().byId("app").getDetailPages()[0].byId("dvPage").bindElement(sPath);

						//set detail view  detail section as visible = true now
					
						this.getView().byId("app").getDetailPages()[0].byId("wricefDetailForm").setVisible(true);
						
						//set footer buttons as enabled. Initially it is kept disabled
					//		this.getView().byId("app").getDetailPages()[0].byId("butApprove").setEnabled(true);
					//		this.getView().byId("app").getDetailPages()[0].byId("butReject").setEnabled(true);
					} else {
		this.getView().byId("app").getDetailPages()[0].byId("butApprove").setEnabled(false);
							this.getView().byId("app").getDetailPages()[0].byId("butReject").setEnabled(false);
						//disable busy indicator of master list
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setBusy(false);
						
						//set master list text as "no data"
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setNoDataText("no data");
					}
				}.bind(this),

				error: function (data) {
			
					MessageBox.error(data.message, {
						details: data.responseText
					});
				}.bind(this)
			});
//Set Global Variable
			this.getOwnerComponent()._splitAppControll = this.byId("app");
		}
	});
});