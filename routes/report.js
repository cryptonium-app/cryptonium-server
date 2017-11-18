'use strict';

/**
 * Module : report 
 * Description : Scam reports related CRUD api and methods
 * Author : sagarkarira1992@gmail.com
 * Created : 17/11/17
 */


module.exports = {
	insert
};

const Promise = require('bluebird');
const request = require('request');
const rp = require('request-promise');
const _ = require('lodash');

const redisClient = require('../libs/redis');
const logging = require('../libs/logging');
const utils =  require('./utils');
const parameters = require('./parameters');

const Report = require('../models/Report');

const logconf = {
	loggingEnabled : true
};

/**
 * Insert scam report submitted by the users
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function insert(req, res) {
	logging.trace(logconf, 'Insert Report', req.body);
	let data = req.body;
	Report
		.insert(logconf, data)
		.then(()=>{
			let response = {
				flag : 200, 
				message : 'Report inserted successfully'
			};
			return utils.sendGzippedResponse(logconf, response, res);
		})
		.catch((error)=>{
			logging.error(logconf, error);
			let response = {
				flag : 401 , 
				message : 'Something went wrong'
			};
			return utils.sendGzippedResponse(logconf, response, res);
		})
}