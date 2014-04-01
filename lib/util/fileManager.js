'use strict';
var fs = require("fs");

module.exports = {
	isAllowedOverride:function(file){		
		if( fs.existsSync(file) && fs.readFileSync(file,'UTF-8').match(/APPBUILDER_ALLOW_OVERRIDE\s=\sYES/ig) ===null){			
			return false;
		}		
		return true;
	}
}