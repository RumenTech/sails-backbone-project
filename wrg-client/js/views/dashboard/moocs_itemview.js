/**
 * Created by semir.sabic on 2.6.2014.
 */
define([
    'marionette',
    'text!templates/dashboard/mooc.html'
], function (Marionette, Template) {
    "use strict";

    var MoocItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        initialize: function (params) {
            this.config = params.model.reqres.request('config');
            // MOOCs tab type is 6
            this.model.set('type', 6);
            if (this.model.get('pagemap').cse_image) {
                this.model.set('image', this.model.get('pagemap').cse_image[0].src);
            }
        }
    });
    return MoocItemView;
});