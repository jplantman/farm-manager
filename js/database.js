// Initialize the database
var Datastore = require('nedb');
exports.list = { // key is passed to Table as 'dbName' param
	cropDB: new Datastore({ filename: 'db/crops.db', autoload: true }),
	familyDB: new Datastore({ filename: 'db/families.db', autoload: true }),
	rowDB: new Datastore({ filename: 'db/rows.db', autoload: true }),
	gardenDB: new Datastore({ filename: 'db/gardens.db', autoload: true }),
	taskDB: new Datastore({ filename: 'db/tasks.db', autoload: true }),
	taskTypeDB: new Datastore({ filename: 'db/taskTypes.db', autoload: true }),
	workerDB: new Datastore({ filename: 'db/workers.db', autoload: true }),	
}

exports.datastore = { // stores updated data for each db
	family: null,
	crop: null, 
	row: null, 
	garden: null,
	task: null,
	taskType: null,
	worker: null
}

exports.refreshDatastore = function(callback){ // gets each database, then runs a callback
	for (let prop in db.datastore){ // set all dbs to null. when all become filled, run callback
		db.datastore[prop] = null;
	}
	for (let prop in db.datastore){ 
		db.getItems( db.list[prop+'DB'], (data)=>{
			db.datastore[prop] = data;
			
			if ( callback && dbsFilled() ){
				callback();
			}

		} );
	}
	
}

function dbsFilled(){
	for (let prop in db.datastore){ if (!db.datastore[prop]){ return false } }
	return true;
}

exports.addItem = function( db, item, callback ){
	db.insert(item, function(err, newItem) {
	    if (callback){ callback(newItem) }
	    	
	});
}
exports.getItems = function(db, callback, searchTerms){
	db.find( searchTerms, function(err, items){

		callback(items);

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

exports.deleteItems = function(db, arr, callback){
	db.remove({ $or: arr }, {multi: true}, callback);
}

exports.getItem = function(db, callback, searchTerms){
	db.findOne( searchTerms, function(err, item){

		callback(item);

	} );
}
