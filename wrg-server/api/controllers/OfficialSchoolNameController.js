/**
 * OfficialSchoolNameController
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
    
  find: function(req,res){
    try{

        var name = req.param('name');

        //var query = "SELECT name,state FROM OfficialSchoolName WHERE lower(name) LIKE lower('%"+ name + "%') OR lower(state)= lower('"+name+"')";

        var query = "SELECT name,state FROM OfficialSchoolName WHERE lower(name) LIKE lower('%"+ name + "%')";

        OfficialSchoolName.query(
            query,
            null,
            function(err, school_names){
                try{
                    if (err){
                        return res.send({message:err.message},500);
                    }else{

                        return res.send(school_names.rows,200);

                    }
                }catch(err){
                    return res.send({message:err.message},500);
                }
            }
        );
    }catch(err){
        return res.send({message: err.message},500);
    }
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to OfficialSchoolNameController)
   */
  _config: {}

  
};
