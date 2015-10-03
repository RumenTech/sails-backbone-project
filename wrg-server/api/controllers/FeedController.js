/**
 * Created by semir.sabic on 29.4.2014.
 */
"use strict";

module.exports = {
    getFeed: function(req, res){
        try{
            if (!req.isAuthenticated()) {
                sails.log.error("Not authenticated");
                return  res.view('404');
            }
            else{
                var limit = req.param('limit') || 10;
                var offset = req.param('offset') || 0;

                var query = 'SELECT * FROM feed  ORDER BY timestamp DESC LIMIT ' + limit + ' OFFSET ' + offset;

                Feed.query(query, function(err, feed){
                    if(err){
                        sails.log.error('Cannot retrieve feed data: ' + err.message);
                        return res.send({error: err.message}, 500);
                    }
                    else{
                        sails.log.info('Feed data retrieved successfully');
                        return res.send(feed.rows, 200);
                    }
                });
            }
        }
        catch (err){
            sails.log.error(err.message);
            return res.send({error: err.message}, 500);
        }
    },

    getEvents: function(req, res){
        try{
            if (!req.isAuthenticated()) {
                sails.log.error("Not authenticated");
                return  res.view('404');
            }
            else{
                var limit = req.param('limit') || 10;
                var offset = req.param('offset') || 0;

                var query = 'SELECT groupevent.name, groupevent.start, groupevent.end, groupevent.location, groupevent.date as datum ' +
                            'FROM groupevent ' +
                            'WHERE groupevent.date > current_date ' +
                            'UNION ' +
                            'SELECT collegeevent.name, collegeevent.start, collegeevent.end, collegeevent.location, collegeevent.date as datum ' +
                            'FROM collegeevent ' +
                            'WHERE collegeevent.date > current_date ' +
                            'UNION ' +
                            'SELECT companyevent.name, companyevent.start, companyevent.end, companyevent.location, companyevent.date as datum ' +
                            'FROM companyevent ' +
                            'WHERE companyevent.date > current_date ' +
                            'ORDER BY datum, start ' +
                            'LIMIT ' + limit +
                            'OFFSET ' + offset;

                GroupEvent.query(query, function(err, events){
                    if(err){
                        sails.log.error('Error getting future events list: ' + err.message);
                        return res.send({error: err.message}, 500);
                    }
                    else{
                        sails.log.info('Future events retrieved successfully');
                        return res.send(events.rows, 200);
                    }
                });
            }
        }
        catch (err){
            sails.log.error(err.message);
            return res.send({error: err.message}, 500);
        }
    }
};