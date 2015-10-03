/**
 * PostController
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
        try{
            Company.findMe(
                req.session.user.id,
                function(err,company){
                    if (err){
                        res.send({message:err.message})
                    }else{
                        req.body.company_id = company.id;
                        Post.new_update(req.body,
                            function(err,post){
                                try{
                                    if (err){
                                        return res.send(err,500);
                                    }else{
                                        return res.send(post,200);
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

        try{
            Company.findMe(
                req.session.user.id,
                function(err,company){
                    if (err){
                        res.send({message:err.message})
                    }else{
                        req.body.company_id = company.id;
                        Post.new_update(req.body,
                            function(err,post){
                                try{
                                    if (err){
                                        return res.send(err,500);
                                    }else{
                                        return res.send(post,200);
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
   * (specific to PostController)
   */
  _config: {}

  
};
