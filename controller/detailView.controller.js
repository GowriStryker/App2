/*
*&***********************************************************************************&*
*& File         : detailView.controller.js                                           &*
*& Company      : Stryker Project Accelerate - R5 - MEDICAL                          &*
*& Author       : Gowrinath                                         			     &*
*& Date         : 06/12/2022                                        				 &*
*& Title        : Approve/Reject WRICEF ID                          				 &*
*& FD #         : DEV.RPT.002                                       				 &*
*&***********************************************************************************&*
*& DESCRIPTION  : Approve/Reject WRICEF ID detailView                                &*
*&***********************************************************************************&*
*& H I S T O R Y       O F       R E V I S I O N S &                                 &*
*&***********************************************************************************&*
*& DATE        AUTHOR   DESCRIPTION OF CHANGE                      Request #  Vers.  &*
*& 06/12/2022  GGUNDU   Initial RICEF                              FI1K900236        &*
*& 08/03/2023  GGUNDU   When last record is approved/rejected      FI1K900236        &*
*&                      code iis failing. Fixed it                                   &*
*&***********************************************************************************&*

*/
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/DialogType", "sap/m/MessageBox", "sap/m/Dialog",
	"ZDEV/ZDEV_WRICEF_APPROVAL/util/formatter", "sap/m/Label", "sap/m/TextArea", "sap/m/Button", "sap/m/ButtonType", "sap/m/MessageToast",
	"sap/ui/model/Filter", "sap/ui/model/FilterOperator",
	"sap/ui/model/odata/v2/ODataModel", "sap/ui/model/json/JSONModel" /* GGUNDU*/
], function (e, t, s, i, a, n, r, o, g, l, u, d, ODataModel, jModel /* GGUNDU*/ ) {
	"use strict";
	return e.extend("ZDEV.ZDEV_WRICEF_APPROVAL.controller.detailView", {
		formats: a,
		onInit: function () {
			/* Begin of GGUNDU DEV.RPT.002 21.11.2022*/
			this.ODataModel = this.getOwnerComponent().getModel("searchHelp");
			this.ODataModel.read("/APPROVERSet", {
				success: function (data) {
					for (var i = 0; i < data.results.length; i++) {
						if (data.results[i].OWNERSHIP === "TECHNICAL") {

							if (this.Approvers != undefined) {
								this.Approvers = this.Approvers + "," + data.results[i].NAME;
							} else {
								this.Approvers = data.results[i].NAME;
							}
						}
					}
				}.bind(this)
			});
			/* End of GGUNDU DEV.RPT.002*/
		},
		onPress: function (e) {
			if (e.getSource().getTitle().includes("Tech")) {
				var t = e.getSource().getParent().getParent().getParent().byId("techName").getText();
				if (t === "") {
					t = "Technical Team"
				}
				var i = e.getSource().getParent().getParent().getParent().byId("techDate").getText();
				var a = e.getSource().getParent().getParent().getParent().byId("techReason").getText();
			} else {
				t = e.getSource().getParent().getParent().getParent().byId("isApprover").getValue();
				i = e.getSource().getParent().getParent().getParent().byId("isDate").getText();
				a = e.getSource().getParent().getParent().getParent().byId("funcReason").getText()
			}
			var n = e.getSource().getText();
			//Begin of GGUNDU DEV.RPT.002
			if (t === "Technical Team") {
				t = t + '\n' + this.Approvers + '\n';
			}
			//End of GGUNDU DEV.RPT.002
			var r = n + " by " + t + " on " + i;
			if (n === "Rejected") {
				r = n + " by " + t + " on " + i + ". Rejection Reason : " + a
			}
			if (n === "Pending") {
				r = n + " with " + t
			}

			s.show(r, {
				icon: s.Icon.INFORMATION,
				title: "Information",
				actions: [s.Action.OK],
				emphasizedAction: s.Action.OK,
				onClose: function (e) {}
			})
		},
		onReject: function (e) {
			if (!this.oSubmitDialog) {
				this.oSubmitDialog = new i("ddlog", {
					type: t.Message,
					resizable: true,
					title: "Confirm",
					content: [new n({
						text: "Do you want to Reject this WRICEF creation Request?",
						labelFor: "submissionNote"
					}), new r("rejectionReason", {
						width: "80%",
						placeholder: "Enter rejection reason (required)",
						liveChange: function (e) {
							var t = e.getParameter("value");
							this.oSubmitDialog.getBeginButton().setEnabled(t.length > 0)
						}.bind(this)
					})],
					beginButton: new o({
						type: g.Emphasized,
						text: "Confirm",
						enabled: false,
						press: function (e) {
							var t = {};
							t.REQUEST_ID = JSON.parse(this.getView().byId("request_Id").getProperty("text"));
							var i = this.getView().byId("servCaller").getProperty("text");
							if (i === "TECHNICAL") {
								t.TECH_REJECTION_REASON = e.getSource().getParent().getContent()[1].getProperty("value")
							} else if (i === "FUNCTIONAL") {
								t.IS_REJECTION_REASON = e.getSource().getParent().getContent()[1].getProperty("value")
							} else if (i === "MIDDLEWARE") {
								t.MW_REJECTION_REASON = e.getSource().getParent().getContent()[1].getProperty("value")
							}
							t.SERVICE_CALLER = sap.ushell.Container.getUser().getId();
							t.APP_NUM = 2;
							this.bDialog = new sap.m.BusyDialog;
							this.bDialog.open();
							this.valueHelpModel = this.getOwnerComponent().getModel("searchHelp");
							this.valueHelpModel.create("/SUBMIT_REQUESTSet", t, {
								success: function (e) {
									var t = sap.ushell.Container.getService("UserInfo").getId();
									this.valueHelpModel.read("/SUBMIT_REQUESTSet", {
										filters: [new u({
											path: "SERVICE_CALLER",
											operator: d.EQ,
											value1: t
										})],
										success: function (e) {
											var t = new sap.ui.model.json.JSONModel(e);
											t.iSizeLimit = 99999;
											this.getView().getParent().getParent().setModel(t);
											this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").updateBindings();
											if (e.results.length !== 0) {
												var i = this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems()[0];
												this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setSelectedItem(i);
												//Begin of GGUNDU 08/03/2023
/*							             	var a = this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems()[0].getBindingContextPath();
											this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage").bindElement(a)*/
												if (this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems().length >= 1) {
													var a = this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems()[0].getBindingContextPath();
													this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage").bindElement(a);
												} else {
			                                       this.getView().byId("wricefDetailForm").setVisible(false);
													this.getView().byId("butApprove").setEnabled(false);
													this.getView().byId("butReject").setEnabled(false);
													this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setBusy(false);
													this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setNoDataText("no data")
                                                    this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage").bindElement('');
												}
												//End of GGUNDU 08/03/2023			
											}
											this.bDialog.close();
											s.success("Thanks for your response! An E-mail has been sent to Requestor with rejection reason.");
											if (e.results.length == 0) {
												this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setNoDataText("no data")
											}
										}.bind(this),
										error: function (e) {
											this.bDialog.close()
										}.bind(this)
									})
								}.bind(this),
								error: function (e) {
									this.bDialog.close();
									s.error(e.message, {
										details: e.responseText
									})
								}.bind(this)
							});
							this.odata = {};
							this.oSubmitDialog.close();
							e.getSource().getParent().getContent()[1].setValue("")
						}.bind(this)
					}),
					endButton: new o({
						text: "Cancel",
						press: function (e) {
							this.oSubmitDialog.close();
							e.getSource().getParent().getContent()[1].setValue("")
						}.bind(this)
					})
				})
			}
			this.oSubmitDialog.open()
		},
		onApprove: function (e) {
			var t = this.getView().byId("request_Id").getProperty("text");
			var i = "Approve Request " + t + " ? ";
			s.confirm(i, {
				actions: [s.Action.YES, s.Action.CANCEL],
				emphasizedAction: s.Action.YES,
				onClose: function (e) {
					if (e === "YES") {
						this.bDialog = new sap.m.BusyDialog;
						this.bDialog.open();
						var t = {};
						t.REQUEST_ID = JSON.parse(this.getView().byId("request_Id").getProperty("text"));
						t.SERVICE_CALLER = sap.ushell.Container.getUser().getId();
						t.APP_NUM = 2;
						t.CR = this.getView().byId("crNumber").getValue();
						t.RAID = this.getView().byId("raidNumber").getValue();
						t.SRCSYS = this.getView().byId("sourceSystem").getValue();
						t.TARGET_SYSTEM = this.getView().byId("targetSystem").getValue();
						t.BPO = this.getView().byId("bpo").getValue();
						t.MW_PATTERN = this.getView().byId("mwPattern").getValue();
						t.DELIVERY_NOTES = this.getView().byId("deliveryNotes").getValue();
						this.valueHelpModel = this.getOwnerComponent().getModel("searchHelp");
						this.valueHelpModel.create("/SUBMIT_REQUESTSet", t, {
							success: function (e) {
								var t = sap.ushell.Container.getService("UserInfo").getId();
								this.valueHelpModel.read("/SUBMIT_REQUESTSet", {
									filters: [new u({
										path: "SERVICE_CALLER",
										operator: d.EQ,
										value1: t
									})],
									success: function (e) {
										var t = new sap.ui.model.json.JSONModel(e);
										t.iSizeLimit = 99999;
										this.getView().getParent().getParent().setModel(t);
										this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").updateBindings();
										if (e.results.length !== 0) {
											var i = this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems()[0];
											this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setSelectedItem(i);

												//Begin of GGUNDU 08/03/2023
/*							             	var a = this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems()[0].getBindingContextPath();
											this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage").bindElement(a)*/
												if (this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems().length >= 1) {
													var a = this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").getItems()[0].getBindingContextPath();
													this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage").bindElement(a);
												} else {
			                                       this.getView().byId("wricefDetailForm").setVisible(false);
													this.getView().byId("butApprove").setEnabled(false);
													this.getView().byId("butReject").setEnabled(false);
													this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setBusy(false);
													this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setNoDataText("no data")
                                                    this.getView().getParent().getParent().getDetailPages()[0].byId("dvPage").bindElement('');
												}
												//End of GGUNDU 08/03/2023											
										}
										this.bDialog.close();
										s.success("Thanks for your response! An E-mail has been sent to requestor with update");
										if (e.results.length == 0) {
											this.getView().getParent().getParent().getMasterPages()[0].byId("masterList").setNoDataText("no data")
										}
									}.bind(this),
									error: function (e) {
										this.bDialog.close();
										s.error(e.message, {
											details: e.responseText
										})
									}.bind(this)
								})
							}.bind(this),
							error: function (e) {
								this.bDialog.close();
								s.error(e.message, {
									details: e.responseText
								})
							}.bind(this)
						})
					}
				}.bind(this)
			})
		}
	})
});