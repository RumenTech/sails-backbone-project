module.exports = {

    create:function (req, res) {
        var gpa = null, experience_points = null;
        if(req.body.gpa !== '' && req.body.gpa !== undefined) {
            gpa = conversionutils.returnInteger(req.body.gpa, 'Error in converting GPA');
        }
        if(req.body.experience_points !== '' && req.body.experience_points !== undefined) {
            experience_points = conversionutils.returnInteger(req.body.experience_points, 'Error in converting GPA');
        }

        req.body.gpa = gpa;
        req.body.experience_points = experience_points;

        CriteriaSearch.create(req.body).done(function (err, criteria_search) {
            try {
                if (err) {
                    console.log("Error creating criteria search", err);
                    return res.send(err, 500);
                } else {
                    return res.send(criteria_search, 200);
                }
            } catch (err) {
                console.log(err.message);
                return res.send(err.message, 500);
            }
        })
    },

    update:function (req, res) {

        var id = req.body.id;

        CriteriaSearch.update({id:id}, req.body, function (err, criteria_search) {
            try {
                if (err) {
                    console.log("Error updating criteria search", err);
                    return res.send(err.message, 500);
                } else {
                    return res.send(criteria_search, 200);
                }
            } catch (err) {
                console.log(err.message);
                return res.send(err.message, 500);
            }
        });
    },

    destroy:function (req, res) {
        var id = req.body.id;

        CriteriaSearch.destroy({id:id}).done(function (err, college_criteria) {
            try {
                if (err) {
                    return res.send({message:err}, 500);
                } else {
                    return res.send({message:'Successfully deleted'}, 200);
                }
            } catch (err) {
                return res.send({message:err}, 500);
            }
        });
    }
};
