"use strict";

function Form(parentTable, params){
	let parent = parentTable;
	let that = this;


	this.selector = params.selector;
	this.elem = $(this.selector);
	this.html = params.HTML;
	this.elem.html( this.html );
	this.validateTips = $( this.selector+' .validate-tips' )
		
		// get element for each field
	this.fields = {};
	for (var i = 0; i < parent.fields.length; i++) {
		this.fields[ parent.fields[i][0] ] = $(this.selector+' [name="'+parent.fields[i][0]+'"]');
	};
	if (params.beforeComplete){
		params.beforeComplete();
	}
		// Prepare for Jquery Modal Form //
	if (params.clearAssist){
		this.clearAssist = params.clearAssist;
	}
	
	// Clear Add Form
	this.clear = function(){
		for( let prop in that.fields){
			that.fields[prop].val("");
		}
		if (that.clearAssist){
			that.clearAssist();
		}
	};

	this.submit = function(){

		// hardcoded to validate name length and name regexp only... subject to change
	  let valid = that.validateLength(that.fields.name, "Name", 3, 20, that.validateTips);

	  valid = valid && that.validateRegexp(
  			that.fields.name, 
  			/^[a-z]([0-9a-z_\-\s])+$/i, 
  			"Name may consist of a-z, 0-9, underscores, dashes, spaces and must begin with a letter.", 
  			that.validateTips
  		);

	  if ( valid ){

	  	let newItem = {};
	  	for (var i = 0; i < parent.fields.length; i++) {
	  		let field = parent.fields[i][0];
	  		newItem[field] = that.fields[field].val();
	  	};

	    db.addItem( parent.db, newItem, (newItem)=>{
	      let params = JSON.parse( JSON.stringify(parent.lastSearch) );
	      params.highlight = newItem;
	      parent.createTable( params );
	    } );
	    that.clear();
	    that.J.dialog('close');
	    
	    
	  }
	}

	// Init Jquery Modal Form //
	this.J = $( this.selector ).dialog({
	  autoOpen: false,
	  height: 600,
	  width: 400,
	  modal: true,
	  buttons: that.btnsSet('add')
	});
	$( params.openBtnSelector ).click(function(){ that.J.dialog( "open" ) });

}



Form.prototype.validateLength = function(elem, title, min, max, tipElem){
	let length = elem.val().length;
	if ( length < min || length > max ){
		elem.addClass( "ui-state-error" ); 
		setTimeout(function() {
		    elem.removeClass( "ui-state-error", 1500 )
		}, 500 );
		this.updateTips( "Length of "+title+" must be between "+min+" and "+max+".", tipElem);
		return false;
	} else {
		return true;
	}
};
Form.prototype.validateRegexp = function(elem, regexp, errMsg, tipElem){
	if ( !( regexp.test( elem.val() ) ) ) {
	    elem.addClass( "ui-state-error" );
	    setTimeout(function() {
	    elem.removeClass( "ui-state-error", 1500 );
	  }, 500 );
	    if (errMsg && tipElem){
	    	this.updateTips( errMsg, tipElem );
	    }
	    return false;
	  } else {
	    return true;
	  }
};
Form.prototype.updateTips = function(tipText, tipElem){
  tipElem
    .text( tipText )
    .addClass( "ui-state-highlight" );
  setTimeout(function() {
    tipElem.removeClass( "ui-state-highlight", 1500 );
  }, 500 );
};

Form.prototype.btnsSet = function(set){
	if (set == 'add'){
		return {
	    	"Add": this.submit,
	    	Cancel: function(){
	    		this.clear();
	    		this.J.dialog('close');
	    	},
	    	Clear: this.clear
	    };
	} else if (set == 'edit'){

	}
}

module.exports = Form;
