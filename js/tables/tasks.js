"use strict"


// Main Table Obj
const tasks = {};

// Store Common Things into Variables //
tasks.title = "Task";
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
	{ n: 'time', t: 'Time (hours)', l:[1, 63] },
	{ n: 'taskTypeID', t: 'Task Type', isID: 'taskType', l:[1, 63]},
	{ n: 'rowID', t: 'Row', isID: 'row'},
	{ n: 'cropID', t: 'Crop', isID: 'crop'},
	{ n: 'amount', t: 'Amount'},
	{ n: 'workerID', t: 'Worker', isID: 'worker', l:[1, 63]},
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
	      	html += "<label for=rowID>Row</label><select name='rowID' class='mb-s'></select>";
	      	html += "<label for=cropID>Crop</label><select name='cropID' class='mb-s'></select>";

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(tasks.fieldsData.slice(4, 1), template);

	      	html += "<label for=workerID>Worker</label><select name='workerID' class='mb-s'></select>";

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(tasks.fieldsData.slice(6), template);
	      
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

// familyID select menu
t.getSelectMenuOptions(tasks.addFormID, 'taskType');
t.getSelectMenuOptions(tasks.editFormID, 'taskType');
t.getSelectMenuOptions(tasks.addFormID, 'row');
t.getSelectMenuOptions(tasks.editFormID, 'row');
t.getSelectMenuOptions(tasks.addFormID, 'crop');
t.getSelectMenuOptions(tasks.editFormID, 'crop');
t.getSelectMenuOptions(tasks.addFormID, 'worker');
t.getSelectMenuOptions(tasks.editFormID, 'worker');

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   tasks.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
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
	// clear fields
	for (let i in tasks.advSearchFields){
		tasks.advSearchFields[i].val("");
	}
} );


// type to search
$('#task .search-bar').on('input', function(){
	let params = {
 		query: tasks.getSearchQuery() // advanced query
	}
	let afVal = tasks.allFieldsSearchElem.val();
	if (afVal != ""){
		params.allFields = new RegExp (afVal, 'i'); // all fields search	
	}
    ft.fetchTable(tasks.db, tasks, params);
} );

tasks.getSearchQuery = function(){
	let query = {};
	for (let i in tasks.advSearchFields){
		let val = tasks.advSearchFields[i].val();
		if (val != ""){
			query[i] = new RegExp(val, 'i');
		}
	}
	return query;
}

// Initially Fetch Table //
ft.fetchTable(tasks.db, tasks, {sortBy: 'name'} );

// Tab On Click
tasks.tabElem.click( ()=>{
	// update id's in select menu options
	t.getSelectMenuOptions(tasks.addFormID, 'taskType');
	t.getSelectMenuOptions(tasks.editFormID, 'taskType');
	t.getSelectMenuOptions(tasks.addFormID, 'row');
	t.getSelectMenuOptions(tasks.editFormID, 'row');
	t.getSelectMenuOptions(tasks.addFormID, 'crop');
	t.getSelectMenuOptions(tasks.editFormID, 'crop');
	t.getSelectMenuOptions(tasks.addFormID, 'worker');
	t.getSelectMenuOptions(tasks.editFormID, 'worker');
} );
















