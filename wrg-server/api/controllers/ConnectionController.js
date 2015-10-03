/**
 * Created with JetBrains PhpStorm.
 * User: miguel
 * Date: 29/10/13
 * Time: 20:10
 * To change this template use File | Settings | File Templates.
 */
/**
 * ConnectionController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

"use strict";

var mc = (require('../../config/mainConfig.js')());


module.exports = {

    /* e.g.
     sayHello: function (req, res) {
     res.send('hello world!');
     }
     */

    create: function(req,res){

        try{
            if (req.param('request_user_id')==req.session.user.id){
                return res.send({message:'The request connection is for yourself'},500);
            }
            else{
                Connection.findOne({user_id: req.session.user.id,request_user_id:req.param('request_user_id')}).done(function(err,connection){
                    try{
                        if (err){
                            return res.send(err,500);
                        }else{
                            if (connection){
                                sails.log.info("Already connected " + connection);
                                return res.send(connection,200);
                            }else{
                                //if not exist connection
                                Connection.update({request_user_id: req.session.user.id,user_id:req.param('request_user_id')},
                                    {'confirmation': 1},
                                    function(err,connection){
                                        try{
                                            if (err)
                                                return res.send(err,500);
                                            else{
                                                if (connection.length != 0){
                                                    //if the other user accept in the past, then this user accept now.
                                                    Connection.create({user_id: req.session.user.id,request_user_id: req.param('request_user_id'), confirmation: '1'}).done(function(err,connection){
                                                        if (err){
                                                            sails.log.error("Error creating connection");
                                                            return res.send(err,500);
                                                        }else{
                                                            sails.log.info("New connection created");
                                                            var feedEntry = {};
                                                            feedEntry.user_id = req.session.user.id;
                                                            feedEntry.user_role = req.session.user.role;
                                                            feedEntry.event_type ='connection';
                                                            feedEntry.connection_id = connection.request_user_id;
                                                            Feed.addFeedEvent(feedEntry);
                                                            return res.send(connection, 200);
                                                        }
                                                    });
                                                }else{
                                                    Connection.create({user_id: req.session.user.id,request_user_id: req.param('request_user_id'), confirmation: '0'}).done(function(err,connection){
                                                        try{
                                                            if (err){
                                                                console.log("Error create connection",err);
                                                                return res.send(err,500);
                                                            }else{
                                                                console.log("new connection",connection);
                                                                var body = {};
                                                                body.receiver_id = req.param('request_user_id');
                                                                body.owner_id = req.param('request_user_id');
                                                                body.sender_id = null;
                                                                body.content = "You have new friend request." + req.session.user.first_name + " " + req.session.user.last_name + " wants to be friend with you.";
                                                                body.subject = 'WRG';
                                                                body.is_read = false;
                                                                body.is_flagged = false;
                                                                body.send_on = new Date();
                                                                body.is_deleted = false;

                                                                Message.new_update(body, function (err, studentmessage) {
                                                                        try {
                                                                            if (err) {
                                                                                return res.send(err, 500);
                                                                            } else {
                                                                                // return res.send(studentmessage, 200);
                                                                            }
                                                                        } catch (err) {
                                                                            return res.send({message:err.message}, 500);
                                                                        }
                                                                });


                                                                User.findOneById(req.param('request_user_id')).done(function (err, user) {

                                                                    // Error handling
                                                                    if (err) {
                                                                        console.log(err);
                                                                        return res.send(err, 500);
                                                                        // The Books were found successfully!
                                                                    } else {
                                                                        var userFriend = {
                                                                            hash:hashSetter.hashedValue(),
                                                                            email:user.email,
                                                                            user_id:user.id,
                                                                            first_name:user.first_name,
                                                                            friend_name:req.session.user.first_name + " " + req.session.user.last_name
                                                                        };

                                                                        templateresolver.resolveTemplate(userFriend, 'friend');
                                                                    }
                                                                });



                                                                return res.send(connection,200);
                                                            }
                                                        }catch(err){
                                                            console.log(err.message);
                                                            return res.send(err.message,500);
                                                        }
                                                    });
                                                }
                                            }

                                        }catch(err){
                                            return res.send(err.message,500);
                                        }

                                    })
                                ;
                            }
                        }
                    }catch(err){
                        return res.send(err.message,500);
                    }
                });
            }
        }catch(err){
            return res.send(err.message,500);
        }

    },

    update: function(req,res){
        return res.send({message:'this function is disable'},400);
    },

    request: function(req,res){
        try{

            var limit = req.param('limit');
            limit = (limit==undefined)? 40 : limit;

            var offset = req.param('offset');
            offset = (offset== undefined)? 0 : offset;

            var query = "SELECT Connection.id,Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name , "+
                " StudentTable.id as student_id, AlumniTable.id as alumni_id, "+
                "    CASE WHEN StudentTable.id > 0 THEN StudentTable.profile_image "+
                " ELSE AlumniTable.profile_image "+
                " END as profile_image, "+
                "    CASE WHEN StudentTable.id > 0 THEN StudentTable.major  || ' at ' ||  StudentTable.school "+
                " ELSE AlumniTable.major  || ' at ' ||  AlumniTable.alma_mater "+
                " END as information "+
                " FROM Connection, " + mc.dbSettings.dbName + ".public.User as UserTable "+
                " LEFT JOIN " + mc.dbSettings.dbName + ".public.Student as StudentTable ON CAST(StudentTable.user_id as float)= cast(UserTable.id as FLOAT) "+
                " LEFT JOIN " + mc.dbSettings.dbName + ".public.AlumniStory as AlumniTable ON CAST(AlumniTable.user_id as float)= cast(UserTable.id as FLOAT) "+
                " WHERE Connection.request_user_id = '"+req.session.user.id+"' AND Connection.confirmation ='0' AND "+
                " CAST(UserTable.id as FLOAT)= CAST(Connection.user_id as FLOAT) "+
                " GROUP BY Connection.id,Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name ,StudentTable.id,AlumniTable.id "+
                " LIMIT "+ limit +" OFFSET "+ offset;

            Connection.query(query,null,
                function(err, connections) {
                    try{
                        if (err){
                            console.log(err.message);
                            res.send(err.message,500);
                        }else{
                            return res.send({request:connections.rows},200);
                        }
                    }catch(err){
                        console.log(err.message);
                        return res.send(err.message,500);
                    }
                } );

        }catch(err) {
            return res.send(err.message,500);
        }
    },

    friends: function(req,res){
        try{

            var limit = req.param('limit');
            limit = limit || 10;

            var offset = req.param('offset');
            offset = offset || 0;

            var name = req.param('name');
            name = name || '';

            var company = req.param('company');
            company = company || '';

            var school = req.param('school');
            school = school || '';

            var major = req.param('major');
            major = major || '';
            var query = "SELECT UserTable.first_name, UserTable.last_name, UserTable.id as user_id, UserTable.role as role, "+
                " CASE WHEN Student.id >0 THEN Student.major || ' at ' || Student.school "+
                " WHEN AlumniStory.id >0 THEN  AlumniStory.major || ' at ' || AlumniStory.alma_mater "+
                " ELSE 'Empty' "+
                " END as information,AlumniStory.company, "+
                " CASE WHEN Student.id >0 THEN Student.profile_image "+
                " WHEN AlumniStory.id >0 THEN AlumniStory.profile_image "+
                " ELSE 'Empty' "+
                " END as profile_image "+
                " FROM " + mc.dbSettings.dbName + ".public.User as UserTable "+
                " LEFT JOIN Student ON CAST(Student.user_id as numeric) = CAST(UserTable.id as numeric) "+
                " LEFT JOIN AlumniStory ON CAST(AlumniStory.user_id as numeric) = CAST(UserTable.id as numeric) "+
                " WHERE UserTable.id <> '"+req.session.user.id+"' AND UserTable.id NOT IN ( "+
                "    SELECT request_user_id "+
                " FROM Connection "+
                " WHERE user_id = '"+req.session.user.id+"' ) AND " +
                " ( lower(concat(UserTable.first_name, ' ', UserTable.last_name)) LIKE lower('%"+ name +"%'))  AND "+
                " ( " +
                "   (lower(Student.major) LIKE lower('%"+ major +"%') AND UserTable.role = 'student') OR " +
                "   (lower(AlumniStory.major) LIKE lower('%"+ major +"%') AND UserTable.role = 'alumni') " +
                " ) AND ( " +
                "       (lower(AlumniStory.company) LIKE lower('%"+ company +"%') AND UserTable.role = 'alumni') OR " +
                "       (UserTable.role = 'student' AND '' = '"+ company +"') " +
                "  )  AND ( " +
                "       (lower(AlumniStory.alma_mater) LIKE lower('%"+ school +"%') AND UserTable.role = 'alumni') OR " +
                "       (lower(Student.school) LIKE lower('%"+ school +"%') AND UserTable.role = 'student') " +
                "  ) "+
                " ORDER BY (CASE WHEN UserTable.role = 'student' THEN NULLIF(Student.profile_image, '')" +
                " WHEN UserTable.role = 'alumni' THEN NULLIF(AlumniStory.profile_image, '')" +
                " END ) DESC NULLS LAST "+
                " LIMIT "+ limit +" OFFSET "+ offset;

            Connection.query(query,null,
                function(err, connections) {
                    try{
                        if (err){
                            console.log(err.message);
                            res.send(err.message,500);
                        }else{
                            return res.send({request:connections.rows},200);
                        }
                    }catch(err){
                        console.log(err.message);
                        return res.send(err.message,500);
                    }
                } );

        }catch(err) {
            return res.send(err.message,500);
        }
    },

    me: function(req,res){

        try{

            var limit = req.param('limit');
            limit = (limit==undefined)? 'ALL' : limit;

            var offset = req.param('offset');
            offset = (offset== undefined)? 0 : offset;

            var query = "SELECT Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name , "+
                " StudentTable.id as student_id, AlumniTable.id as alumni_id, "+
                "    CASE WHEN StudentTable.id > 0 THEN StudentTable.profile_image "+
                " ELSE AlumniTable.profile_image "+
                " END as profile_image, "+
                "    CASE WHEN StudentTable.id > 0 THEN StudentTable.major  || ' at ' ||  StudentTable.school "+
                " ELSE AlumniTable.job_title  || ' at ' ||  AlumniTable.company "+
                " END as information "+
                " FROM Connection, " + mc.dbSettings.dbName + ".public.User as UserTable "+
                " LEFT JOIN " + mc.dbSettings.dbName + ".public.Student as StudentTable ON CAST(StudentTable.user_id as float)= cast(UserTable.id as FLOAT) "+
                " LEFT JOIN " + mc.dbSettings.dbName + ".public.AlumniStory as AlumniTable ON CAST(AlumniTable.user_id as float)= cast(UserTable.id as FLOAT) "+
                " WHERE Connection.user_id = '"+req.session.user.id+"' AND Connection.confirmation ='1' AND "+
                " CAST(UserTable.id as FLOAT)= CAST(Connection.request_user_id as FLOAT) "+
                " GROUP BY Connection.user_id,Connection.request_user_id,UserTable.first_name,UserTable.last_name ,StudentTable.id,AlumniTable.id "+
                " LIMIT "+ limit +" OFFSET "+ offset +" ";

            Connection.query(query,null,
                function(err, connections) {
                    try{
                        // Error handling
                        if (err) {
                            console.log(err.message);
                            return res.send(err.message,500);
                        } else {
                            return res.send(connections.rows,200);
                        }
                    }catch(err){
                        console.log(err.message);
                        return res.send(err.message,500);
                    }
                }
            );

        }catch (err){
            console.log(err.message);
            return res.send(err.message,500);
        }



    }

};