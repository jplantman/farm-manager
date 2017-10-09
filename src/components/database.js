console.log('initializing database...');
var Datastore = require('nedb');
let app = FarmManager || {};

app.dbs = {
	crops: new Datastore({ filename: './db/crops.db', autoload: true }),
	families: new Datastore({ filename: './db/families.db', autoload: true }),
	rows: new Datastore({ filename: './db/rows.db', autoload: true }),
	gardens: new Datastore({ filename: './db/gardens.db', autoload: true }),
	tasks: new Datastore({ filename: './db/tasks.db', autoload: true }),
	taskTypes: new Datastore({ filename: './db/taskTypes.db', autoload: true }),
	workers: new Datastore({ filename: './db/workers.db', autoload: true }),	
}

app.datastore = {};

app.refreshDatastore = function(callback){ // gets each database, then runs a callback
	for (let prop in app.dbs){ // set all dbs to null. when all become filled, run callback
		app.datastore[prop] = null;
	}

	for (let prop in app.datastore){ 
		app.dbs[prop].find( {}, (err, docs)=>{

			app.datastore[prop] = docs;

			if ( callback && dbsFilled() ){
				callback();
				return;
			}

		} );
	}
}

app.getByID = function(db, id){ // e.g. app.getByID('crops', 'QW1234ERT67')
	let database = app.datastore[db];
	let len = database.length;
	for (var i = 0; i < len; i++) {
		let obj = database[i];
		if ( obj._id == id ){
			return obj;
		}
	};
	console.log('ERROR', 'db: ', db, 'id:', id);
	throw 'getByID error';
}

function dbsFilled(){
	for (let prop in app.datastore){ if (!app.datastore[prop]){ return false } }
	return true;
}

app.updateMany = function(db, array, callback){ // array has one little array for each update, structured: [query, update]
	let numDocs = array.length;
	let numUpdated = 0;

	for (let i = 0; i < numDocs; i++) {
		let query = array[i][0];
		let update = array[i][1];
		app.dbs[db].update( query, { $set: update }, {}, ()=>{
			numUpdated++;
			let allUpdatesDone = numDocs == numUpdated;
			if ( allUpdatesDone ){
				app.refreshDatastore( ()=>{
					app.tables[db].output.render();
				} );
			}
		} );
	};
}

