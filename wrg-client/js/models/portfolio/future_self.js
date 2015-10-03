define(['backbone'], function (Backbone) {

    var FutureSelf = Backbone.Model.extend({

        initialize: function(attributes,options) {
            if(options.readonly === true) {
                this.reqres = options.reqres;
            } else {
                this.reqres = options.collection.reqres;
            }
            this.session = this.reqres.request('session');

        },

        urlRoot: function() {
            var config = this.reqres.request('config');
            return config.restUrl  + '/futureself';
        },

        validate: function(attrs, options){
            if (!attrs.note){
                $('.save-button').removeAttr("disabled");
                return 'Title is a required field.';
            }

            if (!attrs.category_id || attrs.category_id < 1 || attrs.category_id > 8) {
                $('.save-button').removeAttr("disabled");
                return 'Please select a correct category.';
            }
        }
    });

    return FutureSelf;
});



