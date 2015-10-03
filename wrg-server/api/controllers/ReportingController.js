"use strict";

var mc = (require('../../config/mainConfig.js')()),
    async = require('async');

module.exports = {


    allAlumnus: function (req, res) {
        async.waterfall([
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var limit = req.param('limit') || 12;
                var collegeName = college.name || '';
                var industriesQuery = "SELECT AlumniStory.*, UserTable.first_name,UserTable.last_name " +
                    "FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                    " WHERE CAST(UserTable.id as FLOAT)= CAST(AlumniStory.user_id as FLOAT) " +
                    " AND lower(AlumniStory.alma_mater) = lower('" + collegeName + "') LIMIT " + limit;

                AlumniStory.query(industriesQuery, null, function(err, alumnus) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            return res.send(alumnus.rows, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
        ]);

    },

    alumniEmployment: function (req, res) {
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(), year = date.getFullYear(),
                    startYear = req.body.startYear || 1900,
                    endYear = req.body.endYear || year;

                startYear = conversionutils.returnInteger(startYear);
                endYear = conversionutils.returnInteger(endYear);

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <=" + endYear;
                if(startYear === 1900 ){
                    //We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                var employmentQuery = "SELECT ProfessionalExperience.present, COUNT(*) " +
                    " FROM ProfessionalExperience, AlumniStory " +
                    " WHERE  CAST(ProfessionalExperience.alumnistory_id as FLOAT)= CAST(AlumniStory.id as FLOAT) " +
                    " AND lower(AlumniStory.alma_mater)  = lower('" + collegeName + "')" +
                    yearPart +
                    " GROUP BY ProfessionalExperience.present ";

                AlumniStory.query(employmentQuery, null, function(err, employment) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            var reportData = conversionutils.convertEmploymentToArray(employment.rows, res, collegeName, startYear, endYear);
                            //return res.send(reportData, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
        ]);

    },

    alumniIndustries: function (req, res) {
        var user_id = req.session.user.id,
            collegeName;
        if (user_id === null || user_id === undefined || user_id === '') {
            return res.send({ message : 'Reporting Error' }, 500);
        } else {
            async.waterfall([
                function (callback) {
                    callback(null);
                },
                function (callback) {
                    Reporting.getCollegeName(req, res, callback);
                },
                function (college) {
                    collegeName = college.name || '';
                    var date = new Date(), year = date.getFullYear();
                    var startYear = req.body.startYear || 1900,
                        endYear = req.body.endYear || year;

                    startYear = conversionutils.returnInteger(startYear);
                    endYear = conversionutils.returnInteger(endYear);

                    var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                    if(startYear === 1900 ){
                        //We want to show all users even though some did not enter graduation year
                        yearPart = "";
                    }

                    var industriesQuery = "SELECT AlumniStory.industry, COUNT(*) " +
                        "FROM AlumniStory " +
                        " WHERE " +
                        " lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                        yearPart +
                        " GROUP BY AlumniStory.industry";

                    AlumniStory.query(industriesQuery, null, function(err, request) {
                        try {
                            if (err) {
                                return res.send({ message : err.message }, 500);
                            } else {
                                var reportData = conversionutils.convertIndustriesToArray(request.rows);
                                return res.send(reportData, 200);
                            }
                        } catch (err) {
                            return res.send({ message : err.message }, 500);
                        }
                    });
                }
            ]);
        }
    },

    highestEducationLevel: function (req, res) {
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(), year = date.getFullYear(),
                    startYear = req.body.startYear || 1900,
                    endYear = req.body.endYear || year;

                startYear = conversionutils.returnInteger(startYear);
                endYear = conversionutils.returnInteger(endYear);

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                if(startYear === 1900 ){
                    //We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                var educationQuery = "SELECT AlumniStory.highest_edu_level, COUNT(*) " +
                    " FROM AlumniStory WHERE " +
                    " lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                    yearPart +
                    " GROUP BY AlumniStory.highest_edu_level";

                AlumniStory.query(educationQuery, null, function(err, request) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            var reportData = conversionutils.convertEducationToArray(request.rows);
                            return res.send(reportData, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
        ]);

    },

    alumniSkills: function (req, res) {
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(),
                    year = date.getFullYear(),
                    startYear = req.param('startYear') || 1900,
                    endYear = req.param('endYear') || year,
                    skill = req.param('skill') || '',
                    orderBy = req.param('order') || 1;
                orderBy = conversionutils.returnInteger(orderBy, 'Cannot convert order by number');
                // 0 - Alphabetical, 1 - highest number, 2 - lowest number
                var orderByClause = 'COUNT (*) desc'; // default for 1
                if(orderBy === 0) {
                    orderByClause = 'ProfessionalSkill.name asc';
                } else if (orderBy === 2) {
                    orderByClause = 'COUNT (*) asc';
                }

                startYear = conversionutils.returnInteger(startYear, 'Could not convert report start year');
                endYear = conversionutils.returnInteger(endYear, 'Could not convert report end year');

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                if(startYear === 1900 ){
                    //We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                var skillsQuery = " SELECT ProfessionalSkill.name, COUNT(*) " +
                    " FROM ProfessionalSkill, AlumniStory " +
                    " WHERE  CAST(ProfessionalSkill.alumnistory_id as FLOAT)= CAST(AlumniStory.id as FLOAT) " +
                    " AND lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                    yearPart +
                    " GROUP BY ProfessionalSkill.name ORDER BY " + orderByClause +
                    " LIMIT 20";

                AlumniStory.query(skillsQuery, null, function(err, alumniSkills) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            var reportData = conversionutils.convertSkillsToArray(alumniSkills.rows);
                            return res.send(reportData, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
        ]);

    },

    getAlumnusEmployment: function (req, res) {
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(),
                    year = date.getFullYear(),
                    startYear = req.param('startYear') || 1900,
                    endYear = req.param('endYear') || year,
                    alumniEmployment = req.param('employment') || '';

                startYear = conversionutils.returnInteger(startYear);
                endYear = conversionutils.returnInteger(endYear);

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                if(startYear === 1900 ){
                    //We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                if (alumniEmployment === 'Employed') {
                    alumniEmployment = true;

                    var employmentQuery = "SELECT AlumniStory.*, UserTable.first_name, UserTable.last_name, ProfessionalExperience.present " +
                        " FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable, ProfessionalExperience " +
                        " WHERE CAST(UserTable.id as FLOAT) = CAST(AlumniStory.user_id as FLOAT) and " +
                        " CAST(ProfessionalExperience.alumnistory_id as FLOAT) = CAST(AlumniStory.id as FLOAT) " +
                        " AND lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                        yearPart +
                        " AND ProfessionalExperience.present = " + alumniEmployment;

                    AlumniStory.query(employmentQuery, null, function(err, alumnus) {
                        try {
                            if (err) {
                                return res.send({ message : err.message }, 500);
                            } else {
                                return res.send(alumnus.rows, 200);
                            }
                        } catch (err) {
                            return res.send({ message : err.message }, 500);
                        }
                    });
                } else {
                    // There is no information of unemployment in Experience table
                    // Need to take another approach here
                    alumniEmployment = true;
                    var findEmployedQuery = "SELECT AlumniStory.*, UserTable.first_name, UserTable.last_name, ProfessionalExperience.present " +
                        " FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable, ProfessionalExperience " +
                        " WHERE CAST(UserTable.id as FLOAT) = CAST(AlumniStory.user_id as FLOAT) and " +
                        " CAST(ProfessionalExperience.alumnistory_id as FLOAT) = CAST(AlumniStory.id as FLOAT) " +
                        " AND lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                        yearPart +
                        " AND ProfessionalExperience.present = " + alumniEmployment;

                    AlumniStory.query(findEmployedQuery, null, function(err, alumnus) {
                        try {
                            if (err) {
                                return res.send({ message : err.message }, 500);
                            } else {
                                var employed = alumnus.rows;
                                var query = "SELECT AlumniStory.*, UserTable.first_name, UserTable.last_name " +
                                    " FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                                    " WHERE CAST(UserTable.id as FLOAT) = CAST(AlumniStory.user_id as FLOAT) and " +
                                    " lower(AlumniStory.alma_mater) LIKE lower('%" + collegeName + "%')" +
                                    yearPart;
                                AlumniStory.query(query, null, function(err, alumnus) {
                                    if (err) {
                                        return res.send({ message : err.message }, 500);
                                    } else {
                                        var unemployedObj = alumnus.rows;
                                        for(var i = 0; i < employed.length; i++) {
                                            for (var j = 0; j < alumnus.rows.length; j++) {
                                                if (employed[i].id === alumnus.rows[j].id){
                                                    unemployedObj[j].employed = true;
                                                    unemployedObj.splice(j, 1);
                                                }
                                            }
                                        }
                                        return res.send(unemployedObj, 200);
                                    }
                                });
                            }
                        } catch (err) {
                            return res.send({ message : err.message }, 500);
                        }
                    });
                }

            }
        ]);

    },

    getAlumnusIndustry: function (req, res) {
        async.waterfall([
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(), year = date.getFullYear(),
                    startYear = req.param('startYear') || 1900,
                    endYear = req.param('endYear') || year,
                    alumniIndustry = req.param('industry') || '';

                startYear = conversionutils.returnInteger(startYear);
                endYear = conversionutils.returnInteger(endYear);

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                if(startYear === 1900 ){
                    //Specific search year is not enetered. We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                var industriesQuery = "SELECT AlumniStory.*, UserTable.first_name,UserTable.last_name " +
                    "FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                    " WHERE CAST(UserTable.id as FLOAT)= CAST(AlumniStory.user_id as FLOAT)  " +
                    yearPart +
                    " AND lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                    " AND lower(AlumniStory.industry) = lower('" + alumniIndustry + "')";

                AlumniStory.query(industriesQuery, null, function(err, alumnus) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            return res.send(alumnus.rows, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
          ]);

    },

    getAlumnusEducation: function (req, res) {
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(), year = date.getFullYear(),
                    startYear = req.param('startYear') || 1900,
                    endYear = req.param('endYear') || year,
                    educationLevel = req.param('education') || '';

                startYear = conversionutils.returnInteger(startYear);
                endYear = conversionutils.returnInteger(endYear);

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                if(startYear === 1900 ){
                    //We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                var industriesQuery = "SELECT AlumniStory.*, UserTable.first_name,UserTable.last_name " +
                    "FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable" +
                    " WHERE CAST(UserTable.id as FLOAT)= CAST(AlumniStory.user_id as FLOAT) and " +
                    " lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                    yearPart +
                    " AND lower(AlumniStory.highest_edu_level) LIKE lower('%" + educationLevel + "%')";

                AlumniStory.query(industriesQuery, null, function(err, alumnus) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            return res.send(alumnus.rows, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
        ]);

    },

    getAlumnusSkills: function (req, res) {
        async.waterfall([
            function (callback) {
                callback(null);
            },
            function (callback) {
                Reporting.getCollegeName(req, res, callback);
            },
            function (college) {
                var collegeName = college.name,
                    date = new Date(),
                    year = date.getFullYear(),
                    startYear = req.param('startYear') || 1900,
                    endYear = req.param('endYear') || year,
                    skill = req.param('skill') || '';

                startYear = conversionutils.returnInteger(startYear);
                endYear = conversionutils.returnInteger(endYear);

                var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
                if(startYear === 1900 ){
                    //We want to show all users even though some did not enter graduation year
                    yearPart = "";
                }

                var skillsQuery = "SELECT AlumniStory.*, UserTable.first_name, UserTable.last_name, ProfessionalSkill.name " +
                    " FROM AlumniStory, " + mc.dbSettings.dbName + ".public.User as UserTable, ProfessionalSkill " +
                    " WHERE CAST(UserTable.id as FLOAT) = CAST(AlumniStory.user_id as FLOAT) and " +
                    " CAST(ProfessionalSkill.alumnistory_id as FLOAT) = CAST(AlumniStory.id as FLOAT) and " +
                    " lower(AlumniStory.alma_mater) = lower('" + collegeName + "')" +
                    yearPart +
                    " AND lower(ProfessionalSkill.name) = lower('" + skill + "')";

                AlumniStory.query(skillsQuery, null, function(err, alumnus) {
                    try {
                        if (err) {
                            return res.send({ message : err.message }, 500);
                        } else {
                            return res.send(alumnus.rows, 200);
                        }
                    } catch (err) {
                        return res.send({ message : err.message }, 500);
                    }
                });
            }
        ]);

    },


    _config: {}
};
