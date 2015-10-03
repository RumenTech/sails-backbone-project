"use strict";

var mc = (require('../../config/mainConfig.js')());
var async = require('async');


module.exports = {

    attributes: {
        name: {
            type: 'STRING',
            required: true,
            unique: true
        },
        state: {
            type: 'STRING'
        },
        city: {
            type: 'STRING'
        },
        company_size: {
            type: 'STRING'
        },
        company_website: {
            type: 'STRING'
        },
        facebook_url: {
            type: 'STRING'
        },
        twitter_url: {
            type: 'STRING'
        },
        google_url: {
            type: 'STRING'
        },
        linkedin_url: {
            type: 'STRING'
        },
        tagline: {
            type: 'TEXT'
        },
        description: {
            type: 'TEXT'
        },
        show_twitter: {
            type: 'INTEGER'
        },
        profile_image: {
            type: 'TEXT'
        },
        type: {
            type: 'TEXT'
        },
        payment_flag: {
            type: 'BOOLEAN',
            required: true
        }
    },

    findMe: function (user_id, next) {
        try {
            var query = "SELECT Company.* " +
                " FROM Company," + mc.dbSettings.dbName + ".public.User as UserTable, CompanyUser " +
                " WHERE UserTable.id = '" + user_id + "' AND " +
                " CompanyUser.user_id = UserTable.id AND " +
                " CompanyUser.company_id = Company.id  ";

            Company.query(query, null,
                function (err, request) {
                    var company;

                    try {
                        if (err) {
                            next(err);
                        } else {
                            if (request.rows.length === 1) {
                                company = request.rows[0];
                                next(null, company);
                            } else {
                                next({message: "No company found"});
                            }
                        }
                    } catch (err) {
                        next({message: err.message});
                    }

                });

        } catch (err) {
            next({message: err.message});
        }
    },

    companyCandidate: function (company, res) {
        CompanyCandidates.findByCompany_id(company.id).done(
            function (err, cc) {
                try {
                    if (err) {
                        return res.send({message: err.message}, 500);
                    } else {
                        company.candidates = cc;
                        Company.companyJobs(company, res);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500)
                }
            }
        );
    },

    companyJobs: function (company, res) {
        Job.findByCompany_id(company.id).sort('createdAt DESC').done(
            function (err, cc) {
                try {
                    if (err) {
                        return res.send({message: err.message}, 500);
                    } else {
                        company.jobs = cc;

                        for (var i = 0; i < company.jobs.length; i++) {
                            var datetime = company.jobs[i].createdAt;
                            company.jobs[i].postedOn = datetime.toDateString();
                        }

                        Company.companyChallenges(company, res);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500)
                }
            }
        );
    },

    companyChallenges: function (company, res) {
        Challenge.findByCompany_id(company.id).done(
            function (err, cc) {
                try {
                    if (err) {
                        return res.send({message: err.message}, 500);
                    } else {
                        company.challenges = cc;

                        for (var i = 0; i < company.challenges.length; i++) {
                            var datetime = company.challenges[i].createdAt;
                            company.challenges[i].postedOn = datetime.toDateString();
                        }

                        Company.findEvent(company, res);
                    }
                } catch (err) {
                    return res.send({message: err.message}, 500)
                }
            }
        );
    },

    findEvent: function (company, res) {
        CompanyEvent.findByCompany_id(company.id).done(
            function (err, company_events) {
                try {
                    if (err) {
                        return res.send({ message: err.message }, 500);
                    } else {
                        var currentDate = new Date();
                        var events = [];
                        for (var i = 0; i < company_events.length; i++) {
                            if(company_events[i].date >= currentDate){
                                var event = company_events[i];
                                var datetime = event.date;
                                event.date = CompanyEvent.getDateFormat(datetime);
                                events.push(event);
                            }
                        }
                        company.events = events;

                        Company.companyMedia(company, res);
                        // return res.send(company, 200);
                    }
                } catch (err) {
                    return res.send({ message: err.message }, 500)
                }
            }
        );
    },

    companyMedia: function (company, res) {
        CompanyMedia.findByCompany_id(company.id).done(
            function (err, company_media) {
                try {
                    if (err) {
                        return res.send({ message: err.message }, 500);
                    } else {
                        company.media = company_media;
                        Company.companyCriteria(company, res);
                    }
                } catch (err) {
                    return res.send({ message: err.message }, 500)
                }
            }
        );
    },

    companyCriteria : function (company, res) {
        CriteriaSearch.findByCompany_id(company.id).done(
            function (err, company_criteria) {
                try {
                    if(err) {
                        return res.send({ message : err.message }, 500);
                    } else {
                        console.log("Company has been updated");
                        company.criteria = company_criteria;
                        return res.send(company, 200);
                    }
                } catch(err) {
                    return res.send({ message : err.message }, 500)
                }
            }
        );
    },

    getCompanyData: function (company, res) {
        async.waterfall([
            function (callback) {
                CompanyMedia.findByCompany_id(company.id).done(
                    function (err, company_media) {
                        try {
                            if (err) {
                                return res.send({ message: err.message }, 500);
                            } else {
                                company.media = company_media;
                                callback(null, company);
                            }
                        } catch (err) {
                            return res.send({ message: err.message }, 500)
                        }
                    }
                );
            },
            function (company, callback) {
                CompanyCandidates.findByCompany_id(company.id).done(
                    function (err, cc) {
                        try {
                            if (err) {
                                return res.send({message: err.message}, 500);
                            } else {
                                company.candidates = cc;
                                callback(null, company);
                            }
                        } catch (err) {
                            return res.send({message: err.message}, 500)
                        }
                    }
                );
            },
            function (company, callback) {
                Job.findByCompany_id(company.id).done(
                    function (err, jobs) {
                        try {
                            if (err) {
                                return res.send({message: err.message}, 500);
                            } else {
                                company.jobs = jobs;

                                for (var i = 0; i < company.jobs.length; i++) {
                                    var datetime = company.jobs[i].createdAt;
                                    company.jobs[i].postedOn = datetime.toDateString();
                                }
                                callback(null, company);
                            }
                        } catch (err) {
                            return res.send({message: err.message}, 500)
                        }
                    }
                );
            },
            function (company, callback) {
                CompanyEvent.findByCompany_id(company.id).done(
                    function (err, company_events) {
                        try {
                            if (err) {
                                return res.send({ message: err.message }, 500);
                            } else {
                                var currentDate = new Date();
                                var events = [];
                                for (var i = 0; i < company_events.length; i++) {
                                    if(company_events[i].date >= currentDate){
                                        var event = company_events[i];
                                        var datetime = event.date;
                                        event.date = CompanyEvent.getDateFormat(datetime);
                                        events.push(event);
                                    }

                                }
                                company.events = events;

                                callback(null, company);
                            }
                        } catch (err) {
                            return res.send({ message: err.message }, 500)
                        }
                    }
                );
            }
        ], function (err, company) {
            if (err) {
                return res.send('Internal Server Error', 500);
            } else {
                return res.send(company, 200);
            }
        });
    }

};
