let app = FarmManager || {};

let panel = app.tabs.panelElems.family;

// app has tables
app.tables = app.tables || {};

// it has a families table
app.tables.families = {};
let families = app.tables.families;

// it has these components:

families.search = { elem: $('<div></div>').appendTo(panel) };

families.add = { elem: $('<div></div>').appendTo(panel) };

families.edit = { elem: $('<div></div>').appendTo(panel) };

families.output = { elem: $('<div></div>').appendTo(panel) };

console.log('TEST FAMILIES')
require('../families/add.js');
require('../families/edit.js');
require('../families/output.js');
require('../families/search.js');

// require('../families/create.js');
// require('../families/update.js');