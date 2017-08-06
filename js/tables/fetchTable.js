let getTableHTML = function(mainTableObj, docs, params, idData){ // used in fetchTable()
	// Add New Item Btn
    let html = "<div class='add-new-item ui-button flt-r mr'>Add New "+mainTableObj.title+"</div>";
    // Add Table Title
    html += "<h1>"+mainTableObj.title+" <small>("+docs.length+")</small></h1>";
    // Begin Table Head
    html += "<table class='table'><thead><tr>";
    // Add each table header
    let visFields = mainTableObj.fieldsData.filter( d=> !d.noAppear ); // use only field data that is meant to appear
    visFields.forEach( (field)=>{ 
    	html += "<th data-sorter='"+field.n+"'";
        html += field.tt ? " title='"+field.tt+"'" : "";
        html += ">" + field.t + "</th>";
     } );
    // End Table Head
    html += "</tr></thead><tbody>";
    // Add Rows
    docs.forEach( (doc, d)=>{
    	// Check To Highlight Row
    	if ( params.highlight == doc._id ){ 
    		html += "<tr class='ui-state-highlight'>";
    		setTimeout( ()=>{ $('.ui-state-highlight').removeClass( "ui-state-highlight", 1500 ) }, 500 );
    	} else { 
    		html += "<tr/>"
    	}
    	// Fill Out Table Data
    	visFields.forEach( (field, f)=>{
    		html += '<td>';
    		html += (f === 0 && field.linkBefore ? '<a href="'+doc.link+'" target="_blank" title="search online"><i class="fa fa-globe flt-l hover mr-s" aria-hidden="true"></i></a>' : '');
    		html += '<span';
    		html += (f === 0 ? ' data-edit="'+doc._id+'" title="edit" ' : '');
    		html += (field.c ? ' class="'+field.c+'" ' : '');
    		html += '>';
    		if ( field.isID ){ // is id, get name from id
    			let arr = idData[field.isID];
    			let id = doc[field.n];
    			let relatedDoc = findByID(arr, id)
    			html += relatedDoc ? relatedDoc.name : "";
    			
    		} else { // if name, use name
    			html += doc[field.n] || '';	
    		}
    		html += '</span></td>';
    	} );
    	html += '</tr>'; // close row
    } );

    
    return html;
    
}

// Fetch Table Function //
exports.fetchTable = function(database, mainTableObj, params={}){
	// Set Up parameters for DB call
	let query = params.query || {};
	let idData = {};
	let callback = function(docs){ // this will happen once all ID data is gotten
		// store search history
		mainTableObj.lastSearch = params;
		mainTableObj.lastResults = docs;

		// SORT
	    docs = t.sort(mainTableObj, params, docs);

	    // All Fields Search
	    if (params.allFields){ // only keep docs in which one or more of the field values matches the regexp
	    	docs = docs.filter( (doc)=>{ 
	    		for( let prop in doc ){ 
	    			if ( params.allFields.test( doc[prop] ) ){
	    				return true;
	    			}
	    		}
	    		return false;
	    	} );
	    }

	    // Create Table HTML
	    let html = getTableHTML(mainTableObj, docs, params, idData);

    	// Show Table HTML
	    mainTableObj.tableElem.html( html );

	    // Click to open add form
    	$(mainTableObj.panelID+' .add-new-item').click( ()=>{ mainTableObj.addForm.J.dialog("open"); } );

    	// Click to open edit form
    	$(mainTableObj.panelID+' [data-edit]').click( function(){ 
    		let id = $(this).attr('data-edit');
    		t.editItem(mainTableObj, id)
    	 } );

    	// Click to sort
    	$(mainTableObj.panelID+" [data-sorter]").click( function(){
    		let params = mainTableObj.lastSearch;
		    params.sortBy = $(this).attr('data-sorter');
		    ft.fetchTable(mainTableObj.db, mainTableObj, params );
    	} );
	} // callback function complete

	// check if there will be IDs to fill
    if ( mainTableObj.fieldsMetaData && mainTableObj.fieldsMetaData.idFields ){
    	// if so, get idData for each one
    	let idFields = mainTableObj.fieldsMetaData.idFields;
    	idFields.forEach( (idField)=>{ // prepare idData obj
    		idData[idField] = false; // make each property == false. when each prop becomes true, the data is ready
    	} );
    	for (let field in idData){ // get idData for each field in idData
    		db.getItems(db.list[field+'DB'], (data)=>{
    			idData[field] = data;
    			if ( noFalse(idData) ){ // if all data is ready, get the items
    				db.getItems( database, callback, query);
    			}
    		}, {});
    	}
    } else {
    	// just call to DB normally, don't bother getting ID data.
    	db.getItems( database, callback, query);
    }


	
	
} // end showTable()

noFalse = function(obj){ // checks that each property is not false
	for( let prop in obj ){ if (obj[prop] == false){ return false } }
	return true;
}

findByID = function(arr, id){
	for (var i = 0; i < arr.length; i++) {
		if (arr[i]._id == id){
			return arr[i];
		}
	};
}











