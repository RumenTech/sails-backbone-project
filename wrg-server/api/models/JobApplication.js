module.exports = {

    attributes:{
        job_id:{
            type:'integer',
            required:true
        },

        applicant_id:{
            type:'integer',
            required:true
        },

        is_responded:{
            type: 'BOOLEAN'

        },

        cover_letter:{
            type:'string'
        }

    },

    new_update:function (data, next) {
        try {
            //is new
            if (data.id === undefined || data.id === "") {
                delete data.id;
                JobApplication.create(data).done(function (err, job) {
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

                JobApplication.update({
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
    },

    checkIfUserApplied : function (req, res, callback) {
        if(!req.body.job_id) {
            req.body.job_id = conversionutils.returnInteger(req.param('job_id'));
            req.body.applicant_id = conversionutils.returnInteger(req.param('applicant_id'));
        }
        JobApplication.find()
            .where({job_id: req.body.job_id, applicant_id: req.body.applicant_id})
            .exec(function (err, jobApplication) {
                if (err) {
                    sails.log.error('An error occurred: ', err);
                    res.send(err, 500);
                } else {
                    if(jobApplication[0]) {
                        sails.log.info('User already applied for this job');
                        res.send({message: 'You have already applied'}, 200);
                    } else {
                        if(callback === 'check') {
                            res.send({message: 'User did not apply'}, 200);
                        } else {
                            callback(null);
                        }
                    }
                }
            });
    }

};

