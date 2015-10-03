var async = require('async');

module.exports = {

    create:function (req, res) {
        if (!req.isAuthenticated()) {
            sails.log.error("Not authenticated entry from Vote Controller");
            return  res.view('404');
        }
        try {
            var userId = req.session.user.id;
            req.body.voter_id = req.session.user.id;
            Vote.find({ voter_id:req.body.voter_id, competitor_id:req.body.competitor_id, category_id:req.body.category_id }).done(
                function (err, votes) {
                    try {
                        if (err) {
                            return res.send(err.message, 500);
                        } else {
                            if(votes.length==0){
                                Vote.create(req.body).done(function (err, vote) {
                                    if (err) {
                                        sails.log.error("Cannot create vote: ", err);
                                        res.send(err, 500);
                                    } else {
                                        sails.log.info("Vote created");
                                        var query = "SELECT category_id, competitor_id, COUNT(*) votes FROM Vote" +
                                            " where Vote.category_id = "+req.body.category_id+ "AND Vote.competitor_id= "+req.body.competitor_id + "group by category_id, competitor_id";
                                        Vote.query(query, null,
                                            function (err, votes) {
                                                try {
                                                    if (err) {
                                                        console.log(err.message);
                                                        res.send(err.message, 500);
                                                    } else {
                                                        SumVotes.update({category_id:votes.rows[0].category_id,
                                                            competitor_id:votes.rows[0].competitor_id},
                                                            {votes:votes.rows[0].votes}).done(function(err, vote) {
                                                            try {
                                                                if (err) {
                                                                    return res.send({message : err.message}, 500);
                                                                } else {
                                                                    if(vote.length!=1) {
                                                                        SumVotes.create(votes.rows).done(
                                                                            function (err, vote) {
                                                                                try {
                                                                                    if (err) {
                                                                                        return res.send(err.detail, 500);
                                                                                    } else {
                                                                                        res.send(vote, 200);
                                                                                    }
                                                                                } catch (err) {
                                                                                    return res.send(err.message, 500);
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                    else
                                                                    {
                                                                        res.send(vote, 200);
                                                                    }
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
                                });
                            }
                            else {
                                return res.send({}, 200);
                            }
                        }
                    } catch (err) {
                        return res.send(err.message, 500);
                    }
                }
            );

        } catch (err) {
            return res.send({message:err}, 500);
        }
    }

};
