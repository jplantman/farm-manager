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

			// variety
			let varietyElem = tds[1].firstChild;
			varietyElem.innerHTML = '<input type="text" class="edit-field" value="'+varietyElem.innerHTML+'" />';

			// latinName
			let latinNameElem = tds[2].lastChild;
			latinNameElem.innerHTML = '<input type="text" class="edit-field" value="'+latinNameElem.innerHTML+'" />';

			// spacing
			let spacingElem = tds[4].lastChild;
			spacingElem.innerHTML = '<input type="text" class="edit-field" value="'+spacingElem.innerHTML+'" />';

			// dtm
			let dtmElem = tds[5].lastChild;
			dtmElem.innerHTML = '<input type="text" class="edit-field" value="'+dtmElem.innerHTML+'" />';

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

			// variety
			let varietyElem = tds[1].firstChild;
			updatedItem.variety = varietyElem.firstChild.value;
			varietyElem.innerHTML = varietyElem.firstChild.value;

			// latinName
			let latinNameElem = tds[2].lastChild;
			updatedItem.latinName = latinNameElem.firstChild.value;
			latinNameElem.innerHTML = latinNameElem.firstChild.value;

			// spacing
			let spacingElem = tds[4].lastChild;
			updatedItem.spacing = spacingElem.firstChild.value;
			spacingElem.innerHTML = spacingElem.firstChild.value;

			// dtm
			let dtmElem = tds[5].lastChild;
			updatedItem.dtm = dtmElem.firstChild.value;
			dtmElem.innerHTML = dtmElem.firstChild.value;

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

// variety
let variety = $('<input type="text" placeholder="Variety" class="full" />').appendTo( form );

// latinName
let latinName = $('<input type="text" placeholder="Latin Name" class="full" />').appendTo( form );

// family
let family = $('<select></select>').appendTo( form );

let famDocs = app.datastore.families; // get family docs
$('<option value="">Choose a Family:</option>').appendTo( family ); // initial option
for (var i = 0; i < famDocs.length; i++) { // family options
	let famDoc = famDocs[i];
	$('<option value="'+famDoc._id+'">'+famDoc.name+'</option>').appendTo( family );
};

// spacing
let spacing = $('<input type="text" placeholder="Spacing" class="full" />').appendTo( form );

// dtm
let dtm = $('<input type="text" placeholder="Days To Maturity" class="full" />').appendTo( form );

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
        		variety: variety[0].value,
        		latinName: latinName[0].value,
        		family: family[0].value,
        		spacing: spacing[0].value,
        		dtm: dtm[0].value,
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

	// variety
	variety[0].value = data.variety;

	// latinName
	latinName[0].value = data.latinName;

	// family
	family[0].value = data.family;

	// spacing
	spacing[0].value = data.spacing;

	// dtm
	dtm[0].value = data.dtm;

	// link
	link[0].value = data.link;

	// notes
	notes[0].value = data.notes;

}




