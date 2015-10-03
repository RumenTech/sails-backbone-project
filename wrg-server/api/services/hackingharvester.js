/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 04/03/14
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 * This function will analyze passed REQ.
 * Currently it only logs to console
 */

"use strict";


exports.proccessReq = function (req, location) {

    var attackerDetails = {};

    attackerDetails.ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    attackerDetails.host = req.headers.host;
    attackerDetails.browser = req.headers['user-agent'];

    console.log("---Hacking Attack detected---");
    console.log(attackerDetails);
    console.log("Attack Attempted at: " + location);

    //send Email to Administrator here
    //log this somewhere
    return attackerDetails;   //no need for return?
};


