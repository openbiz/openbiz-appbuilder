/**
 * Openbiz App Backend Model
 *
 * APPBUILDER_ALLOW_OVERRIDE = YES  // if you have manual modified this file please change APPBUILDER_ALLOW_OVERRIDE value to NO
 */
"use strict";
module.exports = function(app)
{
    var mongoose = app.openbiz.mongoose;
    var features = {{MODEL_FEATURES}};
    var defaults = {{MODEL_META_DEFAULTS}};
    var schemaMeta = app.openbiz.ModelService.applyMetadata.call(app.openbiz,
        app.openbiz.MetadataParser.call(app.openbiz,__filename.replace(/\.js$/i,'.json')).schema
        ,features,defaults)
	{}
    var schema = new mongoose.Schema(schemaMeta,{
        collection: '{{MODEL_COLLECTION}}'
    });

    schema.features = features;
    {% for(var i=0;i<MODEL_ACTION_STATICS.length;i++){ var FUNCTION = MODEL_ACTION_STATICS[i]; %}
    //Auto generated function
    schema.statics.{{FUNCTION.name}}: function({{FUNCTION.parameters}}){
        {{FUNCTION.function}}
    };
    {% } %}
    {% for(var i=0;i<MODEL_ACTION_METHODS.length;i++){ var FUNCTION = MODEL_ACTION_METHODS[i]; %}
    //Auto generated function
    schema.methods.{{FUNCTION.name}}: function({{FUNCTION.parameters}}){
        {{FUNCTION.function}}
    };
    {% } %}
    return app.openbiz.db.model('{{APP_NAME}}.{{MODULE_NAME}}.{{MODEL_NAME}}', schema);
}