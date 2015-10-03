/**
 * Created by Mistral on 12/30/13.
 */
"use strict";

module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        company_id: {
            type: 'INTEGER',
            required: true
        },
        date: {
            type: 'date',
            required: true
        },
        start: {
            type: 'string',
            required: true
        },
        end: {
            type: 'string',
            required: true
        },
        location: {
            type: 'string',
            required: true
        }
    },

    new_update: function(data, next, remove) {
        try {
            // delete
            if (remove) {
                CompanyEvent.destroy({id: data.id}).done(function(err, events) {
                    try {
                        if (err) {
                            next(err);
                        } else {
                            next(null, events);
                        }
                    } catch (err) {
                        next(err);
                    }
                });
            }
            //is new
            if (data.id === undefined || data.id === ""){
                delete data.id;
                CompanyEvent.create(data).done(function(err, event){
                    try{
                        if (err) {
                            next(err, null);
                        } else {
                            var message = CompanyEvent.validateNewEntry(event.start, event.end);
                            if (message === true) {
                                next(null, event);
                            } else {
                                next(message, null);
                            }
                        }
                    } catch(err) {
                        next(err);
                    }
                });
                //is update
            } else {
                CompanyEvent.update(
                    {
                        id: data.id,
                        company_id : data.company_id
                    },
                    data,
                    function(err, event) {
                        try {
                            if (err) {
                                next(err, null);
                            } else {
                                if (event.length === 1){
                                    var message = CompanyEvent.validateNewEntry(event[0].start, event[0].end);
                                    if (message === true) {
                                        next(null, event[0]);
                                    } else {
                                        next(message, null);
                                    }
                                } else {
                                    next(null, Array);
                                }
                            }
                        } catch(err) {
                            next(err);
                        }
                    }
                );
            }
        } catch(err) {
            next(err);
        }
    },

    validateNewEntry: function (startTime, endTime) {

        var startTimeInt = conversionutils.convertTime(startTime),
            endTimeInt = conversionutils.convertTime(endTime);

        var message = '';

        if (startTimeInt < 0 || startTimeInt > 24) {
            message = 'Start time is not in valid range';
        } else if (endTimeInt < 0 || endTimeInt > 24) {
            message =  'End time is not in valid range';
        } else if (startTimeInt >= endTimeInt) {
            message =  'Start time cannot be greater than or equal to end time';
        } else {
            message =  true;
        }
        return message;
    },

    getDateFormat : function (date) {
        var month = date.getUTCMonth() + 1,
            day = date.getUTCDate(),
            year = date.getUTCFullYear();
        return  month + '/' + day + '/' + year;
    }
};
