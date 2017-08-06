let getTableHTML = function(mainTableObj, docs, params){ // used in fetchTable()
	// Add New Item Btn
    let html = "<div class='add-new-item ui-button flt-r mr'>Add New "+mainTableObj.title+"</div>";
    // Add Table Title
    html += "<h1>"+mainTableObj.title+" <small>("+docs.length+")</small></h1>";
    // Begin Table Head
    html += "<table class='table'><thead><tr>";
    // Add each table header
    let visFields = mainTableObj.fieldsData.filter( d=> !d.noAppear ); // use only field data that is meant to appear
    visFields.forEach( (field)=>{ 
    	html += "<th ";
        html += field.tt ? " title='"+field.tt+"'" : "";
        html += "><span data-sorter='"+field.n+"'>" + field.t + "</span>";
        html += field.adding ? "<span class='add-col' data-adder='"+field.n+"'>+</span>" : "";
        html += "</th>";
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
    		html += doc[field.n] || '';
    		html += '</span></td>';
    	} );
    	html += '</tr>'; // close row
    } );

    
    return html;
    
}

// Fetch Table Function // (datastore assumed to be up to date)
exports.fetchTable = function(mainTableObj, params={}){
    
    // Fill in human-readable text into ID fields //
    
    let data = JSON.parse(JSON.stringify(db.datastore[mainTableObj.name]));
    if (mainTableObj.fieldsMetaData && mainTableObj.fieldsMetaData.idFields){ // if it has id fields
        data.forEach( (item, i)=>{ // for each item,
            mainTableObj.fieldsData.forEach( (fieldData)=>{ // for each field,
                if ( /ID/.test(fieldData.n) ){  // if it is an id field,
                    if (item[fieldData.n]){ // if that field isn't blank
                        // get the referenced db
                        let refDB = db.datastore[fieldData.n.replace('ID', '')];
                        // get the referenced item
                        let refItem = findByID(refDB, item[fieldData.n]); // item[fieldData.n] is the id string
                        if ( refItem ){
                            // get the human-readable string //
                            let hrStr;
                            if (typeof fieldData.shows == 'string'){
                                hrStr = refItem[fieldData.shows];
                            } else if (typeof fieldData.shows == 'function') {
                                hrStr = fieldData.shows(refItem);
                            } else {
                                hrStr = refItem['name'];
                            }
                            
                            data[i][fieldData.n] = hrStr || "none";
                        }
                    }
                }
            } );
        } );
    }

    // Sort //

    data = t.sort(mainTableObj, params, data);

    // Search Filter //

    // All Fields Search
    if (params.allFields){ // only keep data in which one or more of the field values matches the regexp
        data = data.filter( (item)=>{ 
            for( let prop in item ){ 
                if ( params.allFields.test( item[prop] ) ){
                    return true;
                }
            }
            return false;
        } );
    }

    // Search By Field
    if (params.query){
        for (let prop in params.query){ // for each specified search query
            data = data.filter( (item)=>{ // filter for matches
                if ( params.query[prop].re.test(item[prop]) ){
                    if (params.query[prop].not){
                        return false;
                    } else {
                        return true;
                    }
                } 
                else { 
                    if (params.query[prop].not){
                        return true;
                    } else {
                        return false;
                    }
                }
            } );
        }
    }

    // Store History //
 
    mainTableObj.lastSearch = params;
    mainTableObj.lastResults = data;

    // Get Table HTML //
    let html = getTableHTML(mainTableObj, data, params);
    mainTableObj.tableElem.html( html );

    // Add Clicks //

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
        ft.fetchTable(mainTableObj, params );
    } );

    // Click to add col
    $(mainTableObj.panelID+" .add-col").click( function(){
        let field = $(this).attr('data-adder');
        let sum = 0;
        mainTableObj.lastResults.forEach( (item)=>{ sum += Number(item[field]) } );
        alert('Total: '+sum);
    } );
} // end showTable()

noFalse = function(obj){ // checks that each property is not false
	for( let prop in obj ){ if (obj[prop] == false){ return false } }
	return true;
}













