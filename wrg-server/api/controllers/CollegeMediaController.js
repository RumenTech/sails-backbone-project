module.exports = {

    create: function(req,res){
        try{
            CollegeMedia.create(req.body).done(
                function(err, college_media){
                    try{
                        if (err) {
                            console.log("Error create media", err.detail);
                            res.send(err, 500);
                        } else {
                            res.send(college_media, 200);
                        }
                    } catch(err) {
                        return res.send(err.message, 500);
                    }
                }
            );
        } catch(err) {
            return res.send(err.message, 500);
        }
    },

    update: function(req,res){
        try{
            var id = req.param("id");
            CollegeMedia.update({id: id}, req.body, function(err, college_media){
                try {
                    if (err) {
                        console.log("Error update media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(college_media, 200);
                    }
                } catch(err) {
                    return res.send(err.message, 500);
                }
            });
        } catch(err) {
            return res.send(err.message, 500);
        }

    },

    destroy: function(req, res) {
        try {
            CollegeMedia.destroy({id: req.body.id}).done(function(err, college_media) {
                try {
                    if (err) {
                        console.log("Error update media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(college_media, 200);
                    }
                } catch (err) {
                    res.send(err, 500);
                }
            });
        } catch (err) {
            return res.send({message : err.message}, 500);
        }
    },

    _config: {}


};
