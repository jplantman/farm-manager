let app = FarmManager || {};

let tab = app.tabs.buttonElems.crop;
let panel = app.tabs.panelElems.crop;
let crops = app.tables.crops;
let db = app.dbs.crops;

// create add form //

// create a document fragment
let df = $(document.createDocumentFragment());

// button that shows and hides the add form
let btn = $('<span class="link">Add New Item</span>').appendTo( df ).click( ()=>{
	dialog.dialog("open");
} );

// btnbar holds buttons that show when checkboxes are selected
crops.btnBar = $('<span style="display: none; margin-left: 10px; "></span>').appendTo( df );

// hr
df.append('<hr/>');

// add area for form that will become jQuery modal
let formArea = $('<div></div>').appendTo( df );

// add form area
//let form = $('<form style="display: none;"></form>').appendTo( formArea );

// form has inputs:

// flash message
flashElem = $('<span style="padding: 5px;"></span>').appendTo( formArea );
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

// add crop function
crops.add.func = function(newCrop){
	db.insert( newCrop, (err, newDoc)=>{
		app.refreshDatastore( ()=>{
			crops.output.render();
		} );
	} );
}

// clear form
crops.clear = function(){
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
let deleteBtn = $('<span class="link">Delete Selected</span>').appendTo( crops.btnBar ).click( ()=>{
	deleteSelected();
} );

function deleteSelected(){
	if ( confirm('delete ALL selected items? This cannot be undone.') ){

		let deleteList = [];
		for (var i = crops.output.checkboxes.length - 1; i >= 0; i--) {
			let checkbox = crops.output.checkboxes[i];
			if ( checkbox[0].checked ){
				deleteList.push( { _id: checkbox.attr('data-id') } )
			}
		};
		db.remove( { $or: deleteList}, { multi: true }, (err, numRemoved)=>{
			app.refreshDatastore( ()=>{
				crops.output.render();
				crops.btnBarIsShowing = false;
				crops.btnBar.hide();
			} )
		} );

	}
}



// append doc frag with add form to the add form area
crops.add.elem.append( df );

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
		crops.add.func( newCrop );
		crops.clear();
		dialog.dialog( "close" );
		
        },
        Clear: crops.clear,
        Cancel: function() {
          dialog.dialog( "close" );
          crops.clear();
        }
      }
    });


