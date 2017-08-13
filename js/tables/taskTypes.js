"use strict"

// Main Table Obj
const taskTypes = {};

// Store Common Things into Variables //
taskTypes.title = "Task Type";
taskTypes.name = "taskType";
taskTypes.tabElem = $('a[href="#taskType"]');
taskTypes.panelID = "#taskType";
taskTypes.panelElem = $('#taskType');
taskTypes.tableElem = $('#taskTypes-table');
taskTypes.addFormID = "#taskType-form";
taskTypes.addForm = $("#taskType-form");
taskTypes.editFormID = "#taskType-edit-form";
taskTypes.editForm = $("#taskType-edit-form");
taskTypes.db = db.list.taskTypeDB;
taskTypes.fieldsData = [
	{n: 'name', t: 'Name', l: [1, 20]},
	{n: 'desc', t: 'Description', l: [0, 255]},
	{n: 'notes', t: 'Notes', l: [0, 255]}
];

// Store Temp Data //
taskTypes.lastSearch = {};
taskTypes.lastAFSearch;
taskTypes.lastResults = db.datastore.taskTypes;
taskTypes.lastSort = '';

// ADD FORM // 

// Add Form HTML //
let html = 
	'<p class="validate-tips"></p>'+
	  '<form>'+
	    '<fieldset>'
html +=
	      function(){
	      	let template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all"><br/>';
	      		let visFields = (taskTypes.fieldsData.filter( d=>!d.noAppear ))
	      	return t.fillTemplate(visFields, template);
	      }()
html +=	      
	    '</fieldset>'+
	  '</form>';
taskTypes.addForm.html(html);

// Get Field Elements //
taskTypes.addForm.fieldElems = t.genFieldElems(taskTypes, taskTypes.addFormID);
taskTypes.addForm.tipsElem = $('#taskType-form .validate-tips');

// Add Form Jquery //
taskTypes.addForm.J = taskTypes.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Task Type": ()=>{ t.addItem(taskTypes, "addForm") },
	    	Cancel: ()=>{
	    		t.clear(taskTypes, 'addForm');
	    		taskTypes.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ t.clear(taskTypes, 'addForm') }
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
taskTypes.editForm.html(html);

// Get Field Elements //
taskTypes.editForm.fieldElems = t.genFieldElems(taskTypes, taskTypes.editFormID);
taskTypes.editForm.tipsElem = $('#taskType-edit-form .validate-tips');

// Edit Form Jquery //
taskTypes.editForm.J = taskTypes.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Task Type": ()=>{ t.updateItem(taskTypes, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(taskTypes, 'editForm');
	    		taskTypes.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(taskTypes) }
	}
});

// Search Form //
  // search form html
html = "<div class='delete-all-showing ui-button flt-r mr'>Delete All Showing</div>"+
	   '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   taskTypes.fieldsData.forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   	+ '<input type="checkbox" data-not="'+f.n+'" title="search for NOT this"/><br/>';
	   } );

html += '</div>';
  // insert html
taskTypes.panelElem.prepend(html);
  //get elements
taskTypes.advSearchFieldsArea = $('#taskType .adv-search-fields');
taskTypes.allFieldsSearchElem = $('#taskType [data-query="allFields"]');
taskTypes.advSearchFields = {};
taskTypes.fieldsData.forEach( (f)=>{
	taskTypes.advSearchFields[f.n] = $('#taskType [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#taskType .adv-search-btn').click( ()=>{
	taskTypes.advSearchFieldsArea.slideToggle();
	// clear fields
	for (let i in taskTypes.advSearchFields){
		taskTypes.advSearchFields[i].val("");
	}
} );


// type to search
$(taskTypes.panelID+' .search-bar').on('input', ()=>{ t.search(taskTypes) } );
$(taskTypes.panelID+' [type="checkbox"]').on('change', ()=>{ t.search(taskTypes) } );

// Initially Fetch Table //
ft.fetchTable(taskTypes, {sortBy: 'name'} );

taskTypes.tabElem.click( ()=>{
	ft.fetchTable(taskTypes, {sortBy: 'name'} );
} )

// Delete all items showing button
t.deleteAllBtn(taskTypes);















