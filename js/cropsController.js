const db = require('./database.js');



db.getCropsTable = function(params){ // gets data for table of crops and displays it.
  console.log('getCropsTable called with params : ', params);
  params = params || {}; // options on how to modify the table to be displayed
  db.getCrops( function(docs){

    var fields = [
      ['name', "Name", "edit-field"],
      ['variety', 'Variety'],
      ['family', 'Family'],
      ['spacing', 'Spacing'],
      ['dtm', 'D.T.M. <br/><i>(days to maturity)</i>'],
      ['notes', 'Notes']
    ];

    // SORT
    if (params.sortBy){ 
      if (dbc.searchParams.sortedBy == params.sortBy){ // sort in reverse
        docs.sort( function(a, b){ return a[params.sortBy] < b[params.sortBy] } );
        dbc.searchParams.sortedBy = null;
      } else {
        docs.sort( function(a, b){ return a[params.sortBy] > b[params.sortBy] } );
        dbc.searchParams.sortedBy = params.sortBy;
      }
      
    }

    // FILTERS
    if (params.search){
      console.log(params);
      if (params.searchBy == "allFields" || !params.searchBy){ //if any field contains the string
        docs = docs.filter( function(obj){
          var match;
          for (let i = 0; i < fields.length; i++) {
            let string = obj[fields[i][0]];
            let regex = new RegExp(params.search);
            match = regex.test(string);
            if (match){ return true }; 
          };
        } );
      } else {
        docs = docs.filter( function(obj){
          let string = obj[params.searchBy];
          let regex = new RegExp(params.search);
          return regex.test(string);
        } );
      }

    }

    var out = "<h1>Crops:</h1>";

    out += "<table class='table'><thead><tr>";
    for (var i = 0; i < fields.length; i++) {
      out += "<th data-sorter='"+fields[i][0]+"'>" + fields[i][1] + "</th>";
    };
    out += "</tr></thead><tbody>";
    for (var i = 0; i < docs.length; i++) {
      if (params.highlight && params.highlight._id == docs[i]._id){
        //highlight
        out += "<tr class='ui-state-highlight'>";

        setTimeout(function() {
          $('.ui-state-highlight').removeClass( "ui-state-highlight", 1500 );
        }, 500 );

      } else { 
        //no highlight
        out += "<tr>";
      }
      
      for (let j = 0; j < fields.length; j++) {
        out += '<td'+ ( fields[j][2] ? ' class="'+fields[j][2]+'" data-id="'+ docs[i]._id +'"' : '' ) +'>'+ (docs[i][ fields[j][0] ] || '') +'</td>'
      };
      out += "</tr>";
    };
    out += '</tbody></table>';

    $('#crops-table').html(out);

    $("[data-sorter]").click( function(){
      let sortBy = $(this).attr('data-sorter');
      let params = JSON.parse( JSON.stringify(dbc.searchParams) );
      params.sortBy = sortBy;
      db.getCropsTable( params );
    } );

    $(".edit-field").click( function() {
      let id = $(this).attr('data-id');
      db.updateID = id;
      
      db.getCrop(function(crop){
        $('#edit-crop-name').val(crop.name);
        $('#edit-crop-variety').val(crop.variety);
        $('#edit-crop-family').val(crop.family);
        $('#edit-crop-spacing').val(crop.spacing);
        $('#edit-crop-dtm').val(crop.dtm);
        $('#edit-crop-notes').val(crop.notes);

      }, {_id: id});

      cropEditForm.dialog('open');

    } );


  } , {});
}

db.getCropsTable();






// JQuery UI Modal Form, Add Crop Form
var cropForm = $( "#crop-form" ).dialog({
  autoOpen: false,
  height: 600,
  width: 400,
  modal: true,
  buttons: {
    "Add Crop": submitCrop,
    Cancel: function() {
      cropForm.clear();
      cropForm.dialog( "close" );
    },
    Clear: () => {
      cropForm.clear();
    }
  }
});



// Button to open 'Add Crop Form'
$( "#add-crop" ).on( "click", () => {
  cropForm.dialog( "open" );
});

// 'Quick Add' select input in 'Add Crop Form'
var quickAddElem = $('#quickAdd');
var quickAdd = [
    {name: "carrots", family: "apiaceae", spacing: 1, dtm: 62},
    {name: "kale", family: "brassicaceae", spacing: 12, dtm: 47},
    {name: "broccoli", family: "brassicaceae", spacing: 12, dtm: 58}
  ];

  quickAddElem.html( function(){
    let html = '<option value="initial" selected="selected">Quick Add:</option>';

    for (var i = 0; i < quickAdd.length; i++) {
      html += "<option value='"+i+"''>"+quickAdd[i].name+"</option>"
    };
    return html;

  } );

