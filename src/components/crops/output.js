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
	$('<th> Name </th>').appendTo( th ).click( ()=>{
		console.log('sort by Name');
	} );

	// Variety th
	$('<th> Variety </th>').appendTo( th ).click( ()=>{
		console.log('sort by Variety');
	} );

	// Latin Name th
	$('<th> Latin Name </th>').appendTo( th ).click( ()=>{
		console.log('sort by Latin Name');
	} );

	// Family th
	$('<th> Family </th>').appendTo( th ).click( ()=>{
		console.log('sort by Family');
	} );

	// Spacing th
	$('<th> Spacing </th>').appendTo( th ).click( ()=>{
		console.log('sort by Spacing');
	} );

	// D.T.M th
	$('<th> D.T.M </th>').appendTo( th ).click( ()=>{
		console.log('sort by D.T.M');
	} );

	// Notes th
	$('<th> Notes </th>').appendTo( th ).click( ()=>{
		console.log('sort by Notes');
	} );
	
	// make table rows from docs
	let len = docs.length;
	for (let i = 0; i < len; i++) {
		let doc = docs[i];

		let tr = $('<tr></tr>').appendTo( table );

		$('<td>'+
			// add link before title, if there is one to add
			( doc.link ? '<a href="'+doc.link+'" target="_blank" style="float: left; position: relative; left: -10px;" > <i class="fa fa-globe" aria-hidden="true"></i> </a>' : '' )+
			(doc.name || '')+'</td>').appendTo( tr );

		$('<td>'+(doc.variety || '')+'</td>').appendTo( tr );

		$('<td>'+(doc.latinName || '')+'</td>').appendTo( tr );

		$('<td>'+(doc.family || '')+'</td>').appendTo( tr );

		$('<td>'+(doc.spacing || '')+'</td>').appendTo( tr );

		$('<td>'+(doc.dtm || '')+'</td>').appendTo( tr );

		$('<td>'+(doc.notes || '')+'</td>').appendTo( tr );



	};

	//append doc fragment
	crops.output.elem[0].appendChild(df);
}


// initially show output
crops.output.render();