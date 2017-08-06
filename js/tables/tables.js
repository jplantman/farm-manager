validator = require("validator");

// Helper File for Tables

function lowercase(str){
	if (typeof str == 'string'){
		return str.toLowerCase();
	}
	return str;
}

function compareDate(a, b, gt){ // gt = greater than; if not true, less than
	a = a.split(/,? /);
	b = b.split(/,? /);
	// compare years
	if (a[2] > b[2]){
		return gt ? true : false;
	} else if (a[2] < b[2]){
		return gt ? false : true;
	}
	// compare months
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	if ( months.indexOf(a[1]) > months.indexOf(b[1]) ){
		return gt ? true : false;
	} else if ( months.indexOf(a[1]) < months.indexOf(b[1]) ){
		return gt ? false : true;
	}
	// compare day
	if (a[0] > b[0]){
		return gt ? true : false;
	} else {
		return true;
	}
}

exports.sort = function(mainTableObj, params, data){
	//check if this is a date field
	let isDate = /date/i.test(params.sortBy);

	if (params.sortBy){ // if params include soryBy,
      if (mainTableObj.lastSort == params.sortBy){ // if last sorted in this way, sort in reverse order
        data.sort( (a, b)=>{ 
        	return  !isDate ? lowercase(a[params.sortBy]) < lowercase(b[params.sortBy]) : compareDate(a[params.sortBy], b[params.sortBy], false);
        } );
        mainTableObj.lastSort = null; // clear sort history
      } else { // else, sort in normal order
        data.sort( (a, b)=>{ 
        	return !isDate ? lowercase(a[params.sortBy]) > lowercase(b[params.sortBy]) : compareDate(a[params.sortBy], b[params.sortBy], true);
        } );
        mainTableObj.lastSort = params.sortBy;
      }
    }
    return data;
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
      db.refreshDatastore( ()=>{
      	ft.fetchTable(mainTableObj, params );	
      } );
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
	 	
	 	if ( mainTableObj.editForm.onOpen ){ mainTableObj.editForm.onOpen(item); }
      	mainTableObj.editForm.J.dialog('open');

      }, {_id: id});

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
      db.refreshDatastore( ()=>{
      	ft.fetchTable(mainTableObj, params );	
      } );
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
		        db.refreshDatastore( ()=>{
			    	ft.fetchTable(mainTableObj, params );	
			    } );

				mainTableObj.editForm.J.dialog("close");
			});

		}
	}, {_id: id});

	
}


exports.getSelectMenuOptions = function(thisForm, otherTable, showFunc, callback){
	let html = '<option value=""></option>';
	let data = db.datastore[otherTable];
	data.forEach( (item)=>{
		html += '<option value="'+item._id+'">'+
		( showFunc ? showFunc(item) : item.name  )
		+'</option>';
	} );

	if (callback){
		callback( $(thisForm+' [name="'+otherTable+'ID"]').html(html) );
	} else {
		$(thisForm+' [name="'+otherTable+'ID"]').html(html);
	}
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


// Search Functions //

exports.search = function(mainTableObj){
	let params = {
 		query: t.getSearchQuery(mainTableObj) // advanced query
	}
	let afVal = mainTableObj.allFieldsSearchElem.val();
	if (afVal != ""){
		params.allFields = new RegExp (afVal, 'i'); // all fields search	
	}
    ft.fetchTable(mainTableObj, params);
}

exports.getSearchQuery = function(mainTableObj){
	let query = {};
	for (let i in mainTableObj.advSearchFields){
		let val = mainTableObj.advSearchFields[i].val();
		if (val != ""){
			query[i] = {
				re: new RegExp(val, 'i'),
				not: mainTableObj.advSearchFields[i].next().prop('checked')
			};
		}
	}
	return query;
}




