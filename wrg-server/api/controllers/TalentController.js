'use strict';
var mc = (require('../../config/mainConfig.js')());

module.exports = {
    friends:function (req, res) {
        try {

            var criteriaParams = Talent.setParams(req);

            var skill_search;
            if (criteriaParams.skill_name === '') {
                skill_search = "SELECT Student.*,UserTable.first_name,UserTable.last_name " +
                    " FROM Student, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                    " WHERE CAST(UserTable.id as FLOAT) = CAST(Student.user_id as FLOAT) AND ";
            }
            else{
                skill_search = "SELECT Student.*,UserTable.first_name,UserTable.last_name" +
                    " FROM Student, " + mc.dbSettings.dbName + ".public.User as UserTable " +
                    " WHERE CAST(UserTable.id as FLOAT) = CAST(Student.user_id as FLOAT) AND " +
                    " string_to_array(lower('"+ criteriaParams.skill_name +"'), ',') <@" +
                    " (SELECT array_agg(lower(name)) FROM Skill WHERE CAST(Student.id as INT) = CAST(Skill.student_id as INT)) AND "
            }

            if(criteriaParams.experiences.length > 0){
                for(var i = 0; i < criteriaParams.experiences.length; i++){
                    skill_search += "exists (select * from SumPoints where student_id = Student.id and category_id = " + criteriaParams.experiences[i].category_id + " AND points >= " + criteriaParams.experiences[i].points+ ") AND ";
                }
            }


            var gpa_search;
            if (criteriaParams.gpa_criteria === 'IS NULL') {
                gpa_search = "((Student.gpa IS NULL OR CAST(Student.gpa as INT) >= " + criteriaParams.gpa + ") AND UserTable.role = 'student') OR ";
            } else {
                gpa_search = "(CAST(Student.gpa as REAL) >= " + criteriaParams.gpa + " AND UserTable.role = 'student') OR ";
            }

            var query =
            skill_search +
                "( lower(concat(UserTable.first_name, ' ', UserTable.last_name)) LIKE lower('%" + criteriaParams.student_name + "%')) AND" +
                "( (lower(Student.major) LIKE lower('%" + criteriaParams.major + "%') AND UserTable.role = 'student') ) AND " +
                " ( " +
                "       (lower(Student.school) LIKE lower('%" + criteriaParams.alma_mater + "%') AND UserTable.role = 'student') OR " +
                "       (UserTable.role = 'student' AND '' = '" + criteriaParams.alma_mater + "') " +
                "  ) " +
                " AND ( " +
                gpa_search +
                "       (UserTable.role = 'student' AND '' = '" + criteriaParams.gpa + "') " +
                "  ) " +
                " LIMIT " + criteriaParams.limit + " OFFSET " + criteriaParams.offset;

            Student.query(query, null,
                function (err, connections) {
                    try {
                        if (err) {
                            sails.log.error(err.message);
                            res.send(err.message, 500);
                        } else {
                            return res.send({request:connections.rows}, 200);
                        }
                    } catch (err) {
                        sails.log.error(err.message);
                        return res.send(err.message, 500);
                    }
                });

        } catch (err) {
            return res.send(err.message, 500);
        }
    },

    you:function (req, res) {

        try {
            if (req.session) {
                var user_id = req.query.id;

                if(user_id === null || user_id === undefined) {
                    return res.send('User ID is not valid', 500);
                } else {
                    Student.findOneByUser_id(user_id).done(function (err, student) {

                        // Error handling
                        if (student === undefined) {
                            sails.log.error('Could not find student');
                            return res.send({message:'Student is undefined'}, 500);
                        }

                        if (err) {
                            sails.log.error('Did not find student. Errpr: ', err);
                            return res.send({message:err.detail}, 500);
                        } else {
                            sails.log.info('Student found with user id ', user_id);
                            Student.getUser(user_id, res, student);

                        }
                    });
                }
            } else {
                return res.send({message:'Student is undefined'}, 500);
            }

        } catch (err) {
            sails.log.error(err.message);
            return res.send(err.message, 500);
        }
    }

};