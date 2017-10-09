let app = FarmManager || {};

let tab = app.tabs.buttonElems.crop;
let panel = app.tabs.panelElems.crop;
let crops = app.tables.crops;
let db = app.dbs.crops;

// create a document fragment
let df = $(document.createDocumentFragment());

// basic search bar
basicSearchBar = $('<input type="text" placeholder="Search..." />').appendTo( df )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

// advanced search bars toggler
let advSearchToggler = $('<span class="link">Advanced Search</span>').appendTo( df ).click( ()=>{ advSearchArea.slideToggle() } );
advSearchToggler[0].style.marginLeft = "2em";

// adv search area
let advSearchArea = $('<div style="display: none;"><hr /></div>').appendTo( df );

let advSearchStyle = 'display: inline-block; margin: 4px 2px';

let nameSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by name..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let nameSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
nameSearchNotBox.after('Search for NOT this <br/>');

let varietySearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by variety..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let varietySearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
varietySearchNotBox.after('Search for NOT this <br/>');

let latinNameSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by latin name..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let latinNameSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
latinNameSearchNotBox.after('Search for NOT this <br/>');

let familySearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by family..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let familySearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
familySearchNotBox.after('Search for NOT this <br/>');

let spacingSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by spacing..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let spacingSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
spacingSearchNotBox.after('Search for NOT this <br/>');

let dtmSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by dtm..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let dtmSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
dtmSearchNotBox.after('Search for NOT this <br/>');

let notesSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by notes..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ crops.output.render( getQuery() ) } );

let notesSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ crops.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
notesSearchNotBox.after('Search for NOT this <br/>');

function getQuery(){
	let query = {}
	if (basicSearchBar[0].value){
		query.basicSearch = basicSearchBar[0].value;
	}
	if (nameSearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.name = {
			val: nameSearchBar[0].value,
			not: nameSearchNotBox[0].checked
		};
	}
	if (varietySearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.variety = {
			val: varietySearchBar[0].value,
			not: varietySearchNotBox[0].checked
		};
	}
	if (latinNameSearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.latinName = {
			val: latinNameSearchBar[0].value,
			not: latinNameSearchNotBox[0].checked
		};
	}
	if (familySearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.family = {
			val: familySearchBar[0].value,
			not: amilySearchNotBox[0].checked
		};
	}
	if (spacingSearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.spacing = {
			val: spacingSearchBar[0].value,
			bot: spacingSearchNotBox[0].checked
		};
	}
	if (dtmSearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.dtm = {
			val: dtmSearchBar[0].value,
			not: dtmSearchNotBox[0].checked
		};
	}
	if (notesSearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.notes = {
			val: notesSearchBar[0].value,
			not: notesSearchNotBox[0].checked
		};
	}
	//console.log(query)
	return query;
}


$('<hr />').appendTo( df );

// append doc frag with add form to the add form area
crops.search.elem.append( df );