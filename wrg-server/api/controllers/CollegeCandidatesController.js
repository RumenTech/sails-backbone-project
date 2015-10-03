"use strict";

module.exports = {

    create: function(req, res){
        try{
            College.findMe( req.session.user.id, function(err, college){
                if (err) {
                    res.send({ message : err.message })
                } else {
                    CollegeCandidates.new_update( req.body, function(err, college){
                        try{
                            if (err) {
                                return res.send(err, 500);
                            } else {
                                return res.send(college, 200);
                            }
                        }catch (err){
                            return res.send({ message : err.message }, 500);
                        }
                    });
                }
            });
        } catch(err) {
            return res.send({ message : err.message }, 500);
        }
    },

    update: function(req, res){
        try{
            College.findMe(req.session.user.id, function(err, college){
                if (err) {
                    res.send({message : err.message})
                } else {
                    CollegeCandidates.new_update(req. body, function(err, college){
                        try {
                            if (err){
                                return res.send(err, 500);
                            }else{
                                return res.send(college, 200);
                            }
                        }catch (err){
                            return res.send({message : err.message}, 500);
                        }
                    });
                }
            });
        }catch(err){
            return res.send({message : err.message}, 500);
        }
    },

    destroy: function(req, res) {
        try {
            CollegeCandidates.new_update(req.session.req.body, function(err, candidates) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        console.log('Candidate deleted');
                        return res.send(candidates, 200);
                    }
                }catch (err){
                    return res.send({message : err.message}, 500);
                }
            }, 'remove');
        } catch (err) {
            return res.send({message : err.message}, 500);
        }
    },

    _config: {}

};
