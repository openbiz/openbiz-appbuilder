"use strict";
module.exports = function(app)
{
    var mongoose = app.openbiz.mongoose;
    var schema = new mongoose.Schema(
    app.openbiz.MetadataParser.call(app.openbiz,__filename.replace(/\.js$/i,'.json')),
    {
        collection: '{{MODEL_COLLECTION}}'
    });
    {% for(var i=0;i<MODEL_ACTION_STATICS.length;i++){ var ACTION = MODEL_ACTION_STATICS[i]; %}
    //Auto generated function
    schema.statics.{{ACTION}}: function(){
        
    };
    {% } %}
    {% for(var i=0;i<MODEL_ACTION_METHODS.length;i++){ var ACTION = MODEL_ACTION_METHODS[i]; %}
    //Auto generated function
    schema.methods.{{ACTION}}: function(){
        
    };
    {% } %}
    return app.openbiz.db.model('{{APP_NAME}}.{{MODULE_NAME}}.{{MODEL_NAME}}', schema);
}