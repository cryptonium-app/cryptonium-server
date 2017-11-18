'use strict';

/**
 * @module Report Model
 */

const Promise = require('bluebird');
const Joi = require('joi');
const utils = require('../routes/utils');

const dbHandlerPromisified = require('../routes/dbHandler').dbHandlerPromisified;
// const logging = require('../libs/logger');

const MODEL_NAME = 'Report';
const TABLE = 'tb_report';
const columns = [
    'report_id', 
    'coin', 
    'wallet_address', 
    'url', 
    'reason', 
    'created_at'
];

const PRIMARY_KEY = 'report_id';
const FILTERS = [
    'report_id', 
    'coin', 
    'wallet_address', 
    'url'
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
            coin : Joi.string().allow(null) , 
            wallet_address : Joi.string().allow(null),
            url : Joi.string().required(),
            reason : Joi.string().allow(null)
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

// exports.update = (logconf = {}, updateInfo)=>{
//     return new Promise((resolve, reject)=>{
//         let primaryKey = updateInfo[`${PRIMARY_KEY}`];
//         const schema = Joi.object().keys({
//             reason_id : Joi.number().required(),
//             coin : Joi.string().required(null) , 
//             wallet_address : Joi.string().required(null),
//             url : Joi.string().allow(),
//             reason : Joi.string().allow(null),
//         });
//         const validation = Joi.validate(updateInfo, schema);

//         if (validation.error) {
//             let errorName = validation.error.name;
//             let errorReason = validation.error.details !== undefined
//                 ? validation.error.details[0].message 
//                 : 'Parameter missing or parameter type is wrong';
//             return reject(new Error( errorName + ' ' +  errorReason));
//         }

//         delete updateInfo[`${PRIMARY_KEY}`];

//         let query = `update ${TABLE} set ? where ${PRIMARY_KEY} = ? `;
//         let queryObj = {
//             query: query,
//             args: [updateInfo, primaryKey],
//             event: `Update query for ${MODEL_NAME} model`
//         };

//         dbHandlerPromisified
//             .executeQuery(logconf, queryObj)
//             .then((result) => {
//                 resolve(result);
//             })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// };