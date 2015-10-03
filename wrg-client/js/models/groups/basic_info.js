define(['backbone'], function (Backbone) {

    var BasicInformationGroup = Backbone.Model.extend({
        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');

        },

        parse:function (response) {
            return response;
        },

        url:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/group';
        },

        validate:function (attrs, options) {}
    });

    return BasicInformationGroup;
});


