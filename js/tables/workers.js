"use strict"

// Main Table Obj
const workers = {};

// Store Common Things into Variables //
workers.title = "Worker";
workers.name = "worker";
workers.tabElem = $('a[href="#worker"]');
workers.panelID = "#worker";
workers.panelElem = $('#worker');
workers.tableElem = $('#workers-table');
workers.addFormID = "#worker-form";
workers.addForm = $("#worker-form");
workers.editFormID = "#worker-edit-form";
workers.editForm = $("#worker-edit-form");
workers.db = db.list.workerDB;
workers.fieldsData = [
	{n: 'name', t: 'Name', l: [1, 20]},
	{n: 'startDate', t: 'Start Date', fc: 'datepicker'},
	{n: 'endDate', t: 'End Date', fc: 'datepicker'},
	{n: 'notes', t: 'Notes', l: [0, 255]}
];

// Store Temp Data //
workers.lastSearch = {};
workers.lastAFSearch;
workers.lastResults = [];
workers.lastSort = '';

// ADD FORM // 

// Add Form HTML //
let html = 
	'<p class="validate-tips"></p>'+
	  '<form>'+
	    '<fieldset>'
html +=
	      function(){
	      	let template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      		let visFields = (workers.fieldsData.filter( d=>!d.noAppear ))
	      	return t.fillTemplate(visFields, template);
	      }()
html +=	      
	    '</fieldset>'+
	  '</form>';
workers.addForm.html(html);

// Get Field Elements //
workers.addForm.fieldElems = t.genFieldElems(workers, workers.addFormID);
workers.addForm.tipsElem = $('#worker-form .validate-tips');

// Add Form Jquery //
workers.addForm.J = workers.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Worker": ()=>{ t.addItem(workers, "addForm") },
	    	Cancel: ()=>{
	    		t.clear(workers, 'addForm');
	    		workers.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ t.clear(workers, 'addForm') }
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
workers.editForm.html(html);

// Get Field Elements //
workers.editForm.fieldElems = t.genFieldElems(workers, workers.editFormID);
workers.editForm.tipsElem = $('#worker-edit-form .validate-tips');

// Edit Form Jquery //
workers.editForm.J = workers.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Worker": ()=>{ t.updateItem(workers, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(workers, 'editForm');
	    		workers.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(workers) }
	}
});

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   workers.fieldsData.forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   	+ '<input type="checkbox" data-not="'+f.n+'" title="search for NOT this"/><br/>';
	   } );

html += '</div>';
  // insert html
workers.panelElem.prepend(html);
  //get elements
workers.advSearchFieldsArea = $('#worker .adv-search-fields');
workers.allFieldsSearchElem = $('#worker [data-query="allFields"]');
workers.advSearchFields = {};
workers.fieldsData.forEach( (f)=>{
	workers.advSearchFields[f.n] = $('#worker [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#worker .adv-search-btn').click( ()=>{
	workers.advSearchFieldsArea.slideToggle();
	// clear fields
	for (let i in workers.advSearchFields){
		workers.advSearchFields[i].val("");
	}
} );


// type to search
$(workers.panelID+' .search-bar').on('input', ()=>{ t.search(workers) } );
$(workers.panelID+' [type="checkbox"]').on('change', ()=>{ t.search(workers) } );

// Initially Fetch Table //
ft.fetchTable(workers, {sortBy: 'name'} );

workers.tabElem.click( ()=>{
	ft.fetchTable(workers, {sortBy: 'name'} );
} )

















