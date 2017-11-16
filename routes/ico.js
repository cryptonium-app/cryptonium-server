'use strict';

module.exports = {
	allICO
};

const Promise = require('bluebird');
const request = require('request');
const rp = require('request-promise');

const redisClient = require('../libs/redis');
const logging = require('../libs/logging');
const utils =  require('./utils');
const parameters = require('./parameters');

const logconf = {
	loggingEnabled : true
};

function allICO(req, res) {
	logging.trace(logconf, ' Get All ICOs', req.body, req.query);
	const key = parameters.redisKey.ALL_ICO;
	redisClient.getAsync(key).then((data)=>{
		const response = {
			flag : 200, 
			data : JSON.parse(data).ico
		};
		return utils.sendGzippedResponse(logconf, response, res);
	})
	
}