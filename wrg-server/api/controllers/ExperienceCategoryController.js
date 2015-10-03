/**
 * ExperienceCategoryController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

    create: function(req,res){
        ExperienceCategory.create(req.body).done(function(err,experience_category){
            if (err){
                console.log("Error create ExperienceCategory",err);
                res.send(err,500);
            }else{
                res.send(experience_category,200);
            }
        })
    },

    update: function(req,res){
        var id = req.param("id");
        ExperienceCategory.update({id: id},req.body,function(err,experience_category){
            if (err){
                console.log("Error update ExperienceCategory",err);
                res.send(err,500);
            } else{
                res.send(experience_category);
            }
        });
    }

};
