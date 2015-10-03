define(['backbone'], function(Backbone) {

    var College = Backbone.Model.extend({

        initialize: function(attributes,options) {
            this.reqres = options.reqres;
            this.fetch({
                success: _.bind(function() {
                    if (!this.get('profile_image')) {
                        this.set('profile_image', '//placehold.it/180x180');
                    }
                    this.trigger('loaded');
                }, this)
            });
        },
        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/college/me';
        }
    });

    return College;
});
