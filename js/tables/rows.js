"use strict"


// Main Table Obj
const rows = {};

// Store Common Things into Variables //
rows.title = "Row";
rows.tabElem = $('a[href="#row"]');
rows.panelID = "#row";
rows.panelElem = $('#row');
rows.tableElem = $('#rows-table');
rows.addFormID = "#row-form";
rows.addForm = $("#row-form");
rows.editFormID = "#row-edit-form";
rows.editForm = $("#row-edit-form");
rows.db = db.list.rowDB;
rows.fieldsData = [
	{ n: 'name', t: 'Name', l: [1, 40]},
	{ n: 'gardenID', t: 'Garden', isID: 'garden'},
	{ n: 'notes', t: 'Notes'}
];
rows.fieldsMetaData = {
	idFields: ['garden']
}

// Store Temp Data //
rows.lastSearch = {};
rows.lastAFSearch;
rows.lastResults = [];
rows.lastSort = '';

// ADD FORM // 

// Add Form HTML //
let html = 
	'<p class="validate-tips"></p>'+
	  '<form>'+
	    '<fieldset>';

	      	let template = `<label for="{{n}}">{{t}} <em title='separate names by commas to add many rows at once (e.g. "row 1, row 2, row 3")'>(multi-add)</em></label>`+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(rows.fieldsData.slice(0, 1), template);

	      	html += "<label for=gardenID>Garden</label><select name='gardenID' class='mb-s'></select>"

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(rows.fieldsData.slice(2), template);
	      
html +=	      
	    '</fieldset>'+
	  '</form>';
rows.addForm.html(html);

// Get Field Elements //
rows.addForm.fieldElems = t.genFieldElems(rows, rows.addFormID);
rows.addForm.tipsElem = $('#row-form .validate-tips');

// Add Form Jquery //
rows.addForm.J = rows.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Row": ()=>{ 

	    		let values = rows.addForm.fieldElems.name.val().split(/, ?/).forEach( (name)=>{
	    			t.addItem(rows, "addForm", ['name', name]);
	    		} );
	    		t.clear(rows, 'addForm');
	    		
	    	},
	    	Cancel: ()=>{
	    		t.clear(rows, 'addForm');
	    		$('#quickAdd').val('initial');
	    		rows.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ 
	    		t.clear(rows, 'addForm');
	    		$('#quickAdd').val('initial');
	    	}
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
rows.editForm.html(html);

// Get Field Elements //
rows.editForm.fieldElems = t.genFieldElems(rows, rows.editFormID);
rows.editForm.tipsElem = $('#row-edit-form .validate-tips');

// Edit Form Jquery //
rows.editForm.J = rows.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Row": ()=>{ t.updateItem(rows, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(rows, 'editForm');
	    		rows.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(rows) }
	}
});

// gardenID select menu
t.getSelectMenuOptions(rows.addFormID, 'garden');
t.getSelectMenuOptions(rows.editFormID, 'garden');

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   rows.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   } );

html += '</div>';
  // insert html
rows.panelElem.prepend(html);
  //get elements
rows.advSearchFieldsArea = $('#row .adv-search-fields');
rows.allFieldsSearchElem = $('#row [data-query="allFields"]');
rows.advSearchFields = {};
rows.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	rows.advSearchFields[f.n] = $('#row [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#row .adv-search-btn').click( ()=>{
	rows.advSearchFieldsArea.slideToggle();
	// clear fields
	for (let i in rows.advSearchFields){
		rows.advSearchFields[i].val("");
	}
} );


// type to search
$('#row .search-bar').on('input', function(){
	let params = {
 		query: rows.getSearchQuery() // advanced query
	}
	let afVal = rows.allFieldsSearchElem.val();
	if (afVal != ""){
		params.allFields = new RegExp (afVal, 'i'); // all fields search	
	}
    ft.fetchTable(rows.db, rows, params);
} );

rows.getSearchQuery = function(){
	let query = {};
	for (let i in rows.advSearchFields){
		let val = rows.advSearchFields[i].val();
		if (val != ""){
			query[i] = new RegExp(val, 'i');
		}
	}
	return query;
}

// Initially Fetch Table //
ft.fetchTable(rows.db, rows, {sortBy: 'name'} );

// Tab On Click
rows.tabElem.click( ()=>{
	t.getSelectMenuOptions(rows.addFormID, 'garden');
	t.getSelectMenuOptions(rows.editFormID, 'garden');
} );















