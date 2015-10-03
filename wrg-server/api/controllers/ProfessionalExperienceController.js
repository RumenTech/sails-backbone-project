/**
 * ExperienceController
 *
 * @module        :: Controller
 * @description    :: Contains logic for handling requests.
 */

module.exports = {

    create:function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from professional experience create");
            return res.view('404');
        }

        AlumniStory.findOneByUser_id(req.session.user.id).done(function (err, alumni) {

            // Error handling
            if (err) {
                console.log(err);
                return res.send(err, 500);
                // The Books were found successfully!
            } else {

                req.body.alumnistory_id = alumni.id;
                ProfessionalExperience.create(req.body).done(function (err, experience) {
                    try {
                        if (err) {
                            sails.log.error("Error creating experience", err);
                            return res.send(err, 500);
                        } else {
                            //Now create the category
                            categories = req.body.categories;
                            if (categories == undefined)
                                categories = Array();

                            for (i = 0; i < categories.length; i++) {
                                categories[i].experience_id = experience.id;
                            }

                            //Save the categories
                            ProfessionalExperienceCategory.create(categories).done(function (err, expcats) {
                                try {
                                    if (err) {
                                        return res.send(err.message, 500);
                                    } else {

                                        experience.categories = expcats;


                                        //Save the media experiences
                                        //Now create the media
                                        medias = req.body.media;
                                        if (medias == undefined)
                                            medias = Array();

                                        for (i = 0; i < medias.length; i++) {
                                            medias[i].experience_id = experience.id;
                                        }

                                        ProfessionalExperienceMedia.create(medias).done(
                                            function (err, new_medias) {
                                                try {
                                                    if (err) {
                                                        return res.send(err.detail, 500);
                                                    } else {
                                                        experience.media = new_medias;
                                                        var feedEntry = {};
                                                        feedEntry.user_id = req.session.user.id;
                                                        feedEntry.user_role = req.session.user.role;
                                                        feedEntry.event_type ='experienceAdded';
                                                        feedEntry.image = experience.title;
                                                        Feed.addFeedEvent(feedEntry);
                                                        return res.send(experience, 200);
                                                    }

                                                } catch (err) {
                                                    return res.send(err.message, 500);
                                                }


                                            }
                                        );

                                    }
                                } catch (err) {
                                    sails.log.error(err.message);
                                    return res.send(err.message, 500);
                                }

                            });
                        }
                    } catch (err) {
                        sails.log.error(err.message);
                        return res.send(err.message, 500);
                    }
                })

            }
        });

    },

    update:function (req, res) {

        if (!req.isAuthenticated()) {
            return res.view('404');
        }

        var id = req.param("id");
        ProfessionalExperience.update({id:id}, req.body, function (err, experiences) {
            try {
                if (err) {
                    sails.log.error('Error creating experience', err);
                    return res.send(err.message, 500);
                } else {
                    if (0 < experiences.length) {

                        experience = experiences[0];
                        ProfessionalExperienceCategory.destroy({experience_id:experience.id}).done(
                            function (err) {
                                try {
                                    if (err) {
                                        sails.log.error(err.message);
                                        return res.send(err.message, 500);
                                    } else {

                                        //find the  new
                                        categories = res.req.body.categories;
                                        categories = (categories == undefined) ? Array() : categories;
                                        for (i = 0; i < categories.length; i++) {
                                            categories[i].experience_id = experience.id;
                                            delete categories.id;
                                        }

                                        ProfessionalExperienceCategory.create(categories).done(function (err, expcats) {
                                            try {
                                                if (err) {
                                                    return res.send(err.message, 500);
                                                } else {

                                                    experience.categories = expcats;

                                                    var media = [];

                                                    if (res.req.body.media) {
                                                        media = res.req.body.media;
                                                    }
                                                    var media_delete = [];
                                                    for (var i = 0; i < media.length; i++) {
                                                        var media_aux = media[i];
                                                        if (media_aux.deleted != undefined) {
                                                            if (media_aux.deleted == "on") {
                                                                media_delete[media_delete.length] = { id:media_aux.id };
                                                            }
                                                        }
                                                    }
                                                    ProfessionalExperienceMedia.destroy({experience_id:experience.id}).done(
                                                        function (err, expmedia) {
                                                            try {
                                                                if (err) {
                                                                    return res.send(err, detail, 500);
                                                                } else {
                                                                    if (expmedia != undefined) {
                                                                        sails.log.info('Experience media deleted');
                                                                    }
                                                                    //Save the new medias
                                                                    var media = [];
                                                                    if (res.req.body.media) {
                                                                        media = res.req.body.media;
                                                                    }

                                                                    var media_new = [];
                                                                    for (var i = 0; i < media.length; i++) {
                                                                        var media_aux = media[i];

                                                                        if (media_aux.id == undefined) {

                                                                            media_new[media_new.length] = { name:media_aux.name,
                                                                                type:media_aux.type,
                                                                                data:media_aux.data,
                                                                                experience_id:experience.id
                                                                            };
                                                                        }
                                                                    }
                                                                    ProfessionalExperienceMedia.create(media_new).done(
                                                                        function (err, media) {
                                                                            try {
                                                                                if (err) {
                                                                                    return res.send(err, 500);
                                                                                } else {
                                                                                    ProfessionalExperienceMedia.find(
                                                                                        {experience_id:experience.id },
                                                                                        function (err, media) {
                                                                                            try {
                                                                                                if (err) {
                                                                                                    return res.send(err.detail, 500);
                                                                                                } else {
                                                                                                    experience.media = media;
                                                                                                    var feedEntry = {};
                                                                                                    feedEntry.user_id = req.session.user.id;
                                                                                                    feedEntry.user_role = req.session.user.role;
                                                                                                    feedEntry.event_type ='experienceUpdated';
                                                                                                    feedEntry.image = experience.title;
                                                                                                    Feed.addFeedEvent(feedEntry);
                                                                                                    return res.send(experience, 200);
                                                                                                }
                                                                                            } catch (err) {
                                                                                                return res.send(err.message, 500);
                                                                                            }
                                                                                        }

                                                                                    );
                                                                                }
                                                                            } catch (err) {
                                                                                return res.send(err.message, 500);
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            } catch (err) {
                                                                return res.send(err.message, 500);
                                                            }
                                                        }
                                                    );
                                                }
                                            } catch (err) {
                                                sails.log.error(err.message);
                                                return res.send(err.message, 500);
                                            }
                                        });
                                    }
                                } catch (err) {
                                    sails.log.error(err.message);
                                    return res.send(err.message, 500);
                                }
                            }
                        );

                    } else {
                        return res.send({message:"Nothing was updated, check your params"}, 200);
                    }
                }
            } catch (err) {
                sails.log.error(err.message);
                return res.send(err.message, 500);
            }
        });
    },

    findExperiences:function (req, res) {

        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from find professional experiences");
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


                ProfessionalExperience.find({
                    alumnistory_id:alumni.id
                }).done(function (err, experiences) {
                        if (err) {
                            sails.log.error(err);
                            return res.send(err, 500);
                        } else {
                            sails.log.info("Experiences found for alumni: ", alumni.id);


                            var ranking = [];
                            ranking[1] = 0;
                            ranking[2] = 0;
                            ranking[3] = 0;
                            ranking[4] = 0;
                            ranking[5] = 0;
                            ranking[6] = 0;
                            ranking[7] = 0;
                            ranking[8] = 0;

                            //Projects

                            if (experiences.length > 0) {
                                var array_where = [];
                                for (var i = 0; i < experiences.length; i++) {
                                    array_where[i] = {experience_id:experiences[i].id};
                                }

                                //Categories

                                ProfessionalExperienceCategory.find(
                                    {
                                        where:{
                                            or:array_where
                                        }
                                    }
                                ).done(
                                    function (err, expcat) {

                                        if (err) {
                                            sails.log.error(err);
                                            return res.send(err, 500);
                                        } else {
                                            sails.log.info("Categories found for professional: ", alumni.id);
                                            for (var i = 0; i < expcat.length; i++) {
                                                for (var j = 0; j < experiences.length; j++) {
                                                    if (experiences[j].categories === undefined) {
                                                        var categories = [];
                                                        experiences[j].categories = categories;
                                                    }
                                                    if (experiences[j].id == expcat[i].experience_id) {
                                                        experiences[j].categories[experiences[j].categories.length] = expcat[i];
                                                    }
                                                }
                                                ranking[expcat[i].category_id]++;
                                            }

                                            ProfessionalExperienceMedia.find({
                                                where:{
                                                    or:array_where
                                                }
                                            }).done(
                                                function (err, expmedia) {
                                                    try {
                                                        if (err) {
                                                            return res.send(err, 500)
                                                        } else {
                                                            sails.log.info("Media found for professional: ", alumni.id);
                                                            for (var i = 0; i < expmedia.length; i++) {
                                                                for (var j = 0; j < experiences.length; j++) {
                                                                    if (experiences[j].media === undefined) {
                                                                        experiences[j].media = [];
                                                                    }
                                                                    if (experiences[j].id === expmedia[i].experience_id) {
                                                                        experiences[j].media[experiences[j].media.length] = expmedia[i];
                                                                    }
                                                                }
                                                            }
                                                            return res.send(experiences, 200);
                                                        }
                                                    } catch (err) {
                                                        return res.send(err, 500);
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                            else {
                                return res.send(experiences, 200);
                            }
                        }
                    });
            }
        });
    }

};
