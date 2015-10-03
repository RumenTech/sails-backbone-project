define([], function () {
    'use strict';

    var customSearchEngine = {

        getResults: function (queryString, callback) {
            var config = window.wrgSettings.currentConfig;
            $.ajax({
                type: 'GET',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                data: {
                    key: config.googleApiKey,
                    cx: config.searchEngineId,
                    q: queryString
                },
                url: config.searchEngineURL,
                dataType: 'jsonp',
                success: function (data) {
                    callback(data);
                }
            });
        },

        getPointOfLightJobs: function (queryString, customLocation, customDistance, pagination, callback) {
            var distance = 15, //Search within 15 miles radius.MOVE THIS TO CONFIG
                config = window.wrgSettings.currentConfig,
                location = wrgSettings.userLocation;

            if (customDistance) {     //User entered custom distance
                distance = customDistance;
            }

            if (customLocation) {     //User entered custom distance
                location = customLocation;
            }
            $.ajax({
                type: 'POST',
                url: config.endPoints.pointOfLight,
                dataType: 'json',
                data: {
                    location: location, //wrgSettings.userLocation,
                    distance: distance,
                    interest: queryString,
                    paginationOffset: pagination
                },
                success: function (data) {
                    callback(data);
                },
                fail: function (data) {
                    callback(data);
                }
            });
        }
    };
    return customSearchEngine;
});