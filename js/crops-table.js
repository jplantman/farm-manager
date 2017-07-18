const Table = require('./Table.js');

const crops = new Table(
	{
		dbName: "cropDB",
		tableTitle: "Crops",
		tabPanelID: "crop",
		tableDockSelector: "#crops-table",
		fields: [
			// [field name, field title ]
			['name', 'Name', 'edit-field'],
			['variety', 'Variety'],
			['family', 'Family'],
			['spacing', 'Spacing'],
			['dtm', 'D.T.M. <br/><i>(days to maturity)</i>'],
			['notes', 'Notes']
		],

		// ADD FORM //

		addForm: {
			selector: '#crop-form',
			// forms are meant to be formatted in this way:
			HTML: 
			  '<p class="validate-tips">All form fields are required.</p>'+
		      '<select id="quickAdd"></select>'+
		     
		      '<form>'+
		        '<fieldset>'+
		          '<label for "name">Name: </label>'+
		          // input 'name' attr matches field name
		          '<input type="text" name="name" class="text ui-widget-content ui-corner-all"><br/>'+
		
		          '<label for="variety">Variety: </label>'+
		          '<input type="text" name="variety" class="text ui-widget-content ui-corner-all"><br/>'+
		
		          '<label for="family">Family: </label>'+
		          '<input type="text" name="family" class="text ui-widget-content ui-corner-all"><br/>'+
		
		          '<label for="spacing">Spacing: </label>'+
		          '<input type="text" name="spacing" class="text ui-widget-content ui-corner-all"><br/>'+
		
		          '<label for="dtm">D.T.M. <i>(days to maturity)</i>:</label>'+
		          '<input type="text" name="dtm" class="text ui-widget-content ui-corner-all"><br/>'+
		
		          '<label for="notes">Notes: </label>'+
		          '<input type="text" name="notes" class="text ui-widget-content ui-corner-all"><br/>'+
		
		        '</fieldset>'+
		      '</form>',	
		      // function is executed after form params are processed
		      beforeComplete: function(){
		      	// 'Quick Add' select input in 'Add Crop Form'
				var quickAddElem = $('#quickAdd');
				var quickAdd = [
				    {name: "carrots", family: "apiaceae", spacing: 1, dtm: 62},
				    {name: "kale", family: "brassicaceae", spacing: 12, dtm: 47},
				    {name: "broccoli", family: "brassicaceae", spacing: 12, dtm: 58}
				  ];

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
				      $( "#crop-form [name='family']" ).val(item.family);
				      $( "#crop-form [name='spacing']" ).val(item.spacing);
				      $( "#crop-form [name='dtm']" ).val(item.dtm); 
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
		      HTML: 
		      	'<form>'+
			        '<fieldset>'+
			          '<label for="name">Name: </label>'+
			          '<input type="text" name="name" class="text ui-widget-content ui-corner-all"><br/>'+

			          '<label for="variety">Variety: </label>'+
			          '<input type="text" name="variety" class="text ui-widget-content ui-corner-all"><br/>'+

			          '<label for="family">Family: </label>'+
			          '<input type="text" name="family" class="text ui-widget-content ui-corner-all"><br/>'+

			          '<label for="spacing">Spacing: </label>'+
			          '<input type="text" name="spacing" class="text ui-widget-content ui-corner-all"><br/>'+

			          '<label for="dtm">D.T.M.: </label>'+
			          '<input type="text" name="dtm" class="text ui-widget-content ui-corner-all"><br/>'+

			          '<label for="notes">Notes: </label>'+
			          '<input type="text" name="notes" class="text ui-widget-content ui-corner-all"><br/>'+
			          
			        '</fieldset>'+
			      '</form>'
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

