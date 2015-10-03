/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {

    getCategories: function(req, res){
        try{
            if (!req.isAuthenticated()) {
                sails.log.error("Not authenticated entry from Groups Delete Controller");
                return  res.view('404');
            }
            else{
                var tabId = req.param('tabId');
                CareerPathTabCategory.getCategoriesByTabId(tabId, res);
            }
        }
        catch(e){
            sails.log.error(e);
            return res.send(e, 500);
        }
    }
};