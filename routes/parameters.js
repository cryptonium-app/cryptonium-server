/**
 * Module : parameters 
 * Description : All the constants, hardcoded stuff goes here.
 * Author : sagarkarira1992@gmail.com
 * Created : 17/11/17
 */

// url from which ICO data is fetched 
exports.icoApi = {
	ALL_ICO : 'https://api.icowatchlist.com/public/v1/'
	// LIVE_ICO : 'https://api.icowatchlist.com/public/v1/live', 
	// UPCOMING_ICO : 'https://api.icowatchlist.com/public/v1/upcoming', 
	// FINISHED_ICO : 'https://api.icowatchlist.com/public/v1/finished'
};

// url from which ether scams are fetched
exports.etherScamApi = {
	SCAMS : 'https://etherscamdb.info/data/scams.json', 
	ADDRESSES : 'https://etherscamdb.info/data/addresses.json', 
	DOMAINS : 'https://etherscamdb.info/data/blacklist.json'
};

// keys for data saved in redis
exports.redisKey = {
	ALL_ICO : 'ico:all:', 
	// ICO_LIVE : 'ico:live:', 
	// UPCOMING_ICO : 'upcoming:ico:', 
	// finished_ico : 'finished:ico:',
	SCAMS : 'scams:', 
	ADDRESSES : 'addresses:', 
	DOMAINS : 'domains:'
};


exports.scamStatus = {
	0 : 'UNKNOWN', 
	1 : 'ACTIVE' , 
	2 : 'OFFLINE', 
	3 : 'SUSPENDED'
};
