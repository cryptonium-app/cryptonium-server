'use strict';

/**
 * Module : updater
 * Description : Regulary fetches latest data for ICOs and Ether Scams
 * Author : sagarkarira1992@gmail.com
 * Created : 17/11/17
 */

const Promise = require('bluebird');
const redisClient = require('../libs/redis');

const request = require('request');
const rp = require('request-promise');
const logging = require('../libs/logging');
const parameters = require('./parameters');

const logconf = {
	loggingEnabled : true
};

const UPDATE_INTERVAL = 1000 * 60 * 100  // 15 minutes

updater(logconf)
		.then(()=>{
			logging.trace(logconf, `Fetched data from API list`);
		})
		.catch((error)=>{
			logging.error(logconf, error);
		});

setInterval(function(){
	updater(logconf)
		.then(()=>{
			logging.trace(logconf, `Fetched data from API list`);
		})
		.catch((error)=>{
			logging.error(logconf, error);
		});

}, UPDATE_INTERVAL);

function makeDataList(logconf) {
	const {icoApi, etherScamApi, redisKey } = parameters;
	const dataList = [];

	Object.keys(icoApi).forEach((key)=>{
		dataList.push({
			url : icoApi[key],
			key : redisKey[key]
		});
	});

	Object.keys(etherScamApi).forEach((key)=>{
		dataList.push({
			url : etherScamApi[key],
			key : redisKey[key]
		});
	});
	logging.trace(logconf, dataList );
	return dataList;
}


async function updater(logconf) {
	const dataList = makeDataList(logconf);
	for (var index in dataList) {
		await addToRedis(logconf, dataList[index]);
	}
	return;
}

async function addToRedis(logconf, dataObject ) {
	const {url, key} = dataObject;
	logging.trace(logconf, `Fetching from ${url}`);
	const response = await rp.get(url);
	await redisClient.setAsync(key, response);
	logging.trace(logconf, `Data added to redis key : ${key}`);
	return;
}