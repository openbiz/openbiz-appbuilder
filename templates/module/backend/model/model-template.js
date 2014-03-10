"use strict";
module.exports = function(app)
{
	var mongoose = app.openbiz.mongoose;
    var schema = new mongoose.Schema(@@MODEL_SCHEMA@@,{
        collection: '@@MODEL_COLLECTION@@'
    });

    return app.openbiz.db.model('@@APP_NAME@@.@@MODULE_NAME@@.@@MODEL_NAME@@', schema);
}