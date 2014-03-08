"use strict";
define([ 'i18n!./nls/locale'
    /*MODULE_PATH_LIST_START*/
    /*MODULE_PATH_LIST_END*/ ],
    function ( locale 
            /*MODULE_NAME_LIST_START*/
            /*MODULE_NAME_LIST_END*/
        ) {
        return openbiz.Application.extend({
            name: 'APP_NAME',
            appUrl: null,
            baseUrl: null,
            modules: {
                
            },
            init: function () {
                for (var i in this.modules) {
                    this.modules[i].init();
                }
            },
            locale: locale
        });
    });