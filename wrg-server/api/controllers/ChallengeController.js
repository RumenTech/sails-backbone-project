'use strict';

module.exports = {

    create:function (req, res) {
        if(!req.isAuthenticated()) {
            return  res.view('404');
        }
        try {
            Company.findMe(
                req.session.user.id,
                function (err, company) {
                    if (err) {
                        res.send({message:err.message})
                    } else {
                        req.body.company_id = company.id;
                        Challenge.new_update(req.body,
                            function (err, challenge) {
                                try {
                                    if (err) {
                                        return res.send(err, 500);
                                    } else {
                                        var feedEntry = {};
                                        feedEntry.user_id = req.session.user.id;
                                        feedEntry.user_role = req.session.user.role;
                                        feedEntry.event_type ='newChallenge';
                                        feedEntry.challenge_id = challenge.id;
                                        feedEntry.challenge_name = challenge.challenge_title;
                                        feedEntry.company_id = company.id;
                                        Feed.addFeedEvent(feedEntry);
                                        return res.send(challenge, 200);
                                    }
                                } catch (err) {
                                    return res.send({message:err.message}, 500);
                                }
                            }
                        );
                    }
                }
            );
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    update:function (req, res) {

        if(!req.isAuthenticated()) {
            return  res.view('404');
        }
        try {
            Company.findMe(
                req.session.user.id,
                function (err, company) {
                    if (err) {
                        res.send({message:err.message})
                    } else {
                        req.body.company_id = company.id;
                        Challenge.new_update(req.body,
                            function (err, challenge) {
                                try {
                                    if (err) {
                                        return res.send(err, 500);
                                    } else {
                                        return res.send(challenge, 200);
                                    }
                                } catch (err) {
                                    return res.send({message:err.message}, 500);
                                }
                            }
                        );

                    }
                }
            );
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    destroy: function (req, res) {
        if (!req.isAuthenticated()) {
            return res.view('404');
        }



        var challenge_id = req.url.split('/')[2];

        try {
            Company.findMe(
                req.session.user.id,
                function (err, company) {
                    if (err) {
                        res.send({message:err.message})
                    } else {
                        Challenge.destroy({id: challenge_id, company_id:company.id}).done(function (err, challenges) {
                            try {
                                if (err) {
                                    return res.send({message: err.message}, 500);
                                } else {
                                    return res.send(challenges, 200);
                                }
                            } catch (err) {
                                return res.send({message: err.message}, 500);
                            }
                        });

                    }
                }
            );

        } catch (err) {
            return res.send({message: err.message}, 500);
        }
    },

    find:function (req, res) {
        try {
            Company.findMe(
                req.session.user.id,
                function (err, company) {
                    if (err) {
                        res.send({message:err.message})
                    } else {
                        Challenge.find({company_id:company.id}).done(
                            function (err, challenges) {
                                try {
                                    if (err) {
                                        return res.send(err, 500);
                                    } else {
                                        console.log('Challenges found: ', challenges.length);
                                        return res.send(challenges, 200);
                                    }
                                } catch (err) {
                                    return res.send({message:err.message}, 500);
                                }
                            }
                        );

                    }
                }
            );
        } catch (err) {
            return res.send({message:err.message}, 500);
        }

    },

    searchChallenges:function (req, res) {
        try {
            var challengesearch = req.param('challengesearch');
            challengesearch = challengesearch || '';

            var query = "SELECT * " +
                "FROM Challenge j " +
                "WHERE lower(challenge_title) LIKE lower('%"+challengesearch+"%')";

            Challenge.query(query,null,
                function(err, challenges) {
                    try{
                        if (err){
                            console.log(err.message);
                            res.send(err.message,500);
                        }else{
                            return res.send({request:challenges.rows},200);
                        }
                    }catch(err){
                        console.log(err.message);
                        return res.send(err.message,500);
                    }
                } );
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    getchallenge:function(req, res){
        if(req.param('id') === null || req.param('id') === undefined){
            return res.send({message: err.message}, 500);
        }
        else{
            var id = req.param('id');
            var query = "SELECT Challenge.*, Company.name as company_name, Company.state as company_state, Company.city as company_city, Company.company_size as company_size, Company.company_website as company_web, Company.facebook_url as company_fb, Company.twitter_url as company_tw, Company.google_url as company_gplus, Company.linkedin_url as company_linkedin, Company.tagline as company_tagline, Company.profile_image as company_image " +
                "FROM Challenge, Company " +
                "WHERE  Challenge.id = " + id + " AND Challenge.company_id = Company.id";
        }
        try{
            Challenge.query(query,null,
                function(err, challenge) {
                    try{
                        if (err){
                            console.log(err.message);
                            res.send(err.message,500);
                        }else{
                            return res.send(challenge.rows[0], 200);
                        }
                    }catch(err){
                        console.log(err.message);
                        return res.send(err.message,500);
                    }
                } );
        }
        catch(err){
            return res.send({message: err.message}, 500);
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PostController)
     */
    _config:{}

};

