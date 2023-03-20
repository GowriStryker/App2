/*
*&*********************************************************************&*
*& File         : masterView.controller.js                             &*
*& Company      : Stryker Project Accelerate - R5 - MEDICAL            &*
*& Author       : Gowrinath                                            &*
*& Date         : 06/12/2022                                           &*
*& Title        : Approve/Reject WRICEF ID                             &*
*& FD #         : DEV.RPT.002                                          &*
*&*********************************************************************&*
*& DESCRIPTION  : Approve/Reject WRICEF ID masterView                  &*
*&*********************************************************************&*
*& H I S T O R Y       O F       R E V I S I O N S &                   &*
*&*********************************************************************&*
*& DATE        AUTHOR   DESCRIPTION OF CHANGE        Request #  Vers.  &*
*& 06/12/2022  GGUNDU   Initial RICEF                FI1K900236        &*
*&*********************************************************************&*

*/
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/Fragment"
], function (e, t, Filter, FilterOperator, Fragment) {
	"use strict";
	return e.extend("ZDEV.ZDEV_WRICEF_APPROVAL.controller.masterView", {
		onInit: function () {
			this.getView().byId("masterList").setBusy(true);
			// Begin of GGUNDU DEV.RPT.002 21.11.2022
			this.path = [];
			this.path.push('REL');
			this.path.push('STATUS');
			this.path.push('IS_APPROVAL');
			this.path.push('TECH_APPROVAL');
			this.path.push('TEAM');
			this.path.push('GRP');
			this.path.push('OBJTYP');
			this.path.push('TYPE');
			this.path.push('MW_COMPLEXITY');
			this.path.push('CR');
			this.path.push('RAID');
			this.path.push('NAME');
			this.path.push('SAP_COMPLEXITY');
			this.path.push('NON_SAP_COMPLEXITY');
			this.path.push('REFERENCE_WRICEF');
			this.path.push('BUSINESS_AREA');
			this.path.push('WRICEF_ID');
			this.path.push('REQUIREMENT_ID');
		
  
			var filterData = {
				"filters": [{
					"key": "STATUS",
					"text": "Status",
					"items": [{
						"key": "APPROVED",
						"text": "Approved"
					}, {
						"key": "REJECTED",
						"text": "Rejected"
					}, {
						"key": "PENDING",
						"text": "Pending",
						"selected":true
					}]
				}]
			};
			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(filterData);
			this.getView().setModel(oModel,"fModel");
				// End of GGUNDU DEV.RPT.002
		},
		onItemSelect: function (e) {
			var t = e.getParameter("listItem");
			var n = t.getBindingContextPath();
			var i = this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage");
			i.bindElement(n);
			this.getOwnerComponent()._splitAppControll.hideMaster()
		},

// Begin of GGUNDU DEV.RPT.002
		onSearch: function (e) {

			var pattern = e.getSource().getValue();
			var sFilter = [];
			for (var i = 0; i < this.path.length; i++) {
				var oFilter = new Filter(this.path[i], FilterOperator.Contains, pattern);
				sFilter.push(oFilter);
			}
			
			sFilter.push( new Filter('REQUEST_ID',FilterOperator.EQ,pattern));

			var filterMultiple = new Filter({
				filters: sFilter,
				and: false
			});

			var aFilter = [];
			aFilter.push(filterMultiple);
			var oList = this.getView().byId("masterList");
			oList.getBinding("items").filter(aFilter);
		},

		onFilter: function (e) {

			var oView = this.getView();
			if (!this.pDialog) {
				this.pDialog = Fragment.load({
					id: oView.getId(),
					name: "ZDEV.ZDEV_WRICEF_APPROVAL.fragments.filter",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}

			this.pDialog.then(function (oDialog) {
				oDialog.open();
			});
		},

		handleConfirm: function (e) {

			var aStatus = e.getParameters().filterItems;

			var mFilter = [];
			for (var i = 0; i < aStatus.length; i++) {
				var val = aStatus[i].getKey();
				var path = aStatus[i].getParent().getKey();
				var statusFilter = new Filter(path, FilterOperator.EQ, val);
				mFilter.push(statusFilter);
			}

			var oList = this.getView().byId("masterList");
			oList.getBinding("items").filter(mFilter);
		}
// End of GGUNDU DEV.RPT.002
	})
});