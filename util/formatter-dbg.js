sap.ui.define([], function () {
		'use strict';
		return {
			setText: function (object) {
	
					if ( object === "PENDING") {
						return "Pending";
					}else if( object === "REJECTED" ){
						return "Rejected";
					}else if( object === "APPROVED" ){
						return "Approved";
					}
				
			},
			setStatus: function(object){
				
					if ( object === "PENDING") {
						return "Warning";
					}else if( object === "REJECTED"){
						return "Error";
					}else if( object === "APPROVED"){
						return "Success";
					}
			},
			setActive: function(object){
				if( object === "PENDING" ){
					return false;
				}else{
					return true;
				}
			},
			setVisible: function(object){
				if( object === "INTERFACE" ){
					return true;
				}else{
					return false;
				}
				
			},
			setEnabled: function(object){

					if( object === "TECHNICAL" || object === "FUNCTIONAL" ){
					return true;
				}else{
					return false;
				}
			}
			,
			setVis : function(object){

					if( object === "X" ){
					return true;
				}else{
					return false;
				}
			}
		};
	}
);