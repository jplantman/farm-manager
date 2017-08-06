"use strict"

// Main Table Obj
const tasks = {};

// Store Common Things into Variables //
tasks.title = "Task";
tasks.name = "task";
tasks.tabElem = $('[href="#task"]');
tasks.panelID = "#task";
tasks.panelElem = $('#task');
tasks.tableElem = $('#tasks-table');
tasks.addFormID = "#task-form";
tasks.addForm = $("#task-form");
tasks.editFormID = "#task-edit-form";
tasks.editForm = $("#task-edit-form");
tasks.db = db.list.taskDB;
tasks.fieldsData = [
	{ n: 'date', t: 'Date', fc: 'datepicker', l:[1, 63] },
	{ n: 'time', t: 'Time (hours)', l:[1, 63], adding: true },
	{ n: 'taskTypeID', t: 'Task Type', isID: 'taskType', l:[1, 63], shows: 'name'},
	{ n: 'gardenID', t: 'Garden', isID: 'garden', shows: 'name'},
	{ n: 'rowID', t: 'Row', isID: 'row', shows: 'name'},
	{ n: 'cropID', t: 'Crop', isID: 'crop', shows: (item)=>{
		return item.name + (item.variety ? ", "+item.variety : '') ;
	}},
	{ n: 'amount', t: 'Amount', adding: true},
	{ n: 'workerID', t: 'Worker', isID: 'worker', l:[1, 63], shows: 'name'},
	{ n: 'notes', t: 'Notes'}
];
tasks.fieldsMetaData = {
	idFields: ['taskType', 'row', 'crop', 'worker']
}

// Store Temp Data //
tasks.lastSearch = {};
tasks.lastAFSearch;
tasks.lastResults = [];
tasks.lastSort = '';

// ADD FORM // 

// Add Form HTML //
let html = 
	'<p class="validate-tips"></p>'+
	  '<form>'+
	    '<fieldset>';
	      
	      	let template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(tasks.fieldsData.slice(0, 2), template);

	      	html += "<label for=taskTypeID>Task Type</label><select name='taskTypeID' class='mb-s'></select>";
	      	html += "<label for=gardenID>Garden</label><select name='gardenID' class='mb-s'></select>";
	      	html += "<label for=rowID>Row</label><select name='rowID' class='mb-s'></select>";
	      	html += "<label for=cropID>Crop</label><select name='cropID' class='mb-s'></select>";

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(tasks.fieldsData.slice(6, 7), template);

	      	html += "<label for=workerID>Worker</label><select name='workerID' class='mb-s'></select>";

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(tasks.fieldsData.slice(8), template);
	      
html +=	      
	    '</fieldset>'+
	  '</form>';
tasks.addForm.html(html);

// Get Field Elements //
tasks.addForm.fieldElems = t.genFieldElems(tasks, tasks.addFormID);
tasks.addForm.tipsElem = $('#task-form .validate-tips');

// Add Form Jquery //
tasks.addForm.J = tasks.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Task": ()=>{ t.addItem(tasks, "addForm") },
	    	Cancel: ()=>{
	    		t.clear(tasks, 'addForm');
	    		$('#quickAdd').val('initial');
	    		tasks.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ 
	    		t.clear(tasks, 'addForm');
	    		$('#quickAdd').val('initial');
	    	}
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
tasks.editForm.html(html);

tasks.editForm.onOpen = function(item){ // fill in row select menu options and set to correct value
	let gardenID = $('#task-edit-form select[name="gardenID"]').val();
	// get all rows from that gardenID
	let rows = db.datastore.row.filter( (row)=>{ return row.gardenID == gardenID} );
	let html = '<option></option>';
	rows.sort( (a, b)=>{return a.name > b.name} );
	for (let i = 0; i < rows.length; i++) {
		html += '<option value="'+rows[i]._id+'">'+rows[i].name+'</option>';
	};
	$('#task-edit-form select[name="rowID"]').html(html).val(item.rowID);
}

// Get Field Elements //
tasks.editForm.fieldElems = t.genFieldElems(tasks, tasks.editFormID);
tasks.editForm.tipsElem = $('#task-edit-form .validate-tips');

// Edit Form Jquery //
tasks.editForm.J = tasks.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Task": ()=>{ t.updateItem(tasks, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(tasks, 'editForm');
	    		tasks.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(tasks) }
	}
});

// Get Row Select Menu after user chooses from Garden Select Menu //
tasks.getRowSelectOptions = function(elem, rowElem){
	elem.change( ()=>{
		let gardenID = elem.val();
		// get all rows from that gardenID
		let rows = db.datastore.row.filter( (row)=>{ return row.gardenID == gardenID} );
		let html = '<option></option>';
		rows.sort( (a, b)=>{return a.name > b.name} );
		for (let i = 0; i < rows.length; i++) {
			html += '<option value="'+rows[i]._id+'">'+rows[i].name+'</option>';
		};
		rowElem.html(html);
	} );
}

// Manage Select Menus
tasks.manageSelectMenus = function(){
	t.getSelectMenuOptions(tasks.addFormID, 'taskType');
	t.getSelectMenuOptions(tasks.editFormID, 'taskType');
	t.getSelectMenuOptions(tasks.addFormID, 'garden', null, (elem)=>{
		tasks.getRowSelectOptions(elem, $('#task-form select[name="rowID"]'));
	});
	t.getSelectMenuOptions(tasks.editFormID, 'garden', null, (elem)=>{
		tasks.getRowSelectOptions(elem, $('#task-edit-form select[name="rowID"]'));
	});
	t.getSelectMenuOptions(tasks.addFormID, 'crop', (item)=>{
		return item.name+ ( item.variety ? ', '+item.variety : '' );
	});
	t.getSelectMenuOptions(tasks.editFormID, 'crop', (item)=>{
		return item.name+ ( item.variety ? ', '+item.variety : '' );
	});
	t.getSelectMenuOptions(tasks.addFormID, 'worker');
	t.getSelectMenuOptions(tasks.editFormID, 'worker');
}

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   tasks.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	   	html += '<input class="search-bar width-long" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   		+ '<input type="checkbox" data-not="'+f.n+'" title="search for NOT this"/><br/>';
	   } );

html += '</div>';
  // insert html
tasks.panelElem.prepend(html);
  //get elements
tasks.advSearchFieldsArea = $('#task .adv-search-fields');
tasks.allFieldsSearchElem = $('#task [data-query="allFields"]');
tasks.advSearchFields = {};
tasks.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	tasks.advSearchFields[f.n] = $('#task [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#task .adv-search-btn').click( ()=>{
	tasks.advSearchFieldsArea.slideToggle();
	// clear fields - nevermind, don't do it for now
	// for (let i in tasks.advSearchFields){
	// 	tasks.advSearchFields[i].val("");
	// }
} );


// type to search
$(tasks.panelID+' .search-bar').on('input', ()=>{ t.search(tasks) } );
$(tasks.panelID+' [type="checkbox"]').on('change', ()=>{ t.search(tasks) } );



// Initially Fetch Table //
ft.fetchTable(tasks, {sortBy: 'name'} );
tasks.manageSelectMenus();

// Tab On Click
tasks.tabElem.click( ()=>{
	// refresh table
	ft.fetchTable(tasks, {sortBy: 'name'} );

	// update id's in select menu options
	tasks.manageSelectMenus();
} );















