let app = FarmManager || {};

let panel = app.tabs.panelElems.crop;

// app has tables
app.tables = app.tables || {};

// it has a crops table
app.tables.crops = {};
let crops = app.tables.crops;

// it has these components:
crops.search = {
	elem: $('<div></div>').appendTo(panel)
};
crops.add = {
	elem: $('<div></div>').appendTo(panel)
};
crops.output = {
	elem: $('<div></div>').appendTo(panel)
};



require('../crops/output.js');
require('../crops/add.js');
// require('../crops/create.js');
// require('../crops/update.js');