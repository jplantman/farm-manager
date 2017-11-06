let app = FarmManager || {};

let tab = app.tabs.buttonElems.family;
let panel = app.tabs.panelElems.family;
let families = app.tables.families;
let db = app.dbs.families;

// create edit form //

// create a document fragment
let df = $(document.createDocumentFragment());

// button that shows and hides the add form
let btn = $('<span class="link ml">Edit Selected</span>').appendTo( families.btnBar ).click( function(){
	// style of editing depends on how many boxes are checked. if only 1 is checked, the edit form will open.
	// if more than 1 boxes are checked, in-line editing will toggle

	let numberOfItemsChecked = families.checkedBoxes.length;
	if ( numberOfItemsChecked > 1 ){
		inLineEdit(this);
	} else if ( numberOfItemsChecked == 1 ){
		populateEditDialog();
		dialog.dialog('open');
	}
} );

function inLineEdit(btnElem){ // click function to edit items in-line
	// get each checked row, and id, like thisL [ $(tr), 'id' ]
	let checkedRows = families.checkedBoxes.map( box=>[box.parent().parent(), box.attr('data-id')] );

	if ( !families.edit.editMode ){ // enter edit mode
		families.edit.editMode = true;
		btnElem.innerHTML = "Save Changes";
		// turn editing fields into inputs for editing //

		// turn each text data into an input field
		checkedRows.forEach( ( tr )=>{
			//console.log(tr[0][0], tr[1]);

			// get each table data element
			let tds = tr[0].children();

			// name
			let nameElem = tds[0].lastChild;
			nameElem.innerHTML = '<input type="text" class="edit-field" value="'+nameElem.innerHTML+'" />';

			// latinName
			let latinNameElem = tds[2].lastChild;
			latinNameElem.innerHTML = '<input type="text" class="edit-field" value="'+latinNameElem.innerHTML+'" />';

			// notes
			let notesElem = tds[6].lastChild;
			notesElem.innerHTML = '<textarea>'+notesElem.innerHTML+'</textarea>';
		} );
	} else { // leave edit mode
		families.edit.editMode = false;
		btnElem.innerHTML = "Edit Selected";

		// create obj to store edited item
		let updatedItems = [];

		checkedRows.forEach( ( tr)=>{

			// get each table data element
			let tds = tr[0].children();

			let updatedItem = {};

			// for each element, save the edited value and change back the innerHTML

			// name
			let nameElem = tds[0].lastChild;
			updatedItem.name = nameElem.firstChild.value;
			nameElem.innerHTML = nameElem.firstChild.value;

			// latinName
			let latinNameElem = tds[2].lastChild;
			updatedItem.latinName = latinNameElem.firstChild.value;
			latinNameElem.innerHTML = latinNameElem.firstChild.value;

			// notes
			let notesElem = tds[6].lastChild;
			updatedItem.notes = notesElem.firstChild.value;
			notesElem.innerHTML = notesElem.firstChild.value;

			updatedItems.push([ { _id: tds[0].firstChild.getAttribute('data-id') }, updatedItem ]);
		} );
		console.log('TEST', updatedItems);
		app.updateMany( 'families', updatedItems, ()=>{
			app.refreshDatastore( ()=>{
				families.output.render();
				families.checkboxCheck();
			} );
		} )

	}
}

// jQuery Modal Form Style Editing //

// add form area
let form = $('<form></form>').appendTo( df );

// form has inputs:

// name
let name = $('<input type="text" placeholder="Name" class="full" />').appendTo( form );

// latinName
let latinName = $('<input type="text" placeholder="Latin Name" class="full" />').appendTo( form );

// link
let link = $('<input type="text" placeholder="URL (of online information page)" class="full" />').appendTo( form );

// notes
let notes = $('<textarea type="text" placeholder="Additional notes..." class="full" ></textarea>').appendTo( form );

// append doc frag with edit form to the edit form area
families.edit.elem.append( df );

// add title to form
families.edit.elem.attr('title', 'Edit Selected Crop(s)');

// jQuery dialog
let dialog = families.edit.elem.dialog({
      autoOpen: false,
      height: 400,
      width: 350,
      modal: true,
      buttons: {
        Update: function(){
        	let query = { _id: families.checkedBoxes[0].attr('data-id') };
        	let update = {
        		name: name[0].value,
        		latinName: latinName[0].value,
        		link: link[0].value,
        		notes: notes[0].value
        	};
        	let options = {};
        	let callback = function(){
        		app.refreshDatastore( ()=>{
        			families.output.render();
        			dialog.dialog( "close" );
        		} )
        	}
        	db.update(query, update, options, callback);
        },
        Cancel: function() {
          dialog.dialog( "close" );
        }
      }
    });

// populate edit dialog
function populateEditDialog(){
	let checkbox = families.checkedBoxes[0]; // checkbox element
	let id = checkbox.attr('data-id'); // get id from checkbox elem
	let data = app.getByID('families', id); // get data from datastore

	// name
	name[0].value = data.name;

	// latinName
	latinName[0].value = data.latinName;

	// link
	link[0].value = data.link;

	// notes
	notes[0].value = data.notes;

}




