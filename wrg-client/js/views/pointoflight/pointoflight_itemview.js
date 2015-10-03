/**
 * Created by semir.sabic on 2.6.2014.
 */
define([
    'marionette',
    'text!templates/pointoflight/pol.html'
], function(Marionette, Template) {

    var MoocItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',
        initialize: function(params){


            this.config = params.model.reqres.request('config');

            this.model.set('type', 6);
            if(this.model.get('pagemap').cse_image){
                this.model.set('image', this.model.get('pagemap').cse_image[0].src);
            }
        }
    });

    return MoocItemView;
});