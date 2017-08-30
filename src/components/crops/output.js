let app = FarmManager || {};

let tab = app.tabs.buttonElems.crop;
let panel = app.tabs.panelElems.crop;
let crops = app.tables.crops;
let db = app.dbs.crops;

crops.output.render = function(){
	// assume datastore is up to date
	let docs = app.datastore.crops;

	// create a document fragment
	let df = document.createDocumentFragment();

	// table title
	$('<h2> Crops <small>('+docs.length+')</small> </h2>').appendTo( df );

	// render output as a table
	let table = $('<table></table>').appendTo( df );

	// Table headers row
	let th = $('<tr></tr>').appendTo( table );

	// Name th
	let first = $('<th></th>').appendTo( th )
	$('<span> Name </span>').appendTo( first ).click( ()=>{
		h.sortTable(crops, docs, 'name');
	} );

	// checkbox that, when clicked, affects all other checkboxes
	$('<input type="checkbox" style="float: left; position: relative; left: -20px;" />').prependTo( first ).change( function(){
		let len = crops.output.checkboxes.length;
		for (let i = len - 1; i >= 0; i--) {
			// disable changing if edit mode
			if ( crops.edit.editMode ){
				this.checked = !this.checked;
			} else {
				crops.output.checkboxes[i][0].checked = this.checked;
				checkboxCheck();
			}
		};
	} )

	// Variety th
	$('<th> Variety </th>').appendTo( th ).click( ()=>{
		if ( boxesChecked().length ){
			console.log( 'editing this field' );
		} else {
			h.sortTable(crops, docs, 'variety');
		}
	} );

	// Latin Name th
	$('<th> Latin Name </th>').appendTo( th ).click( ()=>{
		if ( boxesChecked().length ){
			console.log( 'editing this field' );
		} else {
			h.sortTable(crops, docs, 'latinName');
		}
	} );

	// Family th
	$('<th> Family </th>').appendTo( th ).click( ()=>{
		if ( boxesChecked().length ){
			console.log( 'editing this field' );
		} else {
			h.sortTable(crops, docs, 'family');
		}
	} );

	// Spacing th
	$('<th> Spacing </th>').appendTo( th ).click( ()=>{
		if ( boxesChecked().length ){
			console.log( 'editing this field' );
		} else {
			h.sortTable(crops, docs, 'spacing');
		}
	} );

	// D.T.M th
	$('<th> D.T.M </th>').appendTo( th ).click( ()=>{
		if ( boxesChecked().length ){
			console.log( 'editing this field' );
		} else {
			h.sortTable(crops, docs, 'dtm');
		}
	} );

	// Notes th
	$('<th> Notes </th>').appendTo( th ).click( ()=>{
		if ( boxesChecked().length ){
			console.log( 'editing this field' );
		} else {
			h.sortTable(crops, docs, 'notes');
		}
	} );

	// checkboxes array will hold the checkboxes for the rows in the table
	crops.output.checkboxes = [];
	
	// make table rows from docs
	let len = docs.length;
	for (let i = 0; i < len; i++) {
		let doc = docs[i];

		let tr = $('<tr></tr>').appendTo( table );

		let td = $('<td>'+
			// add link before title, if there is one to add
			( doc.link ? '<a href="'+doc.link+'" target="_blank" style="float: left; position: relative; left: -10px;" > <i class="fa fa-globe" aria-hidden="true"></i> </a>' : '' )+
			'<span class="name">'+( doc.name || '')+'</span></td>').appendTo( tr );

		// checkbox to select row item
		let checkbox = $('<input type="checkbox" style="float: left; position: relative; left: -20px;" data-id="'+doc._id+'" />').prependTo(td)
		crops.output.checkboxes.push( checkbox );

		$('<td><span class="variety">'+(doc.variety || '')+'</span></td>').appendTo( tr );

		$('<td><span class="latinName">'+(doc.latinName || '')+'</span></td>').appendTo( tr );

		$('<td><span class="family">'+(doc.family || '')+'</span></td>').appendTo( tr );

		$('<td><span class="spacing">'+(doc.spacing || '')+'</span></td>').appendTo( tr );

		$('<td><span class="dtm">'+(doc.dtm || '')+'</span></td>').appendTo( tr );

		$('<td><span class="notes">'+(doc.notes || '')+'</span></td>').appendTo( tr );



	};

	// checkboxes helper
	function boxesChecked(){
		let checkedBoxes = [];
		let len = crops.output.checkboxes.length;
		for (let i = len - 1; i >= 0; i--) {
			let checkbox = crops.output.checkboxes[i];
			if ( checkbox[0].checked ){
				checkedBoxes.push( checkbox );
			}
		};
		crops.checkedBoxes = checkedBoxes;
		return checkedBoxes;
	}

	// checkboxes function
	function checkboxCheck(){
		// check if any checkbox is checked
		let oneIsChecked = boxesChecked().length > 0;
		
		

		// if a box is checked and btnBar is not showing, show the btn bar
		if ( oneIsChecked && !crops.btnBarIsShowing ){
			crops.btnBarIsShowing = true;
			crops.btnBar.show();
		} else if ( !oneIsChecked && crops.btnBarIsShowing ) {
			// else if noner are checked and bar is showing, hide it
			crops.btnBarIsShowing = false;
			crops.btnBar.hide();
		}	
	}

	// apply checkbox behavior
	for (let i = crops.output.checkboxes.length - 1; i >= 0; i--) {
		let checkbox = crops.output.checkboxes[i];
		checkbox.change( function(){
			// disable changing if edit mode
			if ( crops.edit.editMode ){
				this.checked = !this.checked;
			} else {
				checkboxCheck();
			}
		} )
	};

	// append doc fragment
	crops.output.elem.html(df);
}


// initially show output
crops.output.render();



