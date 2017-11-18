'use strict';
const mysql = require('mysql');
const config = require('config');
const Promise = require('bluebird');
const logging = require('../libs/logging');

/**
 * @module  databaseHandler
 * 
 */

let cryptoniumDBPoolConfig = {
    host: config.get('dbConfig.host'),
    user: config.get('dbConfig.user'),
    password: config.get('dbConfig.password'),
    database: config.get('dbConfig.database'),
    connectionLimit: config.get('dbConfig.connectionLimit')
};  


var cryptoniumDbConnectionsPool = undefined;


function initializePool(){
    cryptoniumDbConnectionsPool = mysql.createPool(cryptoniumDBPoolConfig);
    console.log(` SQL conncetion created `);
}

initializePool();

var dbClient = {
    executeQuery : function(sql, values, callback){

        var queryObject = {};

        if (typeof sql === 'object') {
            // query(options, cb)
            queryObject = sql;
            if (typeof values === 'function') {
                queryObject.callback = values;
            } else if (typeof values !== 'undefined') {
                queryObject.values = values;
            }
        } else if (typeof values === 'function') {
            // query(sql, cb)
            queryObject.sql      = sql;
            queryObject.values   = undefined;
            queryObject.callback = values;
        } else {
            // query(sql, values, cb)
            queryObject.sql      = sql;
            queryObject.values   = values;
            queryObject.callback = callback;
        }
        queryObject.sql = queryObject.sql.replace(/\s+/g,' ');
        return cryptoniumDbConnectionsPool.query(queryObject.sql, queryObject.values, function(err, result){
            if(err){
                if(err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED'){
                    // Repeat the query being made if error code is ER_LOCK_DEADLOCK
                    process.stderr.write(err.code + ' OCCURRED\n');
                    process.stderr.write(err.code + ' ER_LOCK_DEADLOCK QUERY: ' + queryObject.sql + '\n');
                    process.stderr.write(err.code + ' ER_LOCK_DEADLOCK VALUES: ' + queryObject.values + '\n');
                    process.stderr.write(err.code + ' ER_LOCK_DEADLOCK CALLBACK: ' + queryObject.callback + '\n');
                    setTimeout(module.exports.dbHandler.getInstance().executeQuery.bind(null, sql, values, callback), 100);
                }
                else{
                    queryObject.callback(err, result);
                }
            }
            else{
                queryObject.callback(err, result);
            }
        });
    }
};

var dbClientPromisified = {
    executeQuery : function(handlerInfo, queryObj){
        return new Promise((resolve, reject) => {
            queryObj.query = queryObj.query.replace(/\s+/g,' ');
            var finalQuery = cryptoniumDbConnectionsPool.query(queryObj.query, queryObj.args, function(err, result) {
                queryObj.sql = finalQuery.sql;
                queryObj.sql = queryObj.sql.replace(/[\n\t]/g,'');

                let event = queryObj.event || 'Executing mysql query';
                logging.logDatabaseQuery(handlerInfo, event, err, result, queryObj.sql);
                if(err && (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED')) {
                    setTimeout(function () {
                        module.exports.dbHandlerPromisified.executeQuery(handlerInfo, queryObj)
                            .then((result) => {
                                return resolve(result);
                            }, (error, result) => {
                                return reject(error, result);
                            });
                    }, 50);
                } else if(err) {
                    return reject(err, result);
                } else {
                    return resolve(result);
                }
            });
        });
    }
};

exports.dbHandler = (function (){

    var handler = null;

    return {
        getInstance : function (){
            if(!handler){
                handler = dbClient;
            }
            return handler;
        }
    };
})();


exports.dbHandlerPromisified = dbClientPromisified;


