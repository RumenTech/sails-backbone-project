/**
 * ExperienceController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {


    saveSkills:function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Group Update Controller");
            return  res.view('404');
        }

        var user_id = req.session.user.id
        AlumniStory.findOneByUser_id(user_id).done(function (err, alumni) {

            // Error handling
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {


                ProfessionalSkill.destroy({alumnistory_id : alumni.id}).done(function(err) {
                    try {
                        if (err) {
                            sails.log.error(err);
                            next(err);
                        } else {
                            sails.log.info("Skills destroyed");
                            var skills = req.body.skills;

                            for (var i = 0; i < skills.length; i++) {
                                skills[i].alumnistory_id = alumni.id;
                            }


                            ProfessionalSkill.create(skills === undefined ? [] : skills).done(function(err, skill) {
                                try {
                                    if (err) {
                                        sails.log.error(err);
                                        return res.send(err, 500);
                                    } else {
                                        sails.log.info("Skill recreated", skill);
                                        var feedEntry = {};
                                        feedEntry.user_id = req.session.user.id;
                                        feedEntry.user_role = req.session.user.role;
                                        feedEntry.event_type ='skillsAdded';
                                        feedEntry.image = '';
                                        for(var i = 0; i < skill.length; i++){
                                            if(i === skill.length - 1){
                                                feedEntry.image += skill[i].name;
                                            }
                                            else{
                                                feedEntry.image += skill[i].name + ', ';
                                            }
                                        }
                                        Feed.addFeedEvent(feedEntry);
                                        return res.send([], 200);
                                    }
                                } catch(err) {
                                    sails.log.error(err);
                                    return res.send(err, 500);
                                }
                            });
                        }
                    }catch(err){
                        sails.log.error(err);
                        next(err);
                    }
                });


            }
        });
    },

    findSkills:function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from findSkills");
            return  res.view('404');
        }

        var user_id = req.session.user.id
        AlumniStory.findOneByUser_id(user_id).done(function (err, alumni) {

            // Error handling
            if (err) {
                sails.log.error(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {


                ProfessionalSkill.find({
                    alumnistory_id:alumni.id
                }).done(function (err, skills) {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            return res.send(skills, 200);
                        }
                    });
            }
        });
    }

};

