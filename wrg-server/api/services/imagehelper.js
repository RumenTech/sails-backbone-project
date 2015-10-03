/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/28/13
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 * This function will create has entry in database after the registration proccess
 * Currently only two parameters are used [HASH and USERID]. It can be easily expanded to utilize more parameters.
 */
var fs = require('fs');

"use strict";


exports.deletefile = function (location) {

    fs.unlink(location, function (err) {
        if (err)
        {
          sails.log.error("Cant delete image file", err);
          return false;
        } else {
            return true;
        }
    });
};

 exports.readImageFromDisk = function (location) {
     fs.readFile(location, function (err, data) {
         if (err)
         {
             return false;
         } else {
             return data;
         }
     });
 };

exports.s3Functionality = function () {
        //TODO Implement

};