'use strict';

/**
 * Module : scam
 * Description : Scam search and analysis related APIs
 * Author : sagarkarira1992@gmail.com
 * Created : 17/11/17
 */

module.exports = {
	analysis
};

const Promise = require('bluebird');
const request = require('request');
const rp = require('request-promise');
const _ = require('lodash');

const redisClient = require('../libs/redis');
const logging = require('../libs/logging');
const utils =  require('./utils');
const parameters = require('./parameters');
const dbHandlerPromisified = require('./dbHandler').dbHandlerPromisified;

const logconf = {
	loggingEnabled : true
};

/**
 * Provides total number of scams in our database  
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function analysis(req, res) {
	logging.trace(logconf, 'Scam Data analysis', req.body, req.query);
	analysisInternal(logconf).then((result)=>{
		const response = {
			flag : 200, 
			data : result
		};
		return utils.sendGzippedResponse(logconf, response, res);
	});
}

/**
 * Searches for a particular scam in our db
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
// function search(req, res) {
// 	logging.trace(logconf, 'Scam Search', req.body, req.query);
// 	const url = req.query.url;
// 	const etherScamResult  = await searchInEtherScam(logconf, url);
// 	if (etherScamResult === 0) {
// 		let response = {
// 			flag : 200, 
// 			message : 'No scam found', 
// 			data : []
// 		};
// 		return res.send(response);
// 	}

// 	let response = {
// 		flag : 200, 
// 		message : 'Careful, Scam found',
// 		data : etherScamResult
// 	};
// 	return res.send(response);
// }

// async function searchInEtherScam(logconf, url) {
// 	const scamRedisKey = paramerts.redisKeys.SCAMS;
// 	let scamData = await redisClient.getAsync(scamRedisKey);
// 	scamData = JSON.parse(scamData);
// 	_.find(scamData, _.matchesProperty('domain', url));
// }


async function analysisInternal(logconf) {
	const scamsKey = parameters.redisKey.SCAMS;
	const walletAddressKey = parameters.redisKey.ADDRESSES;
	const domainsListedKey = parameters.redisKey.DOMAINS;

	const internalData = await internalScams(logconf);

	const scamData = await redisClient.getAsync(scamsKey);
	const walletAddressData = await redisClient.getAsync(walletAddressKey);
	
	const totalScams = JSON.parse(scamData).length + internalData[0].total_scams;
	
	const activeScamData = JSON.parse(scamData).filter((obj)=>{
		if (obj.status[0] && obj.status[0].status === 'Active') {
			return true;
		}
	});
	const activeScams = activeScamData.length + internalData[0].active_scams;
	const walletAddresses =  JSON.parse(scamData).length + internalData[0].wallet_addresses;
	const inactiveScams = totalScams - activeScams;
	
	return {
		totalScams, 
		activeScams, 
		inactiveScams, 
		domainsListed
	};
}

function internalScams(logconf) {
	let query = 
	`
		select 
			ifnull(count(*), 0) as total_scams, 
			ifnull(count(case when status = 1 then scam_id end) ,0) as active_scams, 
			ifnull(count(case when url is not null then scam_id end) ,0) as wallet_addresses
		from 
			tb_scam
	`;

	let queryObj = {
	    query: query,
	    args: [],
	    event: "Get Data from scam internally in our database"
	};
	return dbHandlerPromisified.executeQuery(logconf, queryObj);
}
