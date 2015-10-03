define(['backbone'], function(Backbone) {

    var Skill = Backbone.Model.extend({

        initialize: function(attributes,params) {
            this.reqres = params.collection.reqres;

            this.session = this.reqres.request('session');

        },

        parse: function(response) {
            return response;
        },
        urlRoot:function()
        {
            var config = this.reqres.request('config');
            return config.restUrl+'/professionalskill'
        }


    });

    return Skill;
});