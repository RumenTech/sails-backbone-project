/**
 * Created by semir.sabic on 16.4.2014.
 */
"use strict";

module.exports = {
    getTabData: function(req, res){
        try{
            if (!req.isAuthenticated()) {
                sails.log.error("Not authenticated");
                return  res.view('404');
            }
            else{
                var schoolType = 'college';
                CareerPathTab.getBySchoolType(schoolType, res);
            }
        }
        catch (e){
            sails.log.error(e);
            return res.send(e, 500);
        }
    },

    tab: function(req, res){
        try{
            if (!req.isAuthenticated()) {
                sails.log.error("Not authenticated");
                return  res.view('404');
            }
            else{
                var tabId = req.param('tabId');
                CareerPathTab.find({id:id}, function(err, tab){
                    if(err){
                        sails.log.error(err);
                        return res.send(err, 500);
                    }
                    else{
                        return res.send(tab.rows[0], 200);
                    }
                });
            }
        }
        catch (e){
            sails.log.error(e);
            return res.send(e, 500);
        }
    },

    getFullTabs: function(req, res){
        try{
            if (!req.isAuthenticated()) {
                sails.log.error("Not authenticated");
                return  res.view('404');
            }
            else{
                if(req.session.user.role === 'company'){
                    sails.log.error('Career path is not available for employer');
                    return res.send({error: 'Career path is not available for employer'}, 500);
                }
                else{
                    CareerPathTab.getUserInfo(req, function(data){
                        if(!data.error){
                            CareerPathTab.find({school_type: data.school_type}, function(err, tabs){
                                if(err){
                                    sails.log.error(err.message);
                                    return res.send(err.message, 500);
                                }
                                else{
                                    sails.log.info('Career path tabs found.');
                                    res.send(tabs, 200);
                                }
                            });
                        }
                        else{
                            res.send({message: data.error}, 200);
                        }
                    });
                }
            }
        }
        catch (e){
            sails.log.error(e.message);
            return res.send(e.message, 500);
        }
    }
};