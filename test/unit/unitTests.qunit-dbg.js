/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZDEV/ZDEV_WRICEF_APPROVAL/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});