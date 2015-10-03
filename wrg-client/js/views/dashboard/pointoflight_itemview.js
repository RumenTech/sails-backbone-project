define([
    'marionette',
    'text!templates/dashboard/pointoflight.html'
], function (Marionette, Template) {
    "use strict";

    var PointOfLightItemView = Marionette.ItemView.extend({
        template: Template,

        tagName: 'li',

        initialize: function (params) {
            alert("POL Item view");

            this.config = params.model.reqres.request('config');

            this.model.set('type', 7);
            if (this.model.get('pagemap').cse_image) {
                this.model.set('image', this.model.get('pagemap').cse_image[0].src);
            }
        }
    });
    return PointOfLightItemView;
});