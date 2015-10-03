define(['backbone'], function(Backbone) {

    var ProfilePicture = Backbone.Model.extend({

        initialize: function(attributes, params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            if (!this.get('profile_image')) {
                this.set('profile_image', '//placehold.it/180x180');
            }else{

                this.set('profile_image', this.get('profile_image'));
            }
        },

        url: function() {
            var config = this.reqres.request('config');
            return config.restUrl + '/alumnistory/' + this.attributes.id;
        }
    });



    return ProfilePicture;
});