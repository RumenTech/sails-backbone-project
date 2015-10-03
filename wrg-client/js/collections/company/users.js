define([
    'backbone',
    'models/company/user'
], function(Backbone, User) {

    var CandidatesCollection = Backbone.Collection.extend({
        model:User,

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            //this.on('add', _.bind(this.onAdd, this));
            // // TODO: remove stub data
            // this.add([new Experience(), new Experience, new Experience]);
        },
        onAdd: function(model) {
            //model.set('company_id', this.session.id);
        },
        url:function(){
            var config = this.reqres.request('config');
            return  config.restUrl+'/companyuser'
        }
    });

    return CandidatesCollection;
});
