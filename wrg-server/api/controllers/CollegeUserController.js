"use strict";

var mc = (require('../../config/mainConfig.js')());

module.exports = {

    create: function(req,res){

        try {
            var query = "SELECT College.* " +
                " FROM College," + mc.dbSettings.dbName + ".public.User as UserTable, CollegeUser "+
                " WHERE UserTable.id = '" + req.session.user.id + "' AND " +
                " CollegeUser.user_id = UserTable.id AND "+
                " CollegeUser.college_id = College.id  ";

            College.query(query, null, function(err, request) {
                try {
                    if (err) {
                        return res.send({ message : err.detail }, 500);
                    } else {
                        if (request.rows.length === 1) {

                            var data_user = {
                                first_name            : req.param('college_name'),
                                last_name             : req.param('email'),
                                email                 : req.param('email'),
                                password              : req.param('password'),
                                username              : req.param('email'),
                                role                  : 'college'
                            };

                            User.create(data_user).done( function (err, user) {
                                try {
                                    if (err) {
                                        if (err.detail) {
                                            return res.send({ message : err.detail, error : err }, 500);
                                        } else if (err.ValidationError) {
                                            return res.send({ message : "Validation Error", error : err }, 500);
                                        } else {
                                            return res.send({ message : "Error", error : err}, 500);
                                        }
                                    } else {
                                        CollegeUser.create({user_id: user.id , college_id: request.rows[0].id}).done(
                                            function(err,college_user){
                                                try{
                                                    if (err){
                                                        if (err.detail)
                                                            return res.send({ message : err.detail, error : err }, 500);
                                                        else if (err.ValidationError)
                                                            return res.send({ message : "Validation Error", error : err}, 500);
                                                        else
                                                            return res.send({ message : "Error", error : err}, 500);
                                                    } else {
                                                        return res.send( {message : "User Created Successful", user : user, college_user : college_user }, 200);
                                                    }
                                                } catch(err) {
                                                    return res.send({ message : err.mesage }, 500);
                                                }
                                            }
                                        );
                                    }
                                }catch (err){
                                    return res.send({ message : err.message }, 500);
                                }
                            });
                        } else {
                            return res.send({ message : "No college found" }, 500);
                        }
                    }
                }catch(err){
                    return res.send({ message : err.message }, 500);
                }
            });
        } catch(err) {
            return res.send({ message : err.message }, 500);
        }

    },

    _config: {}


};
