define(['backbone'], function (Backbone) {

    var BasicInformationGroup = Backbone.Model.extend({
        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.fetch(
                { data: $.param({
                id: attributes
                }),
                success: _.bind(function(data) {
                    this.trigger('loaded');
                }, this)
            });
        },

        parse:function (response) {
            return response[0];
        },

        url:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/group/getmygroup';
        },

        validate:function (attrs, options) {

        }
    });

    return BasicInformationGroup;
});


