"use strict"

// Main Table Obj
const crops = {};

// Store Common Things into Variables //
crops.title = "Crop";
crops.name = "crop";
crops.tabElem = $('[href="#crop"]');
crops.panelID = "#crop";
crops.panelElem = $('#crop');
crops.tableElem = $('#crops-table');
crops.addFormID = "#crop-form";
crops.addForm = $("#crop-form");
crops.editFormID = "#crop-edit-form";
crops.editForm = $("#crop-edit-form");
crops.db = db.list.cropDB;
crops.fieldsData = [
	{ n: 'name', t: 'Name', l: [3, 20], linkBefore: true},
	{ n: 'variety', t: 'Variety', l: [0, 49]},
	{ n: 'latinName', t: 'Latin Name', l: [0, 49], c: 'italics', fc: 'italics'},
	{ n: 'familyID', t: 'Family', isID: 'family', shows: 'name'},
	{ n: 'spacing', t: 'Spacing', lc: 'mt'},
	{ n: 'dtm', t: 'D.T.M.', tt: 'days to maturity'},
	{ n: 'notes', t: 'Notes'},
	{ n: 'link', t: 'Link <small>(link to online info about this crop)</small>', noAppear: true, v: 'isURL'}
];
crops.fieldsMetaData = {
	idFields: ['family']
}

// Store Temp Data //
crops.lastSearch = {};
crops.lastAFSearch;
crops.lastResults = [];
crops.lastSort = '';

// ADD FORM // 

// Add Form HTML //
let html = 
	'<p class="validate-tips"></p>'+
	  '<form>'+
	    '<fieldset>'+
	    	'<select id="quickAdd" class="flt-r mb-s"></select>';
	      
	      	let template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(crops.fieldsData.slice(0, 3), template);

	      	html += "<label for=familyID>Plant Family</label><select name='familyID' class='mb-s'></select>"

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(crops.fieldsData.slice(4, 5), template);

	      	template = '<label for="{{n}}">{{t}}</label>'+ // dtm
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}" title="{{tt}}"><br/>';
	      	html += t.fillTemplate(crops.fieldsData.slice(5, 6), template);

	      	template = '<label for="{{n}}">{{t}}</label>'+
	      		'<input type="text" name="{{n}}" class="text ui-widget-content ui-corner-all {{fc}}"><br/>';
	      	html += t.fillTemplate(crops.fieldsData.slice(6), template);
	      
html +=	      
	    '</fieldset>'+
	  '</form>';
crops.addForm.html(html);

// Get Field Elements //
crops.addForm.fieldElems = t.genFieldElems(crops, crops.addFormID);
crops.addForm.tipsElem = $('#crop-form .validate-tips');

// Quick Add //

let quickAddElem = $('#quickAdd');
let quickAdd = require('../lists/quick-add-crops.js');

  quickAddElem.html( ()=>{
    let html = '<option value="initial" selected="selected">Quick Add:</option>';

    for (let i = 0; i < quickAdd.length; i++) {
      html += "<option value='"+i+"''>"+quickAdd[i].name+"</option>"
    };
    return html;
  });

// When 'quick add' select input is changed, add the data to the form
quickAddElem.change(function(){
  var item = quickAdd[quickAddElem.val()];
  if (item){
  	for( let i in crops.addForm.fieldElems ){
  		crops.addForm.fieldElems[i].val(item[i] || "");
  	}
  }
});

// Add Form Jquery //
crops.addForm.J = crops.addForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Add Crop": ()=>{ t.addItem(crops, "addForm") },
	    	Cancel: ()=>{
	    		t.clear(crops, 'addForm');
	    		$('#quickAdd').val('initial');
	    		crops.addForm.J.dialog('close');
	    	},
	    	Clear: ()=>{ 
	    		t.clear(crops, 'addForm');
	    		$('#quickAdd').val('initial');
	    	}
	}
});

// EDIT FORM //

// Edit Form HTML (same as add form) //
crops.editForm.html(html);

// Get Field Elements //
crops.editForm.fieldElems = t.genFieldElems(crops, crops.editFormID);
crops.editForm.tipsElem = $('#crop-edit-form .validate-tips');

// Edit Form Jquery //
crops.editForm.J = crops.editForm.dialog({
	  autoOpen: false,
	  height: 500,
	  width: 500,
	  modal: true,
	  buttons: {
	    	"Edit Crop": ()=>{ t.updateItem(crops, "editForm") },
	    	Cancel: ()=>{
	    		t.clear(crops, 'editForm');
	    		crops.editForm.J.dialog('close');
	    	},
	    	Delete: ()=>{ t.deleteItem(crops) }
	}
});

// Search Form //
  // search form html
html = '<input class="search-bar" data-query="allFields" placeholder="Search in any field" />'+
	   '<div class="adv-search-btn">advanced search options</div>'+
	   '<div class="adv-search-fields">';
	   crops.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	   	html += '<input class="search-bar" data-query="'+f.n+'" placeholder="Search by '+f.t+'" />'
	   	+ '<input type="checkbox" data-not="'+f.n+'" title="search for NOT this"/><br/>';
	   } );

html += '</div>';
  // insert html
crops.panelElem.prepend(html);
  //get elements
crops.advSearchFieldsArea = $('#crop .adv-search-fields');
crops.allFieldsSearchElem = $('#crop [data-query="allFields"]');
crops.advSearchFields = {};
crops.fieldsData.filter( d=>!d.noAppear ).forEach( (f)=>{
	crops.advSearchFields[f.n] = $('#crop [data-query="'+f.n+'"]'); 
} );

//click to toggle adv search
$('#crop .adv-search-btn').click( ()=>{
	crops.advSearchFieldsArea.slideToggle();
	// clear fields
	for (let i in crops.advSearchFields){
		crops.advSearchFields[i].val("");
	}
} );


// type to search
$(crops.panelID+' .search-bar').on('input', ()=>{ t.search(crops) } );
$(crops.panelID+' [type="checkbox"]').on('change', ()=>{ t.search(crops) } );

// Initially Fetch Table //
ft.fetchTable(crops, {sortBy: 'name'} );

// familyID select menu
t.getSelectMenuOptions(crops.addFormID, 'family');
t.getSelectMenuOptions(crops.editFormID, 'family');

// Tab On Click
crops.tabElem.click( ()=>{
	ft.fetchTable(crops, {sortBy: 'name'} );
	t.getSelectMenuOptions(crops.addFormID, 'family');
	t.getSelectMenuOptions(crops.editFormID, 'family');
} );
















