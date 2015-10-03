//this model find the session on the server and save it like a attribute in reqres.
define(['backbone'], function(Backbone) {

  var SessionModel = Backbone.Model.extend({
        initialize: function(attrs, options) {
            this.reqres = options.reqres;
        },

        url:function(){
            var config = this.reqres.request('config');
            return config.restUrl + '/user/session';
        }
  });
  return SessionModel;
});