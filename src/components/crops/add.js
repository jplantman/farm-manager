let app = FarmManager || {};

let tab = app.tabs.buttonElems.crop;
let panel = app.tabs.panelElems.crop;
let crops = app.tables.crops;
let db = app.dbs.crops;

// create add form //

// create a document fragment
let df = document.createDocumentFragment();

// button that shows and hides the add form
let btn = $('<div> <span class="link">Add New Item</span></div>').appendTo( df ).click( ()=>{
	form.slideToggle();
	triangle.toggleClass(' fa-caret-down ');
	triangle.toggleClass(' fa-caret-up ');
} );

// add a little triangle to button
let triangle = $('<i class="fa fa-caret-down" aria-hidden="true"></i>').appendTo( btn );

// add form area
let form = $('<form style="display: none;"></form>').appendTo( df );

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

// url
let url = $('<input type="text" placeholder="URL (of online information page)" class="full" />').appendTo( form );

// submit button
$('<button>Add Crop</button>').appendTo( form ).click( (e)=>{
	e.preventDefault();
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
	crops.add.func( newCrop );

} );

// clear button
$('<button>Clear</button>').appendTo( form ).click( (e)=>{
	e.preventDefault();
} );

// append doc frag with add form to the add form area
crops.add.elem[0].appendChild( df );

// add crop function
crops.add.func = function(newCrop){
	db.insert( newCrop, ()=>{} )
}







