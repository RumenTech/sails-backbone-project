module.exports = {

    create: function(req,res){
        ProfessionalExperienceCategory.create(req.body).done(function(err,experience_category){
            if (err){
                sails.log.error("Error creating porfessional experience category ", err);
                res.send(err,500);
            }else{
                res.send(experience_category,200);
            }
        })
    },

    update: function(req,res){
        var id = req.param("id");
        ProfessionalExperienceCategory.update({id: id},req.body,function(err,experience_category){
            if (err){
                sails.log.error("Error updating professional experience category ", err);
                res.send(err,500);
            } else{
                res.send(experience_category);
            }
        });
    }

};
