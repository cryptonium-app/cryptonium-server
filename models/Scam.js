'use strict';

/**
 * @module Report Model
 */

const Promise = require('bluebird');
const Joi = require('joi');
const utils = require('../routes/utils');

const dbHandlerPromisified = require('../routes/dbHandler').dbHandlerPromisified;
// const logging = require('../libs/logger');

const MODEL_NAME = 'Scam';
const TABLE = 'tb_scam';
const columns = [
    'scam_id', 
    'title', 
    'report_id', 
    'category', 
    'subcategory',
    'coin', 
    'url', 
    'wallet_address', 
    'status', 
    'created_at'
];

const PRIMARY_KEY = 'scam_id';
const FILTERS = [
    'scam_id', 
    'report_id', 
    'coin', 
    'url', 
    'wallet_address', 
    'status'
];

exports.view = (logconf = {}, opts = {}) => {
    return new Promise((resolve, reject) => {
        
        let { whereClause, args } = utils.extendQueryForFilters(FILTERS, opts);
        let query = `select ${columns.join(',')}  from ${TABLE} ${whereClause}`;
        let queryObj = {
            query: query,
            args: args,
            event: `View query for ${MODEL_NAME} model`
        };

        dbHandlerPromisified
            .executeQuery(logconf, queryObj)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.insert = (logconf = {}, insertInfo) => {
    return new Promise((resolve, reject)=>{
        const schema = Joi.object().keys({
            title : Joi.string().required(), 
            report_id : Joi.string().required() , 
            category : Joi.number().required(), 
            coin : Joi.string().required(), 
            status : Joi.number().required(), 
            url : Joi.string().required(), 
            wallet_address : Joi.string().allow(null), 
        });

        const validation = Joi.validate(insertInfo, schema);

        if (validation.error) {
            let errorName = validation.error.name;
            let errorReason = validation.error.details !== undefined
                ? validation.error.details[0].message 
                : 'Parameter missing or parameter type is wrong';
            return reject(new Error( errorName + ' ' +  errorReason));
 
        }
        let query = `insert into ${TABLE} set ?`;
        let queryObj = {
            query: query,
            args: [insertInfo],
            event: `Insert query for ${MODEL_NAME} model`
        };

        dbHandlerPromisified
            .executeQuery(logconf, queryObj)
            .then((result) => {
                resolve(result.insertId);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

