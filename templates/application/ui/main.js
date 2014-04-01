/**
 *
 * Openbiz App Frontend Main Package File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 *
 */
"use strict";
define([ 'i18n!./nls/locale'
    /*MODULE_PATH_LIST*/ ],
    function ( locale 
            /*MODULE_NAME_LIST*/
        ) {
        return openbiz.Application.extend({
            name: '{{APP_NAME}}',
            appUrl  : REPLACE_APPURL,
            baseUrl : REPLACE_BASEURL,
            modules: { 
                /*MODULE_NAME_LIST_PAIRS*/
            },
            init: function () {
                for (var i in this.modules) {
                    this.modules[i].init();
                }
            },
            locale: locale
        });
    });