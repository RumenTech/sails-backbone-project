/**
 * AwardController
 * CRUD for Stuident Awards
 * @module        :: Controller
 * @description    :: Contains logic for handling requests.
 */

'use strict';

module.exports = {

    create: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from AwardController - Create");
            return  res.view('404');
        }
        Award.create(req.body).done(function (err, award) {
            if (err) {
                sails.log.error("Error Creating Award: " + err);

                res.send(err, 500);
            } else {
                var feedEntry = {};
                feedEntry.user_id = req.session.user.id;
                feedEntry.user_role = req.session.user.role;
                feedEntry.event_type = 'awardAdded';
                feedEntry.image = award.title;
                Feed.addFeedEvent(feedEntry);
                res.send(award, 200);
            }
        })
    },

    update: function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from AwardController - Update");
            return res.view('404');
        }

        var id = req.param("id"),
            studentId = req.body.student_id;

        Award.update({id: id, student_id: studentId}, req.body, function (err, award) {
            if (err) {

                if (err.message = "22007") {
                    return res.send({message: 'Date fields are required'}, 500);
                }

                return res.send(err.message, 500);
            } else {
                var feedEntry = {};
                feedEntry.user_id = req.session.user.id;
                feedEntry.user_role = req.session.user.role;
                feedEntry.event_type = 'awardUpdated';
                feedEntry.image = award[0].title;
                Feed.addFeedEvent(feedEntry);

                return res.send(award);
            }
        });
    },

    findNews: function (req, res) {

            NewsFeed.find(
            /*    {
                name: {
                    contains:  req.body.q.keys
                }
            }*/
            ).limit(13).done(function(err, news) {
                // Error handling
                if (err) {
                    return console.log(err);
                    // Found multiple users!
                } else {
                    //console.log(users);
                    return res.send(news, 200);
                }
            });
        }
};
