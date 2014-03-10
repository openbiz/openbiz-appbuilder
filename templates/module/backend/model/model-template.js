"use strict";
module.exports = function(app)
{
	var mongoose = app.openbiz.mongoose;
    var schema = new mongoose.Schema(@@MODEL_SCHEMA@@,{
        collection: '@@MODEL_COLLECTION@@'
    });

    //sample for add static method
    /// schema.statics.methodName = function(parameter1,parameter2){}

    //sample for add dynamic method
	/// schema.methods.methodName = function(parameter1,parameter2){}

    return app.openbiz.db.model('@@APP_NAME@@.@@MODULE_NAME@@.@@MODEL_NAME@@', schema);
}