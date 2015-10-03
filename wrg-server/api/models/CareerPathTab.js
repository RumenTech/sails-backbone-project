/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {

    attributes: {
        tab_name:{
            type: 'string',
            required: true
        },
        school_type:{
            type: 'string',
            required: true
        },
        description:{
            type: 'string',
            required: false
        }
    },

    getBySchoolType: function(schoolType, res){
        CareerPathTab.find({school_type: schoolType}, function(err, tabs){
            if(err){
                sails.log.error(err);
                return res.send(err, 500);
            }
            else{
                sails.log.info('Career path tabs found.');
                return res.send(tabs, 200);
            }
        });
    },

    getUserInfo: function(req, callback){
        var userId = req.session.user.id,
            userRole = req.session.user.role,
            query = '';

        if(userRole === 'student' || userRole === 'admin'){
            query = 'SELECT student.school_list_id, schoollist.school_type ' +
                    'FROM student, schoollist ' +
                    'WHERE CAST(student.user_id AS INT) = ' + userId + ' AND student.school_list_id = schoollist.id';
        }
        else if(userRole === 'alumni'){
            query = 'SELECT alumnistory.school_list_id, schoollist.school_type ' +
                    'FROM alumnistory, schoollist ' +
                    'WHERE CAST(alumnistory.user_id AS INT) = ' + userId + ' AND alumnistory.school_list_id = schoollist.id';
        }
        else{
            query = 'SELECT college.school_list_id, schoollist.school_type ' +
                    'FROM college, schoollist, collegeuser ' +
                    'WHERE CAST(collegeuser.user_id AS INT) = ' + userId + ' AND collegeuser.college_id = college.id AND college.school_list_id = schoollist.id';
        }

        User.query(query, function(err, data){
            if(err){
                sails.log.error('Error retrieving users college data: ' + err.message);
                callback({error: err.message});
            }
            else{
                if(data.rows[0]){
                    if(data.rows[0].school_type === 1){
                        data.rows[0].school_type = 'college';
                    }
                    else{
                        data.rows[0].school_type = 'high_school';
                    }
                    callback(data.rows[0]);
                }
                else{
                    sails.log.error('User does not have college set');
                    callback({error: 'User does not have college set'});
                }
            }
        });
    }
};