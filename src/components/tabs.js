let app = FarmManager || {};

// doc fragment
let df = document.createDocumentFragment();

// initialize tabs
app.tabs = {};
let tabs = app.tabs;
tabs.elem = $('<div class="container"></div>')
	.appendTo(df);
tabs.data = ['home', 'crop', 'family', 'row', 'garden', 'task', 'taskType', 'worker']; // list of tabs to create


// init tab buttons
tabs.buttonElems = {}
tabs.buttonsBarElem = $('<ul></ul>').appendTo(tabs.elem);
tabs.data.forEach( (tab)=>{ // for each tab data, create a button and append it to the buttons bar
	tabs.buttonElems[tab] = $('<li><a href="#'+tab+'">'+h.titleize(tab)+'</a></li>').appendTo(tabs.buttonsBarElem);
} );

// init tab panels
tabs.panelElems = {}
tabs.data.forEach( (tab)=>{ // for each tab data, create a panel
	tabs.panelElems[tab] = $('<div id="'+tab+'"></div>').appendTo(tabs.elem);
} );

// append doc fragment
app.elem[0].appendChild( df );

// apply jquery ui tabs
tabs.elem.tabs({ active: 0 }); // first tab starts active

