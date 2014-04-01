/**
 *
 * Openbiz App Frontend Menu File
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 *
 */
"use strict";
define(['text!templates/menu/{{APP_NAME_LOWERCASE}}MenuView.html'],
    function(templateData){
        return openbiz.Menu.extend({
            app: '{{APP_NAME}}',
            el:'nav#menu ul.system-menu',
            menu: '{{APP_NAME_LOWERCASE}}-menu',
            menuRoot: 'nav#menu',
            menuPermission: '{{MENU_PERMISSION}}',
            menuACL: {{MENU_ACL_LIST}},
            initialize:function(){
                openbiz.Menu.prototype.initialize.call(this);
                this.template = _.template(templateData);
            }
        });
    }
);