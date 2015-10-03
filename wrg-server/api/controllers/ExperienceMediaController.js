/**
 * ExperienceMediaController
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
			ExperienceMedia.create(req.body).done(
				function(err,experience_media){
					try{
						if (err){
						    console.log("Error create media",err.detail);
						    res.send(err,500);
						}else{
						    res.send(experience_media,200);
						}
					}catch(err){
						return res.send(err.message,500);
					}
				}
			);
		}catch(err){
			return res.send(err.message,500);
		}
    },

	update: function(req,res){
		try{
			var id = req.param("id");
			ExperienceMedia.update({id: id},req.body,function(err,experience_media){
				try{
					if (err){
						console.log("Error update media",err);
						res.send(err.detail,500);
					}else{
						res.send(experience_media,200);
					}
				}catch(err){
					return res.send(err.message,500);
				}
			});
		}catch(err){
			return res.send(err.message,500);
		}
	},

    data : function(req,res){
        try{
            var id = req.param("id");
            ExperienceMedia.findOne({id: id},function(err,experience_media){
                try{
                    if (err){
                        console.log("Dont find media",err);
                        res.send(err.detail,500);
                    }else{
                        res.send(experience_media.data,200);
                    }
                }catch(err){
                    return res.send(err.message,500);
                }
            });
        }catch(err){
            return res.send(err.message,500);
        }
    },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ExperienceMediaController)
   */
  _config: {}


};
