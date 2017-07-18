function SIFD(ifd, min, max){ // standard input field data - adds regexp data and length limits data more easily to ifd objects
	ifd.r = /^[a-z]([0-9a-z_, \/\.\-\s])+$/i;
	ifd.rErr = "You can only use letters, numbers, spaces, commas, periods, /slashes, _underscores, and -dashes";
	if (min){
		ifd.limits = [min, max || 255];
	}
	
	return ifd;
}

module.exports = SIFD;