'use strict';

module.exports = {

    create:function (req, res) {
        if (!req.isAuthenticated()) {
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
                        req.body.date = new Date();
                        Job.new_update(req.body,
                            function (err, job) {
                                try {
                                    if (err) {
                                        return res.send(err, 500);
                                    } else {
                                        var feedEntry = {};
                                        feedEntry.user_id = req.session.user.id;
                                        feedEntry.user_role = req.session.user.role;
                                        feedEntry.event_type ='newJob';
                                        feedEntry.job_id = job.id;
                                        feedEntry.job_name = job.job_title;
                                        feedEntry.company_id = company.id;
                                        Feed.addFeedEvent(feedEntry);
                                        return res.send(job, 200);
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

        if (!req.isAuthenticated()) {
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
                        req.body.date = new Date();
                        Job.new_update(req.body,
                            function (err, job) {
                                try {
                                    if (err) {
                                        return res.send(err, 500);
                                    } else {
                                        return res.send(job, 200);
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

    destroy:function (req, res) {
        if (!req.isAuthenticated()) {
            return res.view('404');
        }


        var job_id = req.url.split('/')[2];

        try {
            Company.findMe(
                req.session.user.id,
                function (err, company) {
                    if (err) {
                        res.send({message:err.message})
                    } else {
                        Job.destroy({id:job_id, company_id:company.id}).done(function (err, jobs) {
                            try {
                                if (err) {
                                    return res.send({message:err.message}, 500);
                                } else {
                                    return res.send(jobs, 200);
                                }
                            } catch (err) {
                                return res.send({message:err.message}, 500);
                            }
                        });

                    }
                }
            );

        } catch (err) {
            return res.send({message:err.message}, 500);
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
                        Job.find({company_id:company.id}).done(
                            function (err, jobs) {
                                try {
                                    if (err) {
                                        return res.send(err, 500);
                                    } else {
                                        sails.log.info("Jobs found: ", jobs.length);
                                        return res.send(jobs, 200);
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

    searchJobs:function (req, res) {
        try {
            var jobsearch = req.param('jobsearch');
            jobsearch = jobsearch || '';

            var query = "SELECT * " +
                "FROM Job j " +
                "WHERE lower(job_title) LIKE lower('%" + jobsearch + "%')";

            Job.query(query, null,
                function (err, jobs) {
                    try {
                        if (err) {
                            sails.log.error(err.message);
                            res.send(err.message, 500);
                        } else {
                            return res.send({request:jobs.rows}, 200);
                        }
                    } catch (err) {
                        sails.log.error(err.message);
                        return res.send(err.message, 500);
                    }
                });
        } catch (err) {
            return res.send({message:err.message}, 500);
        }
    },

    getjob:function (req, res) {
        if (req.param('id') === null || req.param('id') === undefined) {
            return res.send({message:err.message}, 500);
        }
        else {
            var id = req.param('id');
            var query = "SELECT Job.*, Company.name as company_name, Company.state as company_state, Company.city as company_city, Company.company_size as company_size, Company.company_website as company_web, Company.facebook_url as company_fb, Company.twitter_url as company_tw, Company.google_url as company_gplus, Company.linkedin_url as company_linkedin, Company.tagline as company_tagline, Company.profile_image as company_image " +
                "FROM Job, Company " +
                "WHERE  Job.id = " + id + " AND Job.company_id = Company.id";
        }
        try {
            Job.query(query, null,
                function (err, job) {
                    try {
                        if (err) {
                            sails.log.error(err.message);
                            res.send(err.message, 500);
                        } else {
                            return res.send(job.rows[0], 200);
                        }
                    } catch (err) {
                        sails.log.error(err.message);
                        return res.send(err.message, 500);
                    }
                });
        }
        catch (err) {
            return res.send({message:err.message}, 500);
        }
    },
    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PostController)
     */
    _config:{}

};
