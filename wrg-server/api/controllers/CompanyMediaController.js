'use strict';

module.exports = {

    create: function(req,res){
        try{
            CompanyMedia.create(req.body).done(
                function(err, company_media){
                    try{
                        if (err) {
                            console.log("Error create media", err.detail);
                            res.send(err, 500);
                        } else {
                            res.send(company_media, 200);
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
            CompanyMedia.update({id: id}, req.body, function(err, company_media){
                try {
                    if (err) {
                        console.log("Error update media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(company_media, 200);
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
            CompanyMedia.destroy({id: req.body.id}).done(function(err, company_media) {
                try {
                    if (err) {
                        console.log("Error update media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(company_media, 200);
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
