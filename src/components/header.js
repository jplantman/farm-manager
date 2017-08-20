let app = FarmManager || {};
// init app header
app.header = {};
let header = app.header;
header.elem = $('<header></header>')
	.appendTo(app.elem)
	.css('background', 'lightgrey')
	.css('border-bottom', '1px solid grey')
	.css('height', '24px')
	.css('padding', '2px')
	.css('width', '100%');

// container wihin header
header.container = $('<div class="container"></div>')
	.appendTo(header.elem)

// header title
$('<h1 class="header">'+
	'<i class="fa fa-globe" aria-hidden="true"></i>'+
	' Farm Savers Farm Manager </h1>')
	.appendTo(header.container)
	.css('margin', '0')
	.css('padding', '0')
	.css('display', 'inline-block')
	.css('font-size', '1em')
	.css('font-weight', 'bold');

// Timer
header.timer = {};
let timer = header.timer;

// create timer elem
timer.elem = $('<div></div>').appendTo(header.container)
	.css('float', 'right')
	.css('margin-right', '4px');

// timer ticks
timer.tick = ()=>{
	let d = new Date();
	timer.elem.html( d.toLocaleTimeString()+ ' - ' + d.toString().substr(0, 15) );
}
// initial tick
timer.tick();

// tick interval
timer.interval = setInterval( timer.tick, 1000 );


