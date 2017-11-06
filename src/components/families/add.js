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

// latinName
let latinName = $('<input type="text" placeholder="Latin Name" class="full" />').appendTo( formArea );

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
	name.val('');
	latinName.val('');
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
			latinName: latinName.val(),
			notes: notes.val(), 
			link: link.val()
		};
		if ( !validate(newCrop) ){ return; }
		families.add.func( newCrop );
		families.clear();
		dialog.dialog( "close" );
			app.refreshDatastore();
        },
        Clear: families.clear,
        Cancel: function() {
          dialog.dialog( "close" );
          families.clear();
        }
      }
    });


