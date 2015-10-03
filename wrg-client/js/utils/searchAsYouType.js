define([], function () {
    'use strict';

    var searchAsYouType = {
        searchSchools: function (that, fieldId, allowFreeValue) {

            var calculate =  that.model || that.fastmodel, //Covers the case for school searching from the fast register page
                config = calculate.reqres.request('config');

           getContent();

           function getContent(searchParamsObject) {
                $("#" + fieldId ).autocomplete({
                    source: config.aCompleteEndPoint,
                    minLength: 1,
                    select: function( event, ui ) {
                       //console.log("I am selected");
                    }
                });
            }
        }
    };
    return searchAsYouType;
});