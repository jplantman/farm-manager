"use strict";

const db = require('../database.js');
const Form = require('./Form.js')

function Table (params){
	this.params = params;
	const that = this;
	this.lastSearch = {};
	this.lastResults;
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

		// Render Table Function
	this.renderTable = function(params){
	  params = params || {}; // options on how to modify the table to be displayed
	  let query = {};
	  let callback = function(docs){
	  	// Store Results;
	  	that.lastResults = docs;

	  	// AUTO POP
	  	if (that.params.autoPop && docs.length === 0){
	  		let fs = require('fs');
			let data = fs.readFileSync(that.params.autoPop[0], 'utf-8');
			fs.writeFile(that.params.autoPop[1], data, ()=>{
				location.reload();
			});
			
			return;
	  	}

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
	            let string = obj[that.fields[i].n];
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

	    var out = "<div class='add-new-item ui-button flt-r mr'>Add New "+that.tableTitle+"</div>"+
	    			"<h1>"+that.tableTitle+" <small>("+docs.length+")</small></h1>";
	    out += "<table class='table'><thead><tr>";
	    for (var i = 0; i < that.fields.length; i++) {
	      if (!that.fields[i].noAppear){ 	
	      	out += "<th data-sorter='"+that.fields[i].n+"'>" + that.fields[i].t + "</th>";
	      }
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
	      // Make fields for each row on table
	      for (let j = 0; j < that.fields.length; j++) {
	      	if (!that.fields[j].noAppear){
	        	out += '<td>';
	        	if (that.fields[j].linkBefore && docs[i].link){ // check for link globe
	      			out += '<a href="'+docs[i].link+'" target="_blank"><i class="fa fa-globe flt-l hover" aria-hidden="true"></i></a> '
	      		}
	        	out += '<span '+ 
	        	// check for classes to add
	        	( that.fields[j].c ? ' class="'+that.fields[j].c+'" data-id="'+ docs[i]._id +'"' : '' )
	        	 +'>';
	        	 // text actually displayed for each <td>:
	        	 {
	        	 	let doc = docs[i];
	        	 	let field = that.fields[j];
	        	 	let isAnID = /ID/i.test(field.n);
	        	 	if (isAnID){
	        	 		out += doc[field.t];
	        	 	} else {
	        	 		out += "is not ID";
	        	 	}
	        	 }
	        	 out += '</span></td>';
	        }
	      };
	      out += "</tr>";
	    };
	    out += '</tbody></table>';

	    // add link icon 
	    $(that.tableDockSelector+" .globe-field").before()

	    // output table html
	    that.tableDockElem.html(out);

	    // click to sort
	    $(that.tableDockSelector+" [data-sorter]").click( function(){
	      let sortBy = $(this).attr('data-sorter');
	      let params = JSON.parse( JSON.stringify(that.lastSearch || {}) );
	      params.sortBy = sortBy;
	      that.renderTable( params );
	    } );

	    // click to add
	    $(that.tableDockSelector+" .add-new-item").click(function(){ that.addForm.J.dialog( "open" ) });	

	    // click to edit
	    $(that.tableDockSelector+" .edit-field").click( function() {
	      let id = $(this).attr('data-id');
	      that.editForm.updateID = id;
	      that.editForm.editItem(id);

	    } );


	  }
	  db.getItems( that.db, callback, query);
	}
	

	// "Add" Form
	this.addForm = new Form(this, params.addForm);

	// "Edit" Form
	this.editForm = new Form(this, params.editForm);
	
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
	  this.renderTable( params );
	}

	this.searchBtnElem.click( this.search );

	this.searchBarElem.on('keypress', e => { if (e.keyCode == 13){ this.search() } } );

	// initialize table
	this.renderTable();
}




module.exports = Table;




