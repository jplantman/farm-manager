"use strict"

// Main Table Obj
const families = {};

// Store Common Things into Variables //
families.title = "Family";
families.name = "family";
families.tabElem = $('a[href="#family"]');
families.panelID = "#family";
families.panelElem = $('#family');
families.tableElem = $('#families-table');
families.addFormID = "#family-form";
families.addForm = $("#family-form");
families.editFormID = "#family-edit-form";
families.editForm = $("#family-edit-form");
families.db = db.list.familyDB;
families.fieldsData = [
	{ n: 'name', t: 'Plant Family', l: [1, 63], linkBefore: true},
	{ n: 'latinName', t: 'Latin Name', l: [0, 63], c: 'italics', fc: 'italics'},
	{ n: 'notes', t: 'Notes', l: [0, 255]},
	{ n: 'link', t: 'Link <small>(link to online info about this crop)</small>', noAppear: true, v: 'isURL', l: [0, 255]}
];


// Store Temp Data //
families.lastSearch = {};
families.lastAFSearch;
families.lastResults = [];
families.lastSort = '';

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
	      		let visFields = (families.fieldsData)
	      	return t.fillTemplate(visFields, template);
	      }()
html +=	      
	    '</fieldset>'+
	  '</form>';
families.addForm.html(html);

// Get Field Elements //
families.addForm.fieldElems = t.genFieldElems(families, families.addFormID);
families.addForm.tipsElem = $('#family-form .validate-tips');

// Add Form Jquery //
families.addForm.J = families.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Family": ()=>{ t.addItem(families, "addForm") },
	    	Cancel: ()=>{
	    		t.clear(families, 'addForm');
	    		families.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ t.clear(families, 'addForm') }
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
families.editForm.html(html);

// Get Field Elements //
families.editForm.fieldElems = t.genFieldElems(families, families.editFormID);
families.editForm.tipsElem = $('#family-edit-form .validate-tips');

// Delete Block - prevents standard items from being deleted //
families.deleteBlock = function(){

}

// Edit Form Jquery //
families.editForm.J = families.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Family": ()=>{ t.updateItem(families, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(families, 'editForm');
	    		families.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(families) }
	}
});

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   families.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   	+ '<input type="checkbox" data-not="'+f.n+'" title="search for NOT this"/><br/>';
	   } );

html += '</div>';
  // insert html
families.panelElem.prepend(html);
  //get elements
families.advSearchFieldsArea = $('#family .adv-search-fields');
families.allFieldsSearchElem = $('#family [data-query="allFields"]');
families.advSearchFields = {};
families.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	families.advSearchFields[f.n] = $('#family [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#family .adv-search-btn').click( ()=>{
	families.advSearchFieldsArea.slideToggle();
	// clear fields
	for (let i in families.advSearchFields){
		families.advSearchFields[i].val("");
	}
} );


// type to search
$(families.panelID+' .search-bar').on('input', ()=>{ t.search(families) } );
$(families.panelID+' [type="checkbox"]').on('change', ()=>{ t.search(families) } );

// Initially Fetch Table //
ft.fetchTable(families, {sortBy: 'name'} );

families.tabElem.click( ()=>{
	ft.fetchTable(families, {sortBy: 'name'} );
} );
















