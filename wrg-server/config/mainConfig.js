/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/2/13
 * Time: 12:28 PM
 * Intent is to use single Configuration file for all project requirements.
 * Please feel free to use/expand this config to your requirements
 */

/*var dev = require('./configs/dev/applicationConfig.js');
var qa = require('./configs/qa/applicationConfig.js');
var stg = require('./configs/stg/applicationConfig.js');
var prod = require('./configs/prod/applicationConfig.js');*/


"use strict";


module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'loc':
            return require('./configs/loc/applicationConfig.js');
        case 'dev':
            return require('./configs/dev/applicationConfig.js');
        case 'qa':
            return require('./configs/qa/applicationConfig.js');
        case 'stg':
            return require('./configs/stg/applicationConfig.js');
        case 'prod':
            return require('./configs/prod/applicationConfig.js');
        default:
            return 'error';
    }
};

