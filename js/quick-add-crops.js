quickAdd = [

	// Brassicas
	{name: "kale", latinName:"Brassica oleracea", family: "brassicaceae", spacing: 12, dtm: 47, link: "https://en.wikipedia.org/wiki/Kale"},
	{name: "broccoli", latinName:"Brassica oleracea", family: "brassicaceae", spacing: 12, dtm: 58, link: "https://en.wikipedia.org/wiki/Broccoli"},
	{name: "cabbage", latinName:"Brassica oleracea", family: "brassicaceae", spacing: 12, dtm: 58, link: "https://en.wikipedia.org/wiki/Cabbage"},
	{name: "cauliflower", latinName:"Brassica oleracea", family: "brassicaceae", spacing: 12, dtm: 58, link: "https://en.wikipedia.org/wiki/Cauliflower"},
	{name: "brussel sprouts", latinName:"Brassica oleracea", family: "brassicaceae", spacing: 12, dtm: 58, link: "https://en.wikipedia.org/wiki/Brussels_sprout"},
	{name: "kohlrabi", latinName:"Brassica oleracea", family: "brassicaceae", spacing: 12, dtm: 58, linl: "https://en.wikipedia.org/wiki/Kohlrabi"},
	{name: "bok choi / pak choi", latinName:"Brassica rapa", family: "brassicaceae", spacing: 12, dtm: 58, link: "https://en.wikipedia.org/wiki/Bok_choy"},

	// Apiaciaes
	{name: "carrots", latinName:"Daucus carota", family: "apiaceae", spacing: 1, dtm: 62, link: "https://en.wikipedia.org/wiki/Carrot"},

	// Alliums
	{name: "onion", latinName:"Allium cepa", family: "amaryllidaceae", spacing: 1, dtm: 111, link: "https://en.wikipedia.org/wiki/Onion"},


].sort((a, b)=>{ return a.name > b.name });

module.exports = quickAdd;