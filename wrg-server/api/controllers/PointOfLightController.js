'use strict';

var request = require('request');

var mc = (require('../../config/mainConfig.js')());

module.exports = {

    searchPositions: function (req, res) {

        var clientData = req.body,
            key = mc.pointOfLight.APIkey,
            defaultDistance = mc.pointOfLight.distance,
            polURL = "http://api2.servicefootprint.appspot.com/api/volopps?key=" + key;

        //Defense
        if (typeof clientData.distance === "undefined") {
            defaultDistance = mc.pointOfLight.distance;
        }
        if (typeof clientData.location === "undefined") {
            return res.send({message: "Something is wrong with your location"})
        }
        if (clientData.interest === "undefined") {
            return res.send({message: "To obtain the proper point Of Light Data, please set you skill within the profile"})
        }

        polURL += "&type=all&merge=3&output=json-hoc";
        polURL += "&vol_loc=" + clientData.location;
        polURL += "&vol_dist=" + clientData.distance;
        polURL += "&vol_startdate=" + "NOW";
        polURL += "&q=" + clientData.interest;
        //This is paginated search
        if (clientData.paginationOffset) {
            polURL += "&start=" + clientData.paginationOffset;
        }

        try {
            request(polURL, function (error, response, polData) {
                if (!error && response.statusCode === 200) {

                    var jobsResultSet = JSON.parse(polData);
                    //todo. Add another layer of defense regarding user location???
                    jobsResultSet.searchLocation = clientData.location;

                    return res.send(jobsResultSet, 200);
                } else {
                    return res.send("Points of Light is currently not available. Please try later.", 500);
                }
            });
        }
        catch (err) {
            sails.log.error('Main Error Contacting POI API: ', err);
            return res.send(err, 500);
        }
    },
    _config: {}
};

