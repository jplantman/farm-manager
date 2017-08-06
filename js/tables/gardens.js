"use strict"


// Main Table Obj
const gardens = {};

// Store Common Things into Variables //
gardens.title = "Garden";
gardens.panelID = "#garden";
gardens.panelElem = $('#garden');
gardens.tableElem = $('#gardens-table');
gardens.addFormID = "#garden-form";
gardens.addForm = $("#garden-form");
gardens.editFormID = "#garden-edit-form";
gardens.editForm = $("#garden-edit-form");
gardens.db = db.list.gardenDB;
gardens.fieldsData = [
	{n: 'name', t: 'Name', l: [1, 20]},
	{n: 'desc', t: 'Description', l: [0, 255]},
	{n: 'notes', t: 'Notes', l: [0, 255]}
];

// Store Temp Data //
gardens.lastSearch = {};
gardens.lastAFSearch;
gardens.lastResults = [];
gardens.lastSort = '';

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
	      		let visFields = (gardens.fieldsData.filter( d=>!d.noAppear ))
	      	return t.fillTemplate(visFields, template);
	      }()
html +=	      
	    '</fieldset>'+
	  '</form>';
gardens.addForm.html(html);

// Get Field Elements //
gardens.addForm.fieldElems = t.genFieldElems(gardens, gardens.addFormID);
gardens.addForm.tipsElem = $('#garden-form .validate-tips');

// Add Form Jquery //
gardens.addForm.J = gardens.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Garden": ()=>{ t.addItem(gardens, "addForm") },
	    	Cancel: ()=>{
	    		t.clear(gardens, 'addForm');
	    		gardens.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ t.clear(gardens, 'addForm') }
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
gardens.editForm.html(html);

// Get Field Elements //
gardens.editForm.fieldElems = t.genFieldElems(gardens, gardens.editFormID);
gardens.editForm.tipsElem = $('#garden-edit-form .validate-tips');

// Edit Form Jquery //
gardens.editForm.J = gardens.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Garden": ()=>{ t.updateItem(gardens, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(gardens, 'editForm');
	    		gardens.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(gardens) }
	}
});

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   gardens.fieldsData.forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   } );

html += '</div>';
  // insert html
gardens.panelElem.prepend(html);
  //get elements
gardens.advSearchFieldsArea = $('#garden .adv-search-fields');
gardens.allFieldsSearchElem = $('#garden [data-query="allFields"]');
gardens.advSearchFields = {};
gardens.fieldsData.forEach( (f)=>{
	gardens.advSearchFields[f.n] = $('#garden [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#garden .adv-search-btn').click( ()=>{
	gardens.advSearchFieldsArea.slideToggle();
	// clear fields
	for (let i in gardens.advSearchFields){
		gardens.advSearchFields[i].val("");
	}
} );


// type to search
$('#garden .search-bar').on('input', function(){
	let params = {
 		query: gardens.getSearchQuery() // advanced query
	}
	let afVal = gardens.allFieldsSearchElem.val();
	if (afVal != ""){
		params.allFields = new RegExp (afVal, 'i'); // all fields search	
	}
 ft.fetchTable(gardens.db, gardens, params);
} );

gardens.getSearchQuery = function(){
	let query = {};
	for (let i in gardens.advSearchFields){
		let val = gardens.advSearchFields[i].val();
		if (val != ""){
			query[i] = new RegExp(val, 'i');
		}
	}
	return query;
}

// Initially Fetch Table //
ft.fetchTable(gardens.db, gardens, {sortBy: 'name'} );



















