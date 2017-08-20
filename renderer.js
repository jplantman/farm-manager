window.$ = window.jQuery = require('jquery');

require('./resources/jquery-ui-1.12.1/jquery-ui.min.js');
require('./resources/chosen_v1.7.0/chosen.jquery.js');
require('./resources/chosen_v1.7.0/docsupport/prism.js');
require('./resources/chosen_v1.7.0/docsupport/init.js');

// initialize application
FarmManager = {};

// init helpers file
h = require('./src/components/helpers.js');

// create app container 
FarmManager.elem = $('body');

// load up datastore
require('./src/components/database.js');
FarmManager.refreshDatastore( ()=>{

	// require app components in order
	require('./src/components/header.js');
	require('./src/components/tabs.js');
	require('./src/components/crops/crops.js');	

} );

