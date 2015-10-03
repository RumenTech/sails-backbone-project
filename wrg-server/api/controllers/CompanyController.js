/**
 * CompanyController
 *
 * @module      :: Controller
 * @description    :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var mc = (require('../../config/mainConfig.js')());

module.exports = {

    me: function (req, res) {
        try {

            var query = "SELECT Company.* " +
                " FROM Company, " + mc.dbSettings.dbName + ".public.User as UserTable, CompanyUser " +
                " WHERE UserTable.id = '" + req.session.user.id + "' AND " +
                " CompanyUser.user_id = UserTable.id AND " +
                " CompanyUser.company_id = Company.id  ";


            Company.query(query, null,
                function (err, request) {

                    try {
                        if (err) {
                            return res.send({message: err.message}, 500);
                        } else {
                            if (request.rows.length == 1) {
                                company = request.rows[0];
                                Company.companyCandidate(company, res);

                            } else {
                                return res.send({message: "No company found"}, 500);
                            }
                        }
                    } catch (err) {
                        res.send({message: err.message}, 500);
                    }
                });
        } catch (err) {
            res.send({message: err.message}, 500);
        }
    },


    update: function (req, res) {

        console.log("update company");
        try {

            var query = "SELECT Company.* " +
                " FROM Company, " + mc.dbSettings.dbName + ".public.User as UserTable, CompanyUser " +
                " WHERE UserTable.id = '" + req.session.user.id + "' AND " +
                " CompanyUser.user_id = UserTable.id AND " +
                " CompanyUser.company_id = Company.id  ";


            Company.query(query, null,
                function (err, request) {

                    try {
                        if (err) {
                            return res.send({message: err.message}, 500);
                        } else {
                            if (request.rows.length == 1) {
                                company = request.rows[0];
                                Company.update({id: company.id }, req.body,
                                    function (err, company) {
                                        try {
                                            if (err) {
                                                res.send({message: err.message}, 500);
                                            } else {
                                                if (company.length == 1) {
                                                    company = company[0];
                                                    Company.companyCandidate(company, res);

                                                } else {
                                                    return res.send({message: "No company updated"}, 500);
                                                }
                                            }
                                        } catch (err) {
                                            res.send({message: err.message}, 500);
                                        }
                                    }
                                );
                            } else {
                                return res.send({message: "No company found"}, 500);
                            }
                        }
                    } catch (err) {
                        res.send({message: err.message}, 500);
                    }

                });

        } catch (err) {
            res.send({message: err.message}, 500);
        }

    },

    create: function (req, res) {
        return res.send(403);
    },

    updatePayment: function (req, res) {
        var userId = req.session.user.id,
            role = req.session.user.role;

        if(role !== 'admin') {
            res.send({message: 'No access'}, 500);
        } else {
            async.waterfall([
                function (callback) {
                    var userId = req.session.user.id;
                    User.find()
                        .where({id: userId})
                        .exec(function (err, user) {
                            if(err) {
                                sails.log.error('Cannot get user');
                                return res.send(err, 500);
                            } else {
                                if(user[0].username === mc.adminSettings.username){
                                    sails.log.info('You are a valid user');
                                    callback(null);
                                } else {
                                    sails.log.error("Nope, won't go");
                                    return res.send({message: "Nope, won't go"}, 500);
                                }
                            }
                        });
                },
                function () {
                    try {
                        var id = req.param("id"),
                            flag = req.param('flag');
                        Company.update({id: id}, {payment_flag: flag}, function(err, company){
                            try {
                                if (err) {
                                    sails.log.error("Error update company", err);
                                    res.send(err.detail, 500);
                                } else {
                                    sails.log.info("Company payment updated");
                                    res.send(company, 200);
                                }
                            } catch(err) {
                                sails.log.error("Error update company payment", err);
                                return res.send(err.message, 500);
                            }
                        });
                    } catch(err) {
                        return res.send(err.message, 500);
                    }
                }
            ]);
        }
    },

    friends: function (req, res) {
        //Todo determine the policies for Friends !!!!!!
        //Who can see and what can be seen
        //For the time being only one defense is added

        //Defense - Authenticated user
        if(!req.isAuthenticated()) {
            return res.view('404');
        }


        try {

            var limit = req.param('limit');
            limit = limit || 10;

            var offset = req.param('offset');
            offset = offset || 0;

            var name = req.param('name');
            name = name || '';

            var city = req.param('city');
            city = city || '';

            var state = req.param('state');
            state = state || '';

            var query = "SELECT id, city, state, name, profile_image, tagline, description, payment_flag" +
                " FROM Company " +
                " WHERE ( lower(Company.name) LIKE lower('%" + name + "%') OR lower(Company.tagline) LIKE lower('%" + name + "%') ) " +
                " AND (lower(Company.state) LIKE lower('%" + state + "%')  OR Company.state is NULL) " +
                " AND (lower(Company.city) LIKE lower('%" + city + "%') OR Company.city is NULL) " +
                " ORDER BY char_length(Company.profile_image) ASC " +
                " LIMIT " + limit + " OFFSET " + offset;

            Connection.query(query, null,
                function (err, connections) {
                    try {
                        if (err) {
                            console.log(err.message);
                            res.send(err.message, 500);
                        } else {
                            return res.send({request: connections.rows}, 200);
                        }
                    } catch (err) {
                        console.log(err.message);
                        return res.send(err.message, 500);
                    }
                });

        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    getbyid: function(req, res){
        if(!req.isAuthenticated()) {
            return res.send('Unauthorized', 401);
        }

        try {
            if(req){
                if(req.param('id')){
                    var companyId = req.param('id');

                    Company.find({id: companyId}).done(function(err, comp){
                        if (err) {
                            return res.send({message: err.message}, 500);
                        } else {
                            if (comp.length === 1) {
                                Company.getCompanyData(comp[0], res);
                            } else {
                                return res.send({message: "No company found"}, 500);
                            }
                        }
                    });
                }
            }
        } catch (err) {
            res.send({message: err.message}, 500);
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to CompanyController)
     */
    _config: {}


};
