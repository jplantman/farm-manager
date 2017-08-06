// const Table = require('../constructors/Table.js');

// let fields = [
// 	{ n: 'name', t: 'Task Name', c: 'edit-field', l:[1, 49]},
// 	{ n: 'cropID', t: 'Crop', c: 'id-ref' },
// 	{ n: 'length', t: 'Length'},
// 	{ n: 'notes', t: 'Notes'}
// ];


// const tasks = new Table(
// 	{
// 		dbName: "taskDB",
// 		tableTitle: "Tasks",
// 		tabPanelID: "task",
// 		tableDockSelector: "#tasks-table",
// 		fields: fields,

// 		// ADD FORM //

// 		addForm: {
// 			height: 450,
// 			selector: '#task-form',
// 			// forms are meant to be formatted in this way:
// 			HTML: '<p class="validate-tips">"Name" is required.</p>'+
// 				  '<form>'+
// 			        '<fieldset>'+
// 			          '<label for="name">Name: </label>'+
// 			          '<input type="text" name="name" class="text ui-widget-content ui-corner-all"><br/>'+

// 			          '<label for="cropID">Crop:  <small>(currently gtasking?)</small></label>'+
// 			          '<select name="cropID" class=" ui-widget-content ui-corner-all"></select><br/>'+

// 			          '<label for="length" class="mt">Length: </label>'+
// 			          '<input type="text" name="length" class="text ui-widget-content ui-corner-all"><br/>'+

// 			          '<label for="notes">Notes: </label>'+
// 			          '<input type="text" name="notes" class="text ui-widget-content ui-corner-all"><br/>'+
			          
// 			        '</fieldset>'+
// 			      '</form>',
// 			  beforeComplete: function(){
// 			  	// create cropID select menu
// 			  	db.getItems( db.dbList.cropDB, function(docs){
// 			  		if (docs.length === 0){ console.log('No crops added yet.'); return; }
// 			  		let html = '';
// 			  		for (var i = 0; i < docs.length; i++) {
// 			  			html += '<option val="'+docs[i]._id+'">'+docs[i].name+', '+docs[i].variety+'</option>';
// 			  		};
// 			  		$('#task-form [name="cropID"]').html(html);
// 			  	}, {});
// 			  },
// 		      // button set for add or edit form
// 		      btnSet: 'add',	
// 		      openBtnSelector: "#add-task"
// 		},
// 		editForm: {
// 			// EDIT FORM //

// 		      selector: '#task-edit-form',
// 		      HTML: 
// 		      	'<p class="validate-tips">"Name" is required.</p>'+
// 				  '<form>'+
// 			        '<fieldset>'+
// 			          '<label for="name">Name: </label>'+
// 			          '<input type="text" name="name" class="text ui-widget-content ui-corner-all"><br/>'+

// 			          '<label for="cropID">Crop:  <small>(currently gtasking?)</small></label>'+
// 			          '<select name="cropID" class=" ui-widget-content ui-corner-all"></select><br/>'+

// 			          '<label for="length" class="mt">Length: </label>'+
// 			          '<input type="text" name="length" class="text ui-widget-content ui-corner-all"><br/>'+

// 			          '<label for="notes">Notes: </label>'+
// 			          '<input type="text" name="notes" class="text ui-widget-content ui-corner-all"><br/>'+
			          
// 			        '</fieldset>'+
// 			      '</form>',
// 			   beforeComplete: function(){
// 			  	// create cropID select menu
// 			  	db.getItems( db.dbList.cropDB, function(docs){
// 			  		if (docs.length === 0){ console.log('No crops added yet.'); return; }
// 			  		let html = '';
// 			  		for (var i = 0; i < docs.length; i++) {
// 			  			html += '<option val="'+docs[i]._id+'">'+docs[i].name+', '+docs[i].variety+'</option>';
// 			  		};
// 			  		$('#task-edit-form [name="cropID"]').html(html);
// 			  	}, {});
// 			  },   
// 			   // button set for add or edit form
// 		      btnSet: 'edit'
// 		},

// 	    // SEARCH //
// 	    searchRadioSelector: "task-radio-1",
// 	    searchFormHTML: // search bar and btn MUST have class 'search-bar' and 'search-btn'
// 	        '<input class="search-bar" placeholder="search tasks for..." />'+
// 	        '<span class="ui-button search-btn">search</span>'+

// 	        '<fieldset>'+
// 	          '<legend>Search By:</legend>'+
// 	          // data-tag must == field name
// 	          '<label for="task-radio-1">Any Field</label>'+ 
// 	          '<input type="radio" name="task-radio-1" id="task-radio-1" data-tag="allFields" checked="checked">'+
// 	          '<label for="task-radio-2">Name</label>'+
// 	          '<input type="radio" name="task-radio-1" id="task-radio-2" data-tag="name">'+
// 	          '<label for="task-radio-3">Crop</label>'+
// 	          '<input type="radio" name="task-radio-1" id="task-radio-3" data-tag="cropID">'+
// 	          '<label for="task-radio-4">Length</label>'+
// 	          '<input type="radio" name="task-radio-1" id="task-radio-4" data-tag="length">'+
// 	          // '<label for="task-radio-5">Spacing</label>'+
// 	          // '<input type="radio" name="task-radio-1" id="task-radio-5" data-tag="spacing">'+
// 	          // '<label for="task-radio-6">D.T.M.</label>'+
// 	          // '<input type="radio" name="task-radio-1" id="task-radio-6" data-tag="dtm">'+
// 	          '<label for="task-radio-7">Notes</label>'+
// 	          '<input type="radio" name="task-radio-1" id="task-radio-7" data-tag="notes">'+
// 	        '</fieldset>'
// 	}
// );

