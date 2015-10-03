/**
 * Created by semir.sabic on 16.4.2014.
 */
module.exports = {

    attributes: {
        cp_tab_id:{
            type: 'integer',
            required: true
        },
        name:{
            type: 'string',
            required: true
        },
        description:{
            type: 'string',
            required: false
        }
    },

    getCategoriesByTabId: function(tabId, res){
        CareerPathTabCategory.find({cp_tab_id: tabId}, function(err, cats){
            if(err){
                sails.log.error(err);
                return res.send(err, 500);
            }
            else{
                if(cats){
                    sails.log.info('Categories found for tab with id ' + tabId);
                    return res.send(cats, 200);
                }
                else{
                    sails.log.error('Categories not found for tab with id ' + tabId);
                    return res.send('Not found', 404);
                }
            }
        });
    }

};