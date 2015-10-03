/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/28/13
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 * This function will create has entry in database after the registration proccess
 * Currently only two parameters are used [HASH and USERID]. It can be easily expanded to utilize more parameters.
 */

var uuid = require('node-uuid');

"use strict";


exports.hashedValue = function () {

    var calculatedHash = uuid.v4(
         //EXPAND THIS IF MORE STRICT SECURITY IS REQUIRED
        {
            node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
            clockseq: 0x1234,
            msecs: new Date().getTime(),
            nsecs: 5678
        }
    );

    return calculatedHash;

};


