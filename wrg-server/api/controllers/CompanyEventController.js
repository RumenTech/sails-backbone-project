/**
 * Created by Mistral on 12/30/13.
 */
"use strict";

module.exports = {
    create: function(req, res) {
        try {
            Company.findMe(req.session.user.id, function(err, company) {
                if (err) {
                    res.send({message : err.message})
                } else {
                    req.body.company_id = company.id;
                    CompanyEvent.new_update(req.body, function(err, event) {
                        try {
                            if (err) {
                                return res.send(err, 500);
                            } else {
                                event.date = CompanyEvent.getDateFormat(event.date);
                                return res.send(event, 200);
                            }
                        } catch (err) {
                            return res.send({message : err.message}, 500);
                        }
                    });
                }
            });
        } catch(err) {
            return res.send({message : err.message}, 500);
        }
    },

    update: function(req, res) {
        try {
            Company.findMe(req.session.user.id, function(err, company) {
                if (err) {
                    res.send({message : err.message})
                } else {
                    req.body.company_id = company.id;
                    CompanyEvent.new_update(req.body, function(err, event){
                        try{
                            if (err) {
                                return res.send(err, 500);
                            } else {
                                event.date = CompanyEvent.getDateFormat(event.date);
                                return res.send(event, 200);
                            }
                        } catch (err) {
                            return res.send({message : err.message}, 500);
                        }
                    });
                }
            });
        } catch(err) {
            return res.send({message : err.message}, 500);
        }
    },

    destroy: function(req, res) {
        try {
            CompanyEvent.new_update(req.session.req.body, function(err, events) {
                try {
                    if (err) {
                        return res.send(err, 500);
                    } else {
                        console.log('Event deleted');
                        return res.send(events, 200);
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

