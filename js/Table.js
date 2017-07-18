"use strict";

const db = require('./database.js');
const Form = require('./Form.js')

function Table (params){
	const that = this;
	this.lastSearch = {};
	this.lastSort;

		// Get Tab Panel ID
	this.tabPanelID = params.tabPanelID;

		// Get Table Title (eg "Crops")
	this.tableTitle = params.tableTitle;

		// Get DB variable name (eg "cropDB")
	this.dbName = params.dbName;

	this.db = db.dbList[this.dbName];

		// Get fields data
	this.fields = params.fields;

	this.tableDockSelector = params.tableDockSelector;
	this.tableDockElem = $(params.tableDockSelector); // where to insert the table

		// Create Table Function
	this.createTable = function(params){
	  params = params || {}; // options on how to modify the table to be displayed
	  let query = {};
	  let callback = function(docs){

	    // SORT
	    if (params.sortBy){ 
	      if (that.lastSort == params.sortBy){ // sort in reverse
	        docs.sort( function(a, b){ return a[params.sortBy] < b[params.sortBy] } );
	        that.lastSort = null;
	      } else {
	        docs.sort( function(a, b){ return a[params.sortBy] > b[params.sortBy] } );
	        that.lastSort = params.sortBy;
	      }
	      
	    }

	    // FILTERS
	    if (params.search){
	      if (params.searchBy == "allFields" || !params.searchBy){ //if any field contains the string
	        docs = docs.filter( function(obj){
	          var match;
	          for (let i = 0; i < that.fields.length; i++) {
	            let string = obj[that.fields[i][0]];
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

	    var out = "<h1>"+that.tableTitle+" <i>("+docs.length+")</i></h1>";
	    out += "<table class='table'><thead><tr>";
	    for (var i = 0; i < that.fields.length; i++) {
	      out += "<th data-sorter='"+that.fields[i][0]+"'>" + that.fields[i][1] + "</th>";
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
	      
	      for (let j = 0; j < that.fields.length; j++) {
	        out += '<td'+ ( that.fields[j][2] ? ' class="'+that.fields[j][2]+'" data-id="'+ docs[i]._id +'"' : '' ) +'>'+ (docs[i][ that.fields[j][0] ] || '') +'</td>'
	      };
	      out += "</tr>";
	    };
	    out += '</tbody></table>';

	    // output table html
	    that.tableDockElem.html(out);

	    // click to sort
	    $(that.tableDockSelector+" [data-sorter]").click( function(){
	      let sortBy = $(this).attr('data-sorter');
	      let params = JSON.parse( JSON.stringify(that.lastSearch || {}) );
	      params.sortBy = sortBy;
	      that.createTable( params );
	    } );

	    // click to edit
	    // $(this.tableDockSelector+" .edit-field").click( function() {
	    //   let id = $(this).attr('data-id');
	    //   db.updateID = id;
	      
	    //   db.getCrop(function(crop){
	    //     $('#edit-crop-name').val(crop.name);
	    //     $('#edit-crop-variety').val(crop.variety);
	    //     $('#edit-crop-family').val(crop.family);
	    //     $('#edit-crop-spacing').val(crop.spacing);
	    //     $('#edit-crop-dtm').val(crop.dtm);
	    //     $('#edit-crop-notes').val(crop.notes);

	    //   }, {_id: id});

	    //   cropEditForm.dialog('open');

	    // } );


	  }
	  db.getItems( that.db, callback, query);
	}
	this.createTable();

	// "Add" Form
	this.addForm = new Form(this, params.addForm);
	
	// Create Search Form //
	this.searchFormHTML = params.searchFormHTML;
	this.tabPanelElem = $('#'+this.tabPanelID);
	this.tabPanelElem.prepend(this.searchFormHTML);
	this.searchRadioSelector = params.searchRadioSelector;
	this.searchBarElem = $('#'+this.tabPanelID+' .search-bar');
	this.searchBtnElem = $('#'+this.tabPanelID+' .search-btn');

	
	this.search = ()=>{
	  let query = this.searchBarElem.val();
	  let searchBy = $('#'+this.tabPanelID+' input[name="'+this.searchRadioSelector+'"]:checked').attr('data-tag');
	  params = { search: query, searchBy: searchBy };
	  this.lastSearch = params;
	  this.createTable( params );
	}

	this.searchBtnElem.click( this.search );

}




module.exports = Table;




