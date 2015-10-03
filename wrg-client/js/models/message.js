/**
 * Created by Mistral on 2/13/14.
 */


define(['backbone'], function (Backbone) {

    var Message = Backbone.Model.extend({

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            // this.config = this.collcetionreqres.request('config');
            //   this.session = this.reqres.request('session');
        },

        parse:function (response) {
            return response;
        },

        url:function () {
            var config = '';
            if (this.reqres) {
                config = this.reqres.request('config');
            } else {
                config = this.collection.reqres.request('config');
            }

            return config.restUrl + '/message';
        },

        validate:function (attrs, options) {
            if (!attrs.receiver_id) {
                $('.save-button').attr("disabled", false);
                return 'To is a required field or there is no receiver with that name.';
            }
            if (!attrs.content) {
                $('.save-button').attr("disabled", false);
                return 'Message content is a required field.';
            }

        }


    });

    return Message;
});


