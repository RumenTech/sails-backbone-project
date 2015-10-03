/**
 * CompanyCandidatesController
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

module.exports = {


    create: function(req,res){
        //Defense - Authorization
        if (!req.isAuthenticated()) {
            return  res.view('404');
        }
        //Defense - UserType
        var userRole = req.session.user.role;
        if (userRole !== 'company') {
            return  res.view('404');  //only company users can have access to companycandidates
        }

        try{
            Company.findMe(
                req.session.user.id,
                function(err,company){
                    if (err){
                        res.send({message:err.message})
                    }else{

                        CompanyCandidates.new_update(req.body,
                            function(err,company){
                                try{
                                    if (err){
                                        return res.send(err,500);
                                    }else{
                                        return res.send(company,200);
                                    }
                                }catch (err){
                                    return res.send({message:err.message},500);
                                }
                            }
                        );

                    }
                }
            );
        }catch(err){
            return res.send({message:err.message},500);
        }
    },

    update: function(req,res){
        //Defense - Authorization
        if (!req.isAuthenticated()) {
            return res.view('404');
        }
        //Defense - UserType
        var userRole = req.session.user.role;
        if (userRole !== 'company') {
            return res.view('404');  //only company users can have access to companycandidates
        }

        try{
            Company.findMe(
                req.session.user.id,
                function(err,company){
                    if (err){
                        res.send({message:err.message})
                    }else{

                        CompanyCandidates.new_update(req.body,
                            function(err,company){
                                try{
                                    if (err){
                                        return res.send("Error",500);
                                    }else{
                                        return res.send(company,200);
                                    }
                                }catch (err){
                                    return res.send({message:err.message},500);
                                }
                            }
                        );

                    }
                }
            );
        }catch(err){
            return res.send({message:err.message},500);
        }
    },



    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to CompanyCandidatesController)
    */
    _config: {}

};
