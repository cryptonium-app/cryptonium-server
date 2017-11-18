'use strict';

/**
 * Module : updater
 * Description : List of utility methods
 * Author : sagarkarira1992@gmail.com
 * Created : 17/11/17
 */

module.exports = {
    sendGzippedResponse,
    sendErrorResponse,
    stringifyObject,
    parseJSON,
    requestQueryStringFormat,
    requestJsonFormat, 
    extendQueryForFilters
};

const Promise = require('bluebird');
const request = require('request');
const rp = require('request-promise');
const zlib = require('zlib');
const logging = require('../libs/logging');
// const statusCodes = require('./statusCodes');

/**
 * Compresses a given response object and sends it.
 * @param  {object} handlerInfo apiModule and apiHandler info
 * @param  {object} response    Contains the final result of any API
 * @param  {stream} res         express res stream
 */
function sendGzippedResponse(handlerInfo = {}, response, res) {
    zlib.gzip(JSON.stringify(response), function(err, zippedData) {
        if (err) {
            logging.error(handlerInfo, 'Failed to zip the data ', {
                ERROR: err
            });
            return res.send(response);
        }
        res.set({ 'Content-Encoding': 'gzip' });
        return res.send(zippedData);
    });
}

/**
 * Sends a response in case of an error
 * @param  {object} handlerInfo apiModule and apiHandler info
 * @param  {object} error       {responseFlag, responseMessage}
 * @param  {stream} res         express res stream
 */
function sendErrorResponse(handlerInfo, error, res) {
    if (!error.responseFlag) {
        error.responseFlag = statusCodes.METHOD_FAILURE;
    }
    if (!error.responseMessage) {
        error.responseMessage =
            error.message ||
            statusCodes.getStatusText(statusCodes.METHOD_FAILURE);
    }
    var response = {
        flag: error.responseFlag,
        message: error.responseMessage
    };
    if (error.addnInfo) {
        for (var key in error.addnInfo) {
            response[key] = error.addnInfo[key];
        }
    }
    logging.error(handlerInfo, error);
    res.send(JSON.stringify(response));
}


/**
 * Smart stringify function
 * @param  {object} obj Object to stringify
 */
function stringifyObject(obj) {
    if (typeof obj === 'object' && obj !== null) {
        return JSON.stringify(obj);
    }
    if (obj === null) {
        return null;
    }
    return JSON.stringify({ changed_to_object: obj });
}

function requestQueryStringFormat(requestUrl, formObject) {
    return new Promise((resolve, reject) => {
        rp
            .post(requestUrl)
            .form(formObject)
            .then(response => {
                try {
                    response = JSON.parse(response);
                } catch (error) {
                    throw new Error('Error parsing');
                }
                return resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function parseJSON(data, callback) {
    if (is.not.string(data)) {
        return callback(null, data);
    }
    try {
        data = JSON.parse(data);
        return callback(null, data);
    } catch (error) {
        return callback(error);
    }
}

function requestJsonFormat(requestUrl, actionRequest) {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'POST',
            json: true,
            body: actionRequest,
            url: requestUrl
        };
        rp(options)
            .then(response => {
                console.log(response);
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}



/**
 * where clause extender for adding filters in sql query 
 * @param  {array} filterArr    Filter keys name
 * @param  {object} opts         Object to filter keys from 
 * @return {object } Returns {whereClause(string), args(array of values)}
 */
function extendQueryForFilters(filterArr, opts) {
    let whereClause = [];
    let args = [];
    filterArr.forEach(filter => {
        if (opts[filter] !== undefined && opts[filter] !== null) {
            whereClause.push(` ${filter} = ? `);
            args.push(opts[filter]);
        }
        if (opts[filter] === null) {
            whereClause.push(` ${filter} is ? `);
            args.push(opts[filter]);
        }
    });

    if (whereClause.length) {
        whereClause = 'WHERE ' + whereClause.join(' AND ');
    }

    return {
        whereClause,
        args
    };
}



