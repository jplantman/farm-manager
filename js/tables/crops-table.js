const Table = require('../constructors/Table.js');
const SIFD = require('../constructors/StandardInputFieldData.js');
const quickAddData = require('../quick-add-crops.js');

let fields = [
	// { n: 'name', t: 'Title', c: 'class-name', r: /regexp/, rErr: 'regex error message', l(limit): [min, max] } (see StandardInputFieldData.js)
	SIFD({ n: 'name', t: 'Name', c: 'edit-field', linkBefore: true}, 3, 24),
	SIFD({ n: 'variety', t: 'Variety'}, 0, 49),
	SIFD({ n: 'latinName', t: 'Latin Name', c: 'italics', fc: 'italics'}),
	SIFD({ n: 'family', t: 'Family'}),
	SIFD({ n: 'spacing', t: 'Spacing'}),
	SIFD({ n: 'dtm', t: 'D.T.M. <br/><small>(days to maturity)</small>'}),
	SIFD({ n: 'notes', t: 'Notes'}),
	{ n: 'link', t: 'Link <small>(link to online info about this crop)</small>', noAppear: true}
];


const crops = new Table(
	{
		dbName: "cropDB",
		tableTitle: "Crops",
		tabPanelID: "crop",
		tableDockSelector: "#crops-table",
		fields: fields,

		// ADD FORM //

		addForm: {
			selector: '#crop-form',
			// forms are meant to be formatted in this way:
			HTML: function(){
		          	let inputHTML = 
		          	'<p class="validate-tips">"Name" is required.</p>'+
		      			'<select id="quickAdd" class="flt-r"></select>'+
		     
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
		      // function is executed after form params are processed
		      beforeComplete: function(){
		      	// 'Quick Add' select input in 'Add Crop Form'
				var quickAddElem = $('#quickAdd');
				var quickAdd = quickAddData;

				  quickAddElem.html( function(){
				    let html = '<option value="initial" selected="selected">Quick Add:</option>';

				    for (var i = 0; i < quickAdd.length; i++) {
				      html += "<option value='"+i+"''>"+quickAdd[i].name+"</option>"
				    };
				    return html;

				  } );

				// When 'quick add' select input is changed, add the data to the form
				quickAddElem.change(function(){
				  var item = quickAdd[quickAddElem.val()];
				  if (item){
				      $( "#crop-form [name='name']" ).val(item.name);
				      $( "#crop-form [name='latinName']" ).val(item.latinName || "");
				      $( "#crop-form [name='family']" ).val(item.family || "");
				      $( "#crop-form [name='spacing']" ).val(item.spacing || "");
				      $( "#crop-form [name='dtm']" ).val(item.dtm || "");
				      $( "#crop-form [name='link']" ).val(item.link || "");
				  }
				});
		      },
		      // added into the clear function
		      clearAssist: function(){
		      	$('#quickAdd').val('initial');
		      },
		      openBtnSelector: "#add-crop"
		},
		editForm: {
			// EDIT FORM //

		      selector: '#crop-edit-form',
		      HTML: function(){
		          	let inputHTML = 
		          	'<p class="validate-tips"></p>'+
		     
					      '<form>'+
					        '<fieldset>';
		          	for (var i = 0; i < fields.length; i++) {
		          		inputHTML += '<label for="'+fields[i].n+'">'+fields[i].t+': </label>'+
		          			'<input type="text" name="'+fields[i].n+'" class="text ui-widget-content ui-corner-all"><br/>';
		          	};
		          	inputHTML +=  '</fieldset></form>';
		          	return inputHTML;
		          },
			   // button set for add or edit form
		      btnSet: 'edit'
		},

	    // SEARCH //
	    searchRadioSelector: "crop-radio-1",
	    searchFormHTML: // search bar and btn MUST have class 'search-bar' and 'search-btn'
	        '<input class="search-bar" placeholder="search crops for..." />'+
	        '<span class="ui-button search-btn">search</span>'+

	        '<fieldset>'+
	          '<legend>Search By:</legend>'+
	          // data-tag must == field name
	          '<label for="crop-radio-1">Any Field</label>'+ 
	          '<input type="radio" name="crop-radio-1" id="crop-radio-1" data-tag="allFields" checked="checked">'+
	          '<label for="crop-radio-2">Name</label>'+
	          '<input type="radio" name="crop-radio-1" id="crop-radio-2" data-tag="name">'+
	          '<label for="crop-radio-3">Variety</label>'+
	          '<input type="radio" name="crop-radio-1" id="crop-radio-3" data-tag="variety">'+
	          '<label for="crop-radio-4">Family</label>'+
	          '<input type="radio" name="crop-radio-1" id="crop-radio-4" data-tag="family">'+
	          '<label for="crop-radio-5">Spacing</label>'+
	          '<input type="radio" name="crop-radio-1" id="crop-radio-5" data-tag="spacing">'+
	          '<label for="crop-radio-6">D.T.M.</label>'+
	          '<input type="radio" name="crop-radio-1" id="crop-radio-6" data-tag="dtm">'+
	          '<label for="crop-radio-7">Notes</label>'+
	          '<input type="radio" name="crop-radio-1" id="crop-radio-7" data-tag="notes">'+
	        '</fieldset>'
	}
);

