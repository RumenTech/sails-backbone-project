"use strict";
var async = require('async'),
    mc = (require('../../config/mainConfig.js')());

module.exports = {

/*    delete : function (req, res) {
        College.destroy({name: req.headers.name}).done(function(err, colleges) {
            try {
                if (err) {
                    return res.send({message : err}, 500);
                } else {
                    User.destroy({email: req.headers.email}).done(function(err, users) {
                        try {
                            if (err) {
                                return res.send({message : err}, 500);
                            } else {
                                return res.send({message : 'Successfully deleted'}, 200);
                                //next(null, events);
                            }
                        } catch (err) {
                            return res.send({message : err}, 500);
                        }
                    });
                }
            } catch (err) {
                next(err);
            }
        });
    },*/

    deleteUser : function (req, res) {
        if(req.param('user') != 'administrator' && req.param('pass') != 'supersecretwrgpass'){
            sails.log.error('Unauthorized user tried to delete user with id: ' + req.param('userId'));
            return res.send(err.message, 500);
        }

        var userId = req.param('userId'),
            userRoleQuery = "SELECT UserTable.role FROM " + mc.dbSettings.dbName + ".public.User as UserTable WHERE UserTable.id = " + userId,
            userRole;
        User.query(userRoleQuery, null, function(err, role){
            try {
                if (err) {
                    return res.send(err.message, 500);
                } else {
                    console.log('Getting user role');
                    userRole = role.rows[0].role;
                    switch(userRole){
                        case "student":
                            Delete.deleteStudent(res, userId);
                            break;
                        case "alumni":
                            Delete.deleteAlumni(res, userId);
                            break;
                        case "company":
                            Delete.deleteCompany(res, userId);
                            break;
                        case "college":
                            Delete.deleteCollege(res, userId);
                            break;
                        default :
                            break;
                    }
                }
            } catch (err) {
                res.send(err, 500);
            }
        });
    }
};