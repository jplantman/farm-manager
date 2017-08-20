"use strict"

// Main Table Obj
const rows = {};

// Store Common Things into Variables //
rows.title = "Row";
rows.name = "row";
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
	{ n: 'name', t: 'Name', l: [1, 999]},
	{ n: 'gardenID', t: 'Garden', isID: 'garden', shows: 'name', l: [1, 255]},
	{ n: 'cropID', t: 'Current Crops', isID: 'crop', shows: 'name'},
	{ n: 'notes', t: 'Notes'}
];
rows.fieldsMetaData = {
	idFields: ['garden', 'crop']
}

// Store Temp Data //
rows.lastSearch = {};
rows.lastAFSearch;
rows.lastResults = db.datastore.rows;
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

	      	html += "<label for=gardenID>Garden</label><select name='gardenID' class='mb-s'></select>";

	      	html += "<label for=cropID>Current Crops</label><select name='cropID' class='mb-s chosen-select' multiple data-placeholder='choose crop(s)'></select>"

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(rows.fieldsData.slice(3), template);
	      
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
t.getSelectMenuOptions(rows.addFormID, 'crop');
t.getSelectMenuOptions(rows.editFormID, 'crop');

// Search Form //
  // search form html
html = "<div class='delete-all-showing ui-button flt-r mr'>Delete All Showing</div>"+
	   '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   rows.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   	+ '<input type="checkbox" data-not="'+f.n+'" title="search for NOT this"/><br/>';
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
$(rows.panelID+' .search-bar').on('input', ()=>{ t.search(rows) } );
$(rows.panelID+' [type="checkbox"]').on('change', ()=>{ t.search(rows) } );

// Initially Fetch Table //
ft.fetchTable(rows, {sortBy: 'name'} );

// Tab On Click
rows.tabElem.click( ()=>{
	ft.fetchTable(rows, {sortBy: 'name'} );
	t.getSelectMenuOptions(rows.addFormID, 'garden');
	t.getSelectMenuOptions(rows.editFormID, 'garden');
	t.getSelectMenuOptions(rows.addFormID, 'crop');
	t.getSelectMenuOptions(rows.editFormID, 'crop');
} );

// Delete all items showing button
t.deleteAllBtn(rows);













