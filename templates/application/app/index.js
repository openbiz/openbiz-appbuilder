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