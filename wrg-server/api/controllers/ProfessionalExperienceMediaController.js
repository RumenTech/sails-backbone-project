module.exports = {

    create:function (req, res) {
        try {
            ProfessionalExperienceMedia.create(req.body).done(
                function (err, experience_media) {
                    try {
                        if (err) {
                            sails.log.error("Error creating media", err.detail);
                            res.send(err, 500);
                        } else {
                            res.send(experience_media, 200);
                        }
                    } catch (err) {
                        return res.send(err.message, 500);
                    }
                }
            );
        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    update:function (req, res) {
        try {
            var id = req.param("id");
            ProfessionalExperienceMedia.update({id:id}, req.body, function (err, experience_media) {
                try {
                    if (err) {
                        sails.log.error("Error updating media. ", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(experience_media, 200);
                    }
                } catch (err) {
                    return res.send(err.message, 500);
                }
            });
        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    data:function (req, res) {
        try {
            var id = req.param("id");
            ProfessionalExperienceMedia.findOne({id:id}, function (err, experience_media) {
                try {
                    if (err) {
                        sails.log.error("Did not find media", err);
                        res.send(err.detail, 500);
                    } else {
                        res.send(experience_media.data, 200);
                    }
                } catch (err) {
                    return res.send(err.message, 500);
                }
            });
        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ExperienceMediaController)
     */
    _config:{}
};
