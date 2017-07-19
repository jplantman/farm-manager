// Initialize the database
var Datastore = require('nedb');
exports.dbList = { // key is passed to Table as 'dbName' param
	cropDB: new Datastore({ filename: 'db/crops.db', autoload: true }),
	rowDB: new Datastore({ filename: 'db/rows.db', autoload: true }),
	taskDB: new Datastore({ filename: 'db/tasks.db', autoload: true }),
	familyDB: new Datastore({ filename: 'db/families.db', autoload: true })
}

exports.addItem = function( db, crop, callback ){
	db.insert(crop, function(err, newCrop) {

	    if (callback){ callback(newCrop) }
	    	
	});
}
exports.getItems = function(db, callback, searchTerms){
	db.find( searchTerms, function(err, crops){

		callback(crops);

	} );
}

exports.updateItem = function( db, query, update, options, callback ){
	db.update(query, update, options, function(err, updatedItem) {

	    if (callback){ callback(updatedItem) }
	    	
	});
}

exports.deleteItem = function(db, id, callback){
	db.remove({_id: id}, {}, callback);
}

exports.getItem = function(db, callback, searchTerms){
	db.findOne( searchTerms, function(err, item){

		callback(item);

	} );
}

// exports.addCrop = function( crop, callback ){
// 	cropDB.insert(crop, function(err, newCrop) {

// 	    if (callback){ callback(newCrop) }
	    	
// 	});
// }

// exports.updateCrop = function( query, update, options, callback ){
// 	cropDB.update(query, update, options, function(err, updatedCrop) {

// 	    if (callback){ callback(updatedCrop) }
	    	
// 	});
// }

// exports.getCrops = function(callback, searchTerms){
// 	cropDB.find( searchTerms, function(err, crops){

// 		callback(crops);

// 	} );
// }

// exports.getCrop = function(callback, searchTerms){
// 	cropDB.findOne( searchTerms, function(err, crop){

// 		callback(crop);

// 	} );
// }

// exports.deleteCrop = function(id, callback){
// 	cropDB.remove({_id: id}, {}, callback);
// }

 

