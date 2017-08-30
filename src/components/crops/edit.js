let app = FarmManager || {};

let tab = app.tabs.buttonElems.crop;
let panel = app.tabs.panelElems.crop;
let crops = app.tables.crops;
let db = app.dbs.crops;

// create edit form //

// create a document fragment
let df = $(document.createDocumentFragment());

// button that shows and hides the add form
let btn = $('<span class="link ml">Edit Selected</span>').appendTo( crops.btnBar ).click( function(){
	// Clicking this button will turn on editing mode by changing all the editable fields into input fields.
	// Clicking it again will turn off editing mode and save all changes

	// get each checked row, and id, like thisL [ $(tr), 'id' ]
	let checkedRows = crops.checkedBoxes.map( box=>[box.parent().parent(), box.attr('data-id')] );

	if ( !crops.edit.editMode ){
		crops.edit.editMode = true;
		this.innerHTML = "Save Changes";
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
	} else {
		crops.edit.editMode = false;
		this.innerHTML = "Edit Selected";
		checkedRows.forEach( (tr)=>{

		} );

	}
	


} );

// jQuery Modal Form Style Editing //

// // add form area
// let form = $('<form></form>').appendTo( df );

// // form has inputs:

// // name
// let name = $('<input type="text" placeholder="Name" class="full" disabled />').appendTo( form );

// // variety
// let variety = $('<input type="text" placeholder="Variety" class="full" />').appendTo( form );

// // latinName
// let latinName = $('<input type="text" placeholder="Latin Name" class="full" />').appendTo( form );

// // family
// let family = $('<select></select>').appendTo( form );

// let famDocs = app.datastore.families; // get family docs
// $('<option value="">Choose a Family:</option>').appendTo( family ); // initial option
// for (var i = 0; i < famDocs.length; i++) { // family options
// 	let famDoc = famDocs[i];
// 	$('<option value="'+famDoc._id+'">'+famDoc.name+'</option>').appendTo( family );
// };

// // spacing
// let spacing = $('<input type="text" placeholder="Spacing" class="full" />').appendTo( form );

// // dtm
// let dtm = $('<input type="text" placeholder="Days To Maturity" class="full" />').appendTo( form );

// // link
// let link = $('<input type="text" placeholder="URL (of online information page)" class="full" />').appendTo( form );

// // notes
// let notes = $('<textarea type="text" placeholder="Additional notes..." class="full" ></textarea>').appendTo( form );


// // append doc frag with edit form to the edit form area
// crops.edit.elem.append( df );

// // add title to form
// crops.edit.elem.attr('title', 'Edit Selected Crop(s)');

// // jQuery dialog
// let dialog = crops.edit.elem.dialog({
//       autoOpen: false,
//       height: 400,
//       width: 350,
//       modal: true,
//       buttons: {
//         Edit: function(){

//         },
//         Cancel: function() {
//           dialog.dialog( "close" );
//         }
//       }
//     });






