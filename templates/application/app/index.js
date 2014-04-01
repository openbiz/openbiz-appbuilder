/**
 * Openbiz App Backend entry point
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 * @type {exports|*}
 */
"use strict";
var path = require('path');
module.exports = function(openbiz)
{
    if(typeof openbiz != 'object') return null;
    var application = new openbiz.Application({
        _context : openbiz.context,
        _name : path.basename(path.dirname(__dirname)),
        _path : __dirname,
        _ui : path.join(path.dirname(__dirname),'ui'),
        openbiz: openbiz,
        defaults:{
        	creatorRoles:{{DEFAULT_ROLES}}
        }
    });
    return application;
};