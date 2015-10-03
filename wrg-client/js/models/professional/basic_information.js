define(['backbone'], function (Backbone) {

    var BasicInformation = Backbone.Model.extend({

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            this.session = this.reqres.request('session');
            this.attributes = attributes;
            this.id = this.session.id;
        },

        url:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/alumnistory';
        },

        validate:function (attrs, options) {


        }
    });

    return BasicInformation;
});