exports.currentForm; // 'crops', 'rows', 'tasks', etc...
exports.currentAction; // 'add', 'edit'


exports.searchParams = {}; 

updateTips = function( tips, t ) {
	console.log(tips);
  tips // element to update
    .text( t )
    .addClass( "ui-state-highlight" );
  setTimeout(function() {
    tips.removeClass( "ui-state-highlight", 1500 );
  }, 500 );
}

exports.checkLength = function( o, n, min, max, t ) {
  if ( o.val().length > max || o.val().length < min ) {
    o.addClass( "ui-state-error" );
    setTimeout(function() {
    o.removeClass( "ui-state-error", 1500 );
  }, 500 );
    if (t){    	
    	updateTips( t, "Length of " + n + " must be between " + min + " and " + max + "." );
    }
    return false;
  } else {
    return true;
  }
}

exports.checkRegexp = function( o, regexp, n, t ) {
  if ( !( regexp.test( o.val() ) ) ) {
    o.addClass( "ui-state-error" );
    setTimeout(function() {
    o.removeClass( "ui-state-error", 1500 );
  }, 500 );
    if (t){
    	updateTips( t, n );
    }
    return false;
  } else {
    return true;
  }
}