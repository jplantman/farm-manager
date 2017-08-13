const fs = require('fs');

let elem = $('#notes textarea');
let path = './db/notes.txt';

let data = fs.readFileSync(path).toString();

elem.html( data );

elem.on('input', function(){
	fs.writeFileSync(path, $(this).val());
} );





