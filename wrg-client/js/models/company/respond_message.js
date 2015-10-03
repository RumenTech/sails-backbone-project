define(['backbone'], function (Backbone) {

    var Message = Backbone.Model.extend({

        initialize:function (attributes, options) {
            this.reqres = options.model.collection.reqres;
            // this.config = this.collcetionreqres.request('config');
            //   this.session = this.reqres.request('session');
        },

        parse:function (response) {
            return response;
        },

        url:function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/jobapplication/respond';
        },

        validate:function (attrs, options) {

            if (!attrs.subject) {
                $('.save-button').attr("disabled", false);
                return 'Subject is a required field.';
            }
            if (!attrs.content) {
                $('.save-button').attr("disabled", false);
                return 'Message content is a required field.';
            }

        }


    });

    return Message;
});



