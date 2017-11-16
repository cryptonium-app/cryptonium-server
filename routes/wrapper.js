'use strict';

module.exports = {
	apiWrapper
};

const Promise = require('bluebird');
const request = require('request');
const rp = require('request-promise');
const _ = require('lodash');

const redisClient = require('../libs/redis');
const logging = require('../libs/logging');
const utils =  require('./utils');
const parameters = require('./parameters');

const DEFAULT_EXPIRE_TIME = 30  //30 seconds
const logconf = {};

function apiWrapper(req, res) {
    logging.trace(logconf, 'API WRAPPER',  req.body, req.query, req.params);
    const url = req.query.url;
    const refresh = req.query.refresh || 0;
    const expireTime = req.query.expireTime || DEFAULT_EXPIRE_TIME;
    
    apiWrapperInternal(logconf, url, refresh, expireTime).then((response)=>{
    	return res.send(response);
    })
    .catch((error)=>{
    	logging.error(logconf, error);
    })
}

async function apiWrapperInternal(logconf, url, refresh, expireTime) {
	let key = `url:${url}`;
	let isExist = await redisClient.existsAsync(key);
	
	if (isExist == 1 && refresh == 0) {
		let data = await redisClient.getAsync(key); 
		return data;
	} 

	let response = await rp.get(url);
	await redisClient.setAsync(key, response );
	await redisClient.expireAsync(key, parseInt(expireTime));
    return response;
}