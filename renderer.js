// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

window.findByID = function(arr, id){
	for (var i = 0; i < arr.length; i++) {
		if (arr[i]._id == id){
			return arr[i];
		}
	};
}

// Error messages as alerts
window.addEventListener("error", (err)=>{
	alert(err.error.message+err.error.stack );
}, true);

window.$ = window.jQuery = require('./resources/jquery-3.1.1.min.js');

require('./resources/jquery-ui-1.12.1/jquery-ui.min.js');
require('./resources/multi-select/js/jquery.multi-select.js');
$( "#tabs" ).tabs();
$('.main-accordions').accordion({
      collapsible: true
    });

// to open links in default browser
const shell = require('electron').shell;

require('./js/extras/dateTime.js');
require('./js/extras/notes.js');

db = require('./js/database.js');

db.refreshDatastore( ()=>{
	t = require('./js/tables/tables.js');
	ft = require('./js/tables/fetchTable.js');

	require('./js/tables/gardens.js');
	require('./js/tables/families.js');
	require('./js/tables/taskTypes.js');

	require('./js/tables/workers.js');
	require('./js/tables/crops.js');
	require('./js/tables/rows.js');
	require('./js/tables/tasks.js');

	$( ".datepicker").datepicker({ changeMonth: true, changeYear: true, dateFormat: "dd M, yy" });
	$( document ).tooltip();
	$('#my-select').multiSelect({
		afterSelect: function(){
			console.log( $('#my-select').val() )
		}
	});

} );







// assuming $ is jQuery
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
});








// Open Window
// const path = require('path');
// const remote = require('electron').remote;
// const BrowserWindow = remote.BrowserWindow;

// $('[data-window]').click( function(e){

// 	let newWindow = $(this).attr('data-window');
// 	console.log(newWindow);

// 	const modalPath = path.join('file://', __dirname, '/windows/'+newWindow+'.html')
// 	let win = new BrowserWindow({ width: 600, height: 600 })
// 	win.on('close', function () { win = null })
// 	win.loadURL(modalPath)
// 	win.show()

// 	if ( $(this).attr('data-close-on-click') ){
// 		remote.getCurrentWindow().close();
// 	}

// } )