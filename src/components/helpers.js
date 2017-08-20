exports.capitalize = function(str){
	return str.replace(/\b\w/g, l => l.toUpperCase());
}

exports.uncapitalize = function(str){
	return str.replace(/\b\w/g, l => l.toLowerCase());
}

exports.isCap = function(char){ // used in next function
	return char.toUpperCase() == char;
}

exports.titleize = function(str){ // eg - 'helloThere' => 'Hello There';
	let arr = str.split('');
	for (let i = 0; i < arr.length; i++) {
		if ( h.isCap(arr[i]) ){
			arr.splice(i, 0, ' ');
			i++;
		}
	};
	return h.capitalize( arr.join('') );
}

exports.nameize = function(str){ // eg - 'Hello There' => 'helloThere'
	return h.uncapitalize( str.replace(' ', '') );
}