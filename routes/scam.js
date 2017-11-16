'use strict';

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

const logconf = {
	loggingEnabled : true
};

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

function search(req, res) {
	logging.trace(logconf, 'Scam Search', req.body, req.query);

}


async function analysisInternal(logconf) {
	const scamsKey = parameters.redisKey.SCAMS;
	const walletAddressKey = parameters.redisKey.ADDRESSES;
	const domainsListedKey = parameters.redisKey.DOMAINS;

	const scamData = await redisClient.getAsync(scamsKey)
	const walletAddressData = await redisClient.getAsync(walletAddressKey);
	const domainsData = await redisClient.getAsync(domainsListedKey);
	
	const totalScams = JSON.parse(scamData).length;
	
	const activeScamData = JSON.parse(scamData).filter((obj)=>{
		if (obj.status[0] && obj.status[0].status === 'Active') {
			return true;
		}
	});
	const activeScams = activeScamData.length;
	const walletAddresses =  JSON.parse(scamData).length;
	const domainsListed =  JSON.parse(domainsData).length;

	return {
		totalScams, 
		activeScams, 
		walletAddresses, 
		domainsListed
	};
}
