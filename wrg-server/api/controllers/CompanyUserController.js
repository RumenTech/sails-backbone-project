/**
 * CompanyUserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
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

    create: function(req,res){

        try{

            var query = "SELECT Company.* " +
                " FROM Company, " + mc.dbSettings.dbName + ".public.User as UserTable, CompanyUser "+
                " WHERE UserTable.id = '"+req.session.user.id+"' AND " +
                " CompanyUser.user_id = UserTable.id AND "+
                " CompanyUser.company_id = Company.id  ";


            Company.query(query,null,
                function(err, request) {

                    try{
                        if (err){
                            return res.send({message:err.detail},500);
                        }else{
                            if (request.rows.length == 1){

                                var data_user = {
                                    first_name            : req.param('first_name'),
                                    last_name             : req.param('last_name'),
                                    email                 : req.param('email'),
                                    password              : req.param('password'),
                                    username              : req.param('email'),
                                    role                  : 'company'
                                };

                                User.create(data_user).done(
                                    function(err,user){
                                        try{

                                            if (err){
                                                if (err.detail)
                                                    return res.send({message: err.detail,error:err},500);
                                                else if (err.ValidationError)
                                                    return res.send({message: "Validation Error",error:err},500);
                                                else
                                                    return res.send({message: "Error", error:err},500);

                                            }else{

                                                CompanyUser.create({user_id: user.id , company_id: request.rows[0].id}).done(
                                                    function(err,company_user){
                                                        try{
                                                            if (err){
                                                                if (err.detail)
                                                                    return res.send({message: err.detail,error:err},500);
                                                                else if (err.ValidationError)
                                                                    return res.send({message: "Validation Error",error:err},500);
                                                                else
                                                                    return res.send({message: "Error", error:err},500);
                                                            }else{
                                                                return res.send({message: "User Created Successful", user: user, company_user: company_user},200);
                                                            }
                                                        }catch(err){
                                                            return res.send({message: err.mesage},500);
                                                        }
                                                    }
                                                );
                                            }

                                        }catch (err){
                                            return res.send({message: err.message},500);
                                        }

                                    }
                                );



                            }else{
                                return res.send({message:"No company found"},500);
                            }
                        }
                    }catch(err){
                        return res.send({message:err.message},500);
                    }

                });



        }catch(err){
            return res.send({message:err.message},500);
        }

    },

    find: function(req,res){

        try{

            var query = "SELECT UserTable.first_name,UserTable.last_name,UserTable.email, " +
                " UserTable.id as user_id, CompanyUser2.id as company_user_id  " +
                " FROM  " + mc.dbSettings.dbName + ".public.User as UserTable, CompanyUser , CompanyUser as CompanyUser2 "+
                " WHERE CompanyUser.user_id = '"+req.session.user.id+"' and "+
                " CompanyUser2.company_id = CompanyUser.company_id and UserTable.id = CompanyUser2.user_id";


            Company.query(query,null,
                function(err, request) {

                    try{
                        if (err){
                            return res.send({message:err.message},500);
                        }else{

                                return res.send(request.rows,200);

                        }
                    }catch(err){
                        return res.send({message:err.message},500);
                    }

                });



        }catch(err){
            return res.send({message:err.message},500);
        }

    },

    update: function(req,res){
        try{
            Company.findMe(
                req.session.user.id,
                function(err,company){
                    try{
                        if(err){
                            return res.send({message:err.message},500);
                        }else{
                            delete req.body.id;
                            delete req.body.role;
                            if (req.body.email){
                                req.body.username = req.body.email;
                            }else{
                                delete req.body.username;
                            }

                            var password = '';
                            if (req.body.password){
                               password = req.body.password;
                            }
                            delete req.body.password;

                            User.hashPassword(
                                password,
                                function(err,hash){
                                    try{
                                        if (err){
                                            return res.send(err,500);
                                        }else{

                                            if (hash != ''){
                                                req.body.password = hash;
                                            }
                                            User.update(
                                                {id: req.param('user_id')},
                                                req.body,
                                                function(err,user){
                                                    try{
                                                        if (err){
                                                            return res.send({message : err.detail},500);
                                                        }else{
                                                            return res.send(user,200);
                                                        }

                                                    }catch (err){
                                                        return res.send({message : err.message},500);
                                                    }
                                                }
                                            );

                                        }

                                    }catch(err){
                                        return res.send(err,500);
                                    }
                                }
                            );

                        }

                    }catch(err){
                        return res.send({message: err.message},500);
                    }
                }
            );
        }catch(err){
            return res.send({message:err.message},500);
        }
    },
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CompanyUserController)
   */
  _config: {}

  
};
