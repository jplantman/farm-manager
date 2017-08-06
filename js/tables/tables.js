validator = require("validator");

// Helper File for Tables

exports.sort = function(mainTableObj, params, docs){
	if (params.sortBy){ // if params include soryBy,
      if (mainTableObj.lastSort == params.sortBy){ // if last sorted in this way, sort in reverse order
        docs.sort( (a, b)=>{ return a[params.sortBy] < b[params.sortBy] } );
        mainTableObj.lastSort = null; // clear sort history
      } else { // else, sort in normal order
        docs.sort( (a, b)=>{ return a[params.sortBy] > b[params.sortBy] } );
        mainTableObj.lastSort = params.sortBy;
      }
    }
    return docs;
}

exports.fillTemplate = function(arr, template){
	html = ""; // fill in template with data from array of objects (eg "hello {{name}}"" => "hello Bob")
	for (let i = 0; i < arr.length; i++) {
		let temp = template;
		for (let prop in arr[i]){
			let str = '{{'+prop+'}}';
			let regexp = new RegExp(str, 'g');
			let replacement = arr[i][prop];	
			temp = temp.replace(regexp, replacement);
		}
		html += temp;
	};
	return html;
}



// Get Field Elements Function //
exports.genFieldElems = function(mainTableObj, formID){ // eg (gardens, '#garden-form')
	let obj = {};
	for (var i = 0; i < mainTableObj.fieldsData.length; i++) {
		let field = mainTableObj.fieldsData[i];
		obj[field.n] = $(formID+' [name="'+field.n+'"]');
	};
	return obj;
}

// Add Item Function //
exports.addItem = function(mainTableObj, formStr, multiAdd ){ 
	// multiAdd is an array with the field name and the value, eg. ['name', '1']
	if ( !t.isValid(mainTableObj, formStr ) ){ return }
		
  	let newItem = {}; // fill obj with data from fields
  	for (var i = 0; i < mainTableObj.fieldsData.length; i++) {
  		let fieldN = mainTableObj.fieldsData[i].n;
  		let fieldVal = mainTableObj[formStr].fieldElems[mainTableObj.fieldsData[i].n].val();
  		newItem[fieldN] = fieldVal;
  	};

  	//modify multiplier field (eg. if adding items where name = 1, 2, and 3)
  	if (multiAdd){
  		newItem[ multiAdd[0] ] = multiAdd[1];
  	}

    db.addItem( mainTableObj.db, newItem, (newItem)=>{
      let params = JSON.parse( JSON.stringify(mainTableObj.lastSearch) );
      params.highlight = newItem._id;
      ft.fetchTable(mainTableObj.db, mainTableObj, params );
    } );
    if (!multiAdd){ t.clear(mainTableObj, formStr) } // this part must be done manually when doing multi-adds
    mainTableObj[formStr].J.dialog('close');  
}

// Form Functions //
exports.clear = function(mainTableObj, formStr){
	for (let prop in mainTableObj[formStr].fieldElems){
		mainTableObj[formStr].fieldElems[prop].val("");
		mainTableObj.addForm.tipsElem.html("");
		mainTableObj.editForm.tipsElem.html("");
	}
}

exports.editItem = function(mainTableObj, id){
	mainTableObj.editForm.currID = id; // store id of item being edited

	 db.getItem(mainTableObj.db, function(item){
		
		let fields = mainTableObj.editForm.fieldElems;
	 	for (let prop in fields){
	 		fields[prop].val( item[prop] );
	 	}

      }, {_id: id});

      mainTableObj.editForm.J.dialog('open');
}

exports.updateItem = function(mainTableObj){
	if ( !t.isValid(mainTableObj, "editForm" ) ){ return }
	let query = { _id: mainTableObj.editForm.currID };

	let updated = {}; // fill obj with data from form fields
	mainTableObj.fieldsData.forEach( (fieldData)=>{
		let field = mainTableObj.editForm.fieldElems[fieldData.n];
		updated[fieldData.n] = field.val();
	} );

    db.updateItem( mainTableObj.db, query, updated, {}, (updatedItem)=>{
      let params = JSON.parse( JSON.stringify(mainTableObj.lastSearch) );
      params.highlight = query._id;
      ft.fetchTable(mainTableObj.db, mainTableObj, params )
    } );
    mainTableObj.editForm.J.dialog('close');
}

exports.deleteItem = function(mainTableObj){
	let database = mainTableObj.db;
	let id = mainTableObj.editForm.currID;

	// check for no delete
	db.getItem(mainTableObj.db, (item)=>{
		if (item.noDelete){ // can't delete

			alert("This item can't be deleted.");

		} else { // delete item

			let conf = confirm("Are you sure you want to delete this "+mainTableObj.title+"?");
			if (!conf){ return }

			
			db.deleteItem(database, id, ()=>{
		        ft.fetchTable(mainTableObj.db, mainTableObj, mainTableObj.lastSearch )

				mainTableObj.editForm.J.dialog("close");
			});

		}
	}, {_id: id});

	
}


exports.getSelectMenuOptions = function(thisForm, otherTable){
	db.getItems( db.list[otherTable+'DB'], function(docs){
		//if (docs.length === 0){ throw('no families found... families should auto populate, but that must have failed.'); return; }
		let html = '<option value=""></option>';
		for (var i = 0; i < docs.length; i++) {
			html += '<option value="'+docs[i]._id+'">'+docs[i].name+'</option>';
		};
		$(thisForm+' [name="'+otherTable+'ID"]').html(html);
	}, {});
}







// Form Validator Functions //
exports.isValid = function(mainTableObj, formStr ){
	
	//validate	
	let fieldsData = mainTableObj.fieldsData;
	let fieldElems = mainTableObj[formStr].fieldElems;
	let tipsElem = mainTableObj[formStr].tipsElem;

	let valid = true;
	for (var i = 0; i < fieldsData.length; i++) {
		if (fieldsData[i].l){ 
			valid = valid &&
				validLength( fieldElems[fieldsData[i].n], fieldsData[i].t, fieldsData[i].l[0], fieldsData[i].l[1], tipsElem ) }
		if (fieldsData[i].u){
			valid == valid &&
				validURL(fieldsElems[i]), tipsElem }
		if ( !valid ){ return false }
	};
	return valid
}

let validLength = function(elem, title, min, max, tipElem){
	let length = elem.val().length;
	if ( length < min || length > max ){
		elem.addClass( "ui-state-error" ); 
		setTimeout(()=>{ elem.removeClass( "ui-state-error", 1500 ) }, 500);
		updateTips( "Length of '"+title+"' must be between "+min+" and "+max+". <br/>(it was "+elem.val().length+")", tipElem );
		return false;
	}; return true;
}

let validURL = function(elem, tipElem){
	if ( !validator.isURL( elem.val() ) && elem.val() != '' ){
		elem.addClass( "ui-state-error" ); 
		setTimeout(()=>{ elem.removeClass( "ui-state-error", 1500 ) }, 500);
		updateTips( "" );
		return false;
	}; return true;
}

let updateTips = function(tipText, tipElem){ // update validate tips
  tipElem.html( tipText ).addClass( "ui-state-highlight" );
  setTimeout(()=>{ tipElem.removeClass( "ui-state-highlight", 1500 ) }, 500 );
};






