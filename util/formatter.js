sap.ui.define([], function () {
	"use strict";
	return {
		setText: function (e) {
			if (e === "PENDING") {
				return "Pending"
			} else if (e === "REJECTED") {
				return "Rejected"
			} else if (e === "APPROVED") {
				return "Approved"
			}
		},
		setStatus: function (e) {
			if (e === "PENDING") {
				return "Warning"
			} else if (e === "REJECTED") {
				return "Error"
			} else if (e === "APPROVED") {
				return "Success"
			}
		},
		setActive: function (e) {
			if (e === "PENDING") {
				return false
			} else {
				return true
			}
		},
		setVisible: function (e) {
			if (e === "INTERFACE") {
				return true
			} else {
				return false
			}
		},
		setEnabled: function (e) {
			if (e === "TECHNICAL" || e === "FUNCTIONAL") {
				return true
			} else {
				return false
			}
		},
		setVis: function (e) {
			if (e === "X") {
				return true
			} else {
				return false
			}
		}
	}
});