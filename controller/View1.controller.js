/*
*&*********************************************************************&*
*& File         : View1.controller.js                                  &*
*& Company      : Stryker Project Accelerate - R5 - MEDICAL            &*
*& Author       : Gowrinath                                            &*
*& Date         : 06/12/2022                                           &*
*& Title        : Approve/Reject WRICEF ID                             &*
*& FD #         : DEV.RPT.002                                          &*
*&*********************************************************************&*
*& DESCRIPTION  : Approve/Reject WRICEF ID View1                       &*
*&*********************************************************************&*
*& H I S T O R Y       O F       R E V I S I O N S &                   &*
*&*********************************************************************&*
*& DATE        AUTHOR   DESCRIPTION OF CHANGE        Request #  Vers.  &*
*& 06/12/2022  GGUNDU   Initial RICEF                FI1K900236        &*
*&*********************************************************************&*

*/

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/model/Filter", "sap/ui/model/FilterOperator"], function (e, t, s,
	i, a) {
	"use strict";
	return e.extend("ZDEV.ZDEV_WRICEF_APPROVAL.controller.View1", {
		onInit: function () {
			var e = new sap.ui.view({
				id: "detailView",
				viewName: "ZDEV.ZDEV_WRICEF_APPROVAL.view.detailView",
				type: "XML"
			});
			var a = new sap.ui.view({
				id: "masterView",
				viewName: "ZDEV.ZDEV_WRICEF_APPROVAL.view.masterView",
				type: "XML"
			});
			this.getView().byId("app").addMasterPage(a).addDetailPage(e);
			this.valueHelpModel = this.getOwnerComponent().getModel("searchHelp");
			var r = sap.ushell.Container.getService("UserInfo").getId();
			this.valueHelpModel.read("/SUBMIT_REQUESTSet", {
				filters: [new s({
					path: "SERVICE_CALLER",
					operator: i.EQ,
					value1: r
				})],
				success: function (e) {
					if (e.results.length !== 0) {
						var t = new sap.ui.model.json.JSONModel(e);
						t.iSizeLimit = 99999;
						this.getView().setModel(t);
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setBusy(false);
						var s = this.getView().byId("app").getMasterPages()[0].byId("masterList").getItems()[0];
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setSelectedItem(s);
						var i = this.getView().byId("app").getMasterPages()[0].byId("masterList").getItems()[0].getBindingContextPath();
						this.getView().byId("app").getDetailPages()[0].byId("dvPage").bindElement(i);
						this.getView().byId("app").getDetailPages()[0].byId("wricefDetailForm").setVisible(true)
					} else {
						this.getView().byId("app").getDetailPages()[0].byId("butApprove").setEnabled(false);
						this.getView().byId("app").getDetailPages()[0].byId("butReject").setEnabled(false);
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setBusy(false);
						this.getView().byId("app").getMasterPages()[0].byId("masterList").setNoDataText("no data")
					}
				}.bind(this),
				error: function (e) {
					t.error(e.message, {
						details: e.responseText
					})
				}.bind(this)
			});
			this.getOwnerComponent()._splitAppControll = this.byId("app")
		}
	})
});