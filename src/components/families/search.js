let app = FarmManager || {};

let tab = app.tabs.buttonElems.family;
let panel = app.tabs.panelElems.family;
let families = app.tables.families;
let db = app.dbs.families;

// create a document fragment
let df = $(document.createDocumentFragment());

// basic search bar
basicSearchBar = $('<input type="text" placeholder="Search..." />').appendTo( df )
.on( 'input', ()=>{ families.output.render( getQuery() ) } );

// advanced search bars toggler
let advSearchToggler = $('<span class="link">Advanced Search</span>').appendTo( df ).click( ()=>{ advSearchArea.slideToggle() } );
advSearchToggler[0].style.marginLeft = "2em";

// adv search area
let advSearchArea = $('<div style="display: none;"><hr /></div>').appendTo( df );

let advSearchStyle = 'display: inline-block; margin: 4px 2px';

let nameSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by name..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ families.output.render( getQuery() ) } );

let nameSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ families.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
nameSearchNotBox.after('Search for NOT this <br/>');

let latinNameSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by latin name..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ families.output.render( getQuery() ) } );

let latinNameSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ families.output.render( getQuery() ) } )
	.appendTo( advSearchArea );
latinNameSearchNotBox.after('Search for NOT this <br/>');

let notesSearchBar = $('<input type="text" style="'+advSearchStyle+'" placeholder="Search by notes..." />').appendTo( advSearchArea )
.on( 'input', ()=>{ families.output.render( getQuery() ) } );

let notesSearchNotBox = $('<input type="checkbox" />')
	.on( 'change', ()=>{ families.output.render( getQuery() ) } )
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
	if (latinNameSearchBar[0].value){
		query.advSearch = query.advSearch || {};
		query.advSearch.latinName = {
			val: latinNameSearchBar[0].value,
			not: latinNameSearchNotBox[0].checked
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
families.search.elem.append( df );