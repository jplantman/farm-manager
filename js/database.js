console.log('initializing database...');
var Datastore = require('nedb');
let app = FarmManager || {};

app.dbs = {
	crops: new Datastore({ filename: 'db/crops.db', autoload: true }),
	families: new Datastore({ filename: 'db/families.db', autoload: true }),
	rows: new Datastore({ filename: 'db/rows.db', autoload: true }),
	gardens: new Datastore({ filename: 'db/gardens.db', autoload: true }),
	tasks: new Datastore({ filename: 'db/tasks.db', autoload: true }),
	taskTypes: new Datastore({ filename: 'db/taskTypes.db', autoload: true }),
	workers: new Datastore({ filename: 'db/workers.db', autoload: true }),	
}

app.datastore = {};
console.log('app:', app);

app.refreshDatastore = function(callback){ // gets each database, then runs a callback
	for (let prop in app.dbs){ // set all dbs to null. when all become filled, run callback
		app.datastore[prop] = null;
	}
	for (let prop in db.datastore){ 
		app.dbs[prop].find( {}, ()=>{

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

// exports.addItem = function( db, item, callback ){
// 	db.insert(item, function(err, newItem) {
// 	    if (callback){ callback(newItem) }
	    	
// 	});
// }
// exports.getItems = function(db, callback, searchTerms){
// 	db.find( searchTerms, function(err, items){

// 		callback(items);

// 	} );
// }

// exports.updateItem = function( db, query, update, options, callback ){
// 	db.update(query, update, options, function(err, updatedItem) {

// 	    if (callback){ callback(updatedItem) }
	    	
// 	});
// }

// exports.deleteItem = function(db, id, callback){
// 	db.remove({_id: id}, {}, callback);
// }

// exports.deleteItems = function(db, arr, callback){
// 	db.remove({ $or: arr }, {multi: true}, callback);
// }

// exports.getItem = function(db, callback, searchTerms){
// 	db.findOne( searchTerms, function(err, item){

// 		callback(item);

// 	} );
// }
