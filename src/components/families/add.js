let app = FarmManager || {};

let tab = app.tabs.buttonElems.family;
let panel = app.tabs.panelElems.family;
let families = app.tables.families;
let db = app.dbs.families;

// create add form //

// create a document fragment
let df = $(document.createDocumentFragment());

// button that shows and hides the add form
let btn = $('<span class="link">Add New Item</span>').appendTo( df ).click( ()=>{
	dialog.dialog("open");
} );

// btnbar holds buttons that show when checkboxes are selected
families.btnBar = $('<span style="display: none; margin-left: 10px; "></span>').appendTo( df );

// hr
df.append('<hr/>');

// add area for form that will become jQuery modal
let formArea = $('<div></div>').appendTo( df );

// add form area
//let form = $('<form style="display: none;"></form>').appendTo( formArea );

// form has inputs:

let quickAdd = $('<select style="float: right"><select>')
	.html('<option value="">Quick Add:</option>')
	.appendTo( formArea );

let quickAddData = require('./quickAdd.js');
for (var i = 0; i < quickAddData.length; i++) {
	quickAdd.append('<option value="'+i+'">'+quickAddData[i].name+'</option>');
};

quickAdd.change( function(){
	let i = this.value;
	if ( i != '' ){
		name.val( quickAddData[i].name );
		latinName.val( quickAddData[i].latinName );
		family.val( quickAddData[i].family );
		spacing.val( quickAddData[i].spacing );
		dtm.val( quickAddData[i].dtm );
		link.val( quickAddData[i].link );
	}
} );

// flash message
let flashElem = $('<span style="padding: 5px;"></span>').appendTo( formArea );
let flash = function(type, message){
	if (type == 'highlight' || type == 'error'){
		flashElem.addClass('ui-state-'+type);
		setTimeout( ()=>{ flashElem.removeClass( "ui-state-"+type, 1500 ) }, 500 );
	}
	flashElem.html(message+'<br/>');
}

// name
let name = $('<input type="text" placeholder="Name" class="full" />').appendTo( formArea );

// variety
let variety = $('<input type="text" placeholder="Variety" class="full" />').appendTo( formArea );

// latinName
let latinName = $('<input type="text" placeholder="Latin Name" class="full" />').appendTo( formArea );

// family
let family = $('<select></select>').appendTo( formArea );

let famDocs = app.datastore.families; // get family docs
$('<option value="">Choose a Family:</option>').appendTo( family ); // initial option
for (var i = 0; i < famDocs.length; i++) { // family options
	let famDoc = famDocs[i];
	$('<option value="'+famDoc._id+'">'+famDoc.name+'</option>').appendTo( family );
};

// spacing
let spacing = $('<input type="text" placeholder="Spacing" class="full" />').appendTo( formArea );

// dtm
let dtm = $('<input type="text" placeholder="Days To Maturity" class="full" />').appendTo( formArea );

// link
let link = $('<input type="text" placeholder="URL (of online information page)" class="full" />').appendTo( formArea );

// notes
let notes = $('<textarea type="text" placeholder="Additional notes..." class="full" ></textarea>').appendTo( formArea );

// validation
function validate(o){
	if ( !h.valid.exists(o.name) ){
		flash('error', 'Please enter a name');
		return false;
	}
	return true;
}

// add family function
families.add.func = function(newCrop){
	db.insert( newCrop, (err, newDoc)=>{
		app.refreshDatastore( ()=>{
			families.output.render();
		} );
	} );
}

// clear form
families.clear = function(){
	quickAdd.val('');
	name.val('');
	variety.val('');
	latinName.val('');
	family.val('');
	spacing.val('');
	dtm.val('');
	notes.val('');
	link.val('');
	flashElem.html('');
}


// Delete btn
let deleteBtn = $('<span class="link">Delete Selected</span>').appendTo( families.btnBar ).click( ()=>{
	deleteSelected();
} );

function deleteSelected(){
	if ( confirm('delete ALL selected items? This cannot be undone.') ){

		let deleteList = [];
		for (var i = families.output.checkboxes.length - 1; i >= 0; i--) {
			let checkbox = families.output.checkboxes[i];
			if ( checkbox[0].checked ){
				deleteList.push( { _id: checkbox.attr('data-id') } )
			}
		};
		db.remove( { $or: deleteList}, { multi: true }, (err, numRemoved)=>{
			app.refreshDatastore( ()=>{
				families.output.render();
				families.btnBarIsShowing = false;
				families.btnBar.hide();
			} )
		} );

	}
}



// append doc frag with add form to the add form area
families.add.elem.append( df );

// add title to form
formArea.attr('title', 'Add New Crop');

// jQuery dialog
let dialog = formArea.dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        "Add New": function(){
        	let newCrop = {
			name: name.val(), 
			variety: variety.val(), 
			latinName: latinName.val(), 
			family: family.val(), 
			spacing: spacing.val(), 
			dtm: dtm.val(), 
			notes: notes.val(), 
			link: link.val()
		};
		if ( !validate(newCrop) ){ return; }
		families.add.func( newCrop );
		families.clear();
		dialog.dialog( "close" );
		
        },
        Clear: families.clear,
        Cancel: function() {
          dialog.dialog( "close" );
          families.clear();
        }
      }
    });


