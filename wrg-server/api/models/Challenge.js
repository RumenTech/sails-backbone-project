module.exports = {

    attributes:{
        challenge_title:{
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

        challenge_description:{
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

        skill_keywords: {
            type:'string'
        }

    },

    new_update:function (data, next) {
        try {
            //is new
            if (data.id === undefined || data.id === "") {
                delete data.id;
                Challenge.create(data).done(function (err, challenge) {
                    try {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, challenge);
                        }
                    } catch (err) {
                        next(err);
                    }
                });

                //is update
            } else {

                Challenge.update({
                        id:data.id,
                        company_id:data.company_id
                    },
                    data,
                    function (err, challenge) {
                        try {
                            if (err) {
                                next(err, null);
                            } else {
                                if (challenge.length === 1) {
                                    next(null, challenge[0]);
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
