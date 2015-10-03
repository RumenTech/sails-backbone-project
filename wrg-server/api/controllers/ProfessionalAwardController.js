/**
 * AwardController
 * CRUD for Stuident Awards
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

'use strict';

module.exports = {

    create: function(req,res){
        if(!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from professional award controller");
            return  res.view('404');
        }

        AlumniStory.findOneByUser_id(req.session.user.id).done(function (err, alumni) {

            // Error handling
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {
                req.body.alumnistory_id = alumni.id;
                ProfessionalAward.create(req.body).done(function(err,award){
                    if (err){
                        sails.log.error("Error creating award ", err);
                        res.send(err,500);
                    }else{
                        var feedEntry = {};
                        feedEntry.user_id = req.session.user.id;
                        feedEntry.user_role = req.session.user.role;
                        feedEntry.event_type ='awardAdded';
                        feedEntry.image = award.title;
                        Feed.addFeedEvent(feedEntry);
                        res.send(award,200);
                    }
                });
            }


        });
    },

    update: function(req,res){
        if(!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from professional award update");
            return  res.view('404');
        }

        var id = req.param("id"),
            studentId = req.body.student_id;


        AlumniStory.findOneByUser_id(req.session.user.id).done(function (err, alumni) {

            // Error handling
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {

                ProfessionalAward.update({id:id, alumnistory_id: alumni.id},req.body,function(err, award){
                    if (err){

                        if(err.message = "22007"){
                            return res.send({message:'Date fields are required'}, 500);
                        }

                        return res.send(err.message, 500);
                    } else{
                        var feedEntry = {};
                        feedEntry.user_id = req.session.user.id;
                        feedEntry.user_role = req.session.user.role;
                        feedEntry.event_type ='awardUpdated';
                        feedEntry.image = award[0].title;
                        Feed.addFeedEvent(feedEntry);
                        return res.send(award, 200);
                    }
                });

            }
        });
    },

    findAwards:function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from professional find awards");
            return  res.view('404');
        }

        var user_id = req.session.user.id
        AlumniStory.findOneByUser_id(user_id).done(function (err, alumni) {

            // Error handling
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
            } else {
                ProfessionalAward.find({
                    alumnistory_id:alumni.id
                }).done(function (err, awards) {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            return res.send(awards, 200);
                        }
                    });
            }
        });
    }
};