// When 'quick add' select input is changed, add the data to the form
quickAddElem.change(function(){
  var item = quickAdd[quickAddElem.val()];
  if (item){
      $( "#add-crop-name" ).val(item.name);
      $( "#add-crop-family" ).val(item.family);
      $( "#add-crop-spacing" ).val(item.spacing);
      $( "#add-crop-dtm" ).val(item.dtm); 
  }
});

// JQuery UI Modal Form, Edit Crop Form
var cropEditForm = $( "#crop-edit-form" ).dialog({
  autoOpen: false,
  height: 600,
  width: 400,
  modal: true,
  buttons: {
    "Edit Crop": updateCrop,
    Cancel: function() {
      cropEditForm.dialog( "close" );
    },
    Delete: deleteCrop
  }
});

cropForm.clear = function(){
  $( "#add-crop-name" ).val("");
  $( "#add-crop-variety" ).val("");
  $( "#add-crop-family" ).val("");
  $( "#add-crop-spacing" ).val("");
  $( "#add-crop-dtm" ).val("");
  $( "#add-crop-notes" ).val("");
  quickAddElem.val('initial');
}



function submitCrop(){

  var name = $( "#add-crop-name" );
  var variety = $( "#add-crop-variety" );
  var family = $( "#add-crop-family" );
  var spacing = $( "#add-crop-spacing" );
  var dtm = $( "#add-crop-dtm" );
  var notes = $( "#add-crop-notes" );
  // var allFields = $( [] ).add( name ).add( variety ).add( family )
  //              .add( spacing ).add( dtm ).add( notes );
  var tips = $( ".validateTips-crops" );

  valid = true;

  valid = valid && dbc.checkLength( name, "Name", 3, 16, tips );

  valid = valid && dbc.checkRegexp( name, /^[a-z]([0-9a-z_\-\s])+$/i, "Name may consist of a-z, 0-9, underscores, dashes, spaces and must begin with a letter.", tips );

  if ( valid ){
    db.addCrop( {
      name: name.val(),
      variety: variety.val(),
      family: family.val(),
      spacing: spacing.val(),
      dtm: dtm.val(),
      notes: notes.val()
    }, (newItem)=>{
      let params = JSON.parse( JSON.stringify(dbc.searchParams) );
      params.highlight = newItem;
      db.getCropsTable( params );
    } );
    cropForm.clear();
    cropForm.dialog('close');
    
    
  }

}

function updateCrop(){

  var name = $('#edit-crop-name');
  var variety = $('#edit-crop-variety');
  var family = $('#edit-crop-family');
  var spacing = $('#edit-crop-spacing');
  var dtm = $('#edit-crop-dtm');
  var notes = $('#edit-crop-notes');



  valid = true;

  valid = valid && dbc.checkLength( name, "Name", 3, 16 );

  valid = valid && dbc.checkRegexp( name, /^[a-z]([0-9a-z_\-\s])+$/i, "Name may consist of a-z, 0-9, underscores, dashes, spaces and must begin with a letter." );

  if ( valid ){

    var query = {_id: db.updateID};

    var update = {
      name: name.val(),
      variety: variety.val(),
      family: family.val(),
      spacing: spacing.val(),
      dtm: dtm.val(),
      notes: notes.val()
    };

    db.updateCrop( query, update, {}, (updatedItem)=>{
      let params = JSON.parse( JSON.stringify(dbc.searchParams) );
      params.highlight = updatedItem;
      db.getCropsTable( params );
    } );
    cropEditForm.dialog('close');
       
  }  
}

function deleteCrop(){
  db.deleteCrop(db.updateID, ()=>{
    cropEditForm.dialog('close');
    db.getCropsTable( dbc.searchParams );
  } );
}

//SEARCH
$( "[type='radio']" ).checkboxradio({
  icon: false
});
$( "fieldset" ).controlgroup();


db.searchCrop = function(){
  let query = $('#search-bar-crop').val();
  let searchBy = ($('input[name=crop-search-by]:checked').attr('id') || 'allFields').replace('crop-','');
  params = { search: query, searchBy: searchBy };
  dbc.searchParams = params;
  db.getCropsTable( params );
}

$('#search-btn-crop').click( function(){
  db.searchCrop();
} );

$('#search-bar-crop').on('keypress', function(e){
  if (e.keyCode == 13){
    db.searchCrop();
  }
});





