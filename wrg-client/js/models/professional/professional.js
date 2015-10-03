define(['backbone'], function(Backbone) {

    var ProfessionalModel = Backbone.Model.extend({

        initialize: function(attributes, params) {

            this.reqres = params.reqres;
            this.config= this.reqres.request('config');
            //this.session = this.reqres.request('session');
            this.fetch({
                success: _.bind(function() {
                    this.trigger('loaded');
                }, this)
            });

        },

        parse: function(response) {
            return response;
        },
        url:function(){
            return  this.config.restUrl + '/alumnistory/me';
        }

    });
    return ProfessionalModel;
});