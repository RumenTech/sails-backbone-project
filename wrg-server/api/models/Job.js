module.exports = {

    attributes:{
        job_title:{
            type:'string',
            required:true
        },

        contact_name:{
            type:'string',
            required:true
        },

        department:{
            type:'string'
        },

        location:{
            type:'string'
        },

        job_description:{
            type:'text',
            required:true
        },

        expected_deliverable:{
            type:'text'
        },

        difficulty_level:{
            type:'string'
        },

        apply_link:{
            type:'string',
            required:true
        },

        company_id:{
            type:'integer',
            required:true
        },

        date: {
            type: 'date'
        }

    },

    new_update:function (data, next) {
        try {
            //is new
            if (data.id === undefined || data.id === "") {
                delete data.id;
                Job.create(data).done(function (err, job) {
                    try {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, job);
                        }
                    } catch (err) {
                        next(err);
                    }
                });

                //is update
            } else {

                Job.update({
                        id:data.id,
                        company_id:data.company_id
                    },
                    data,
                    function (err, job) {
                        try {
                            if (err) {
                                next(err, null);
                            } else {
                                if (job.length === 1) {
                                    next(null, job[0]);
                                } else {
                                    next({message:'Nothing to update'});
                                }
                            }
                        } catch (err) {
                            next(err);
                        }
                    }
                );
            }
        } catch (err) {
            next(err);
        }
    }

};
