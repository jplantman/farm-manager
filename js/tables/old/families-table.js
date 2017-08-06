const Table = require('../constructors/Table.js');

let fields = [
	{ n: 'name', t: 'Plant Family', c: 'edit-field', linkBefore: true},
	{ n: 'Latin Name', t: 'Latin Name', c: 'italics', fc: 'italics'},
	{ n: 'notes', t: 'Notes'},
	{ n: 'link', t: 'Link <small>(link to online info about this crop)</small>', noAppear: true, v: 'isURL'}
];


const families = new Table(
	{
		dbName: "familyDB",
		tableTitle: "Families",
		tabPanelID: "family",
		tableDockSelector: "#families-table",
		fields: fields,
		autoPop: ['./js/lists/basic-families.txt', './db/families.db'],

		// ADD FORM //

		addForm: {
			height: 450,
			selector: '#family-form',
			// forms are meant to be formatted in this way:
			HTML: function(){
		          	let inputHTML = 
		          	'<p class="validate-tips">"Name" is required.</p>'+
					      '<form>'+
					        '<fieldset>';
		          	for (var i = 0; i < fields.length; i++) {
		          		inputHTML += '<label for="'+fields[i].n+'">'+fields[i].t+': </label>'+
		          			'<input type="text" name="'+fields[i].n+'" class="text ui-widget-content ui-corner-all '+
		          			(fields[i].fc ? fields[i].fc : "")
		          			+'"><br/>';
		          	};
		          	inputHTML +=  '</fieldset></form>';
		          	return inputHTML;
		          },
		      // button set for add or edit form
		      btnSet: 'add',	
		      openBtnSelector: "#add-family"
		},
		editForm: {
			// EDIT FORM //

		      selector: '#family-edit-form',
		      HTML: function(){
		          	let inputHTML = 
		          	'<p class="validate-tips">"Name" is required.</p>'+
		     
					      '<form>'+
					        '<fieldset>';
		          	for (var i = 0; i < fields.length; i++) {
		          		inputHTML += '<label for="'+fields[i].n+'">'+fields[i].t+': </label>'+
		          			'<input type="text" name="'+fields[i].n+'" class="text ui-widget-content ui-corner-all '+
		          			(fields[i].fc ? fields[i].fc : "")
		          			+'"><br/>';
		          	};
		          	inputHTML +=  '</fieldset></form>';
		          	return inputHTML;
		          },
			   beforeComplete: function(){
			  	// create cropID select menu
			  	db.getItems( db.dbList.cropDB, function(docs){
			  		if (docs.length === 0){ console.log('No crops added yet.'); return; }
			  		let html = '';
			  		for (var i = 0; i < docs.length; i++) {
			  			html += '<option value="'+docs[i]._id+'">'+docs[i].name+', '+docs[i].variety+'</option>';
			  		};
			  		$('#row-edit-form [name="cropID"]').html(html);

			  	}, {});
			  },   
			   // button set for add or edit form
		      btnSet: 'edit'
		},

	    // SEARCH //
	    searchRadioSelector: "family-radio-1",
	    searchFormHTML: // search bar and btn MUST have class 'search-bar' and 'search-btn'
	        '<input class="search-bar" placeholder="search rows for..." />'+
	        '<span class="ui-button search-btn">search</span>'+

	        '<fieldset>'+
	          '<legend>Search By:</legend>'+
	          // data-tag must == field name
	          '<label for="family-radio-1">Any Field</label>'+ 
	          '<input type="radio" name="family-radio-1" id="family-radio-1" data-tag="allFields" checked="checked">'+
	          '<label for="family-radio-2">Name</label>'+
	          '<input type="radio" name="family-radio-1" id="family-radio-2" data-tag="name">'+
	          '<label for="family-radio-3">Crop</label>'+
	          '<input type="radio" name="family-radio-1" id="family-radio-3" data-tag="cropID">'+
	          '<label for="family-radio-4">Length</label>'+
	          '<input type="radio" name="family-radio-1" id="family-radio-4" data-tag="length">'+
	          // '<label for="family-radio-5">Spacing</label>'+
	          // '<input type="radio" name="family-radio-1" id="family-radio-5" data-tag="spacing">'+
	          // '<label for="family-radio-6">D.T.M.</label>'+
	          // '<input type="radio" name="family-radio-1" id="family-radio-6" data-tag="dtm">'+
	          '<label for="family-radio-7">Notes</label>'+
	          '<input type="radio" name="family-radio-1" id="family-radio-7" data-tag="notes">'+
	        '</fieldset>'
	}
);

