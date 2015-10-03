/**
 * Experience
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

    attributes: {
        title:{
            type: 'string',
            required: true
        },
        organization:{
            type: 'string',
            required: true
        },
        start_date:{
            type: 'date',
            required: true
        },
        end_date:{
            type: 'string',
            required: true
        },
        description:{
            type: 'text'/*,
            required: true*/
        },
        reference_name:{
            type: 'string'/*,
            required: true*/
        },
        reference_title:{
            type: 'string'/*,
            required: true*/
        },
        reference_email:{
            type: 'string'/*,
            required: true*/
        },
        student_id:{
            type: 'int',
            required: true
        },
        present:{
            type: 'BOOLEAN'/*,
            required: false*/
        },
        toJSON: function() {
            var obj = this.toObject();
            //delete obj.password;

            return obj;
        }
    },

    diffMonths : function (start, end) {
        var start_month = parseInt(start.substring(0, 4)) * 12 + parseInt(start.substring(5, 7)) - 1;
        //console.log('start month',start_month);
        var end_month = parseInt(end.substring(0, 4)) * 12 + parseInt(end.substring(5, 7)) - 1;
        //console.log('end month',end_month);
        return Math.floor((end_month - start_month + 1) / 3);
    },

    sumPoints : function (res, experience) {
        var query = "SELECT category_id, student_id, sum(points) points FROM StudentPoints " +
            "where student_id = "+ experience.student_id +" group by category_id, student_id";
        StudentPoints.query(query, null,
            function (err, points) {
                try {
                    if (err) {
                        console.log(err.message);
                        res.send(err.message, 500);
                    } else {
                        SumPoints.destroy({student_id: experience.student_id}).done(function(err, point) {
                            try {
                                if (err) {
                                    return res.send({message : err.message}, 500);
                                } else {
                                    SumPoints.create(points.rows).done(
                                        function (err, point) {
                                            try {
                                                if (err) {
                                                    return res.send(err.detail, 500);
                                                } else {
                                                    return res.send(experience, 200);
                                                }
                                            } catch (err) {
                                                return res.send(err.message, 500);
                                            }
                                        }
                                    );
                                }
                            } catch (err) {
                                return res.send({message : err.message}, 500);
                            }
                        });

                    }
                } catch (err) {
                    console.log(err.message);
                    return res.send(err.message, 500);
                }
            });
    }


};
