/**
 * Created by Mistral on 2/13/14.
 */
/**
 * Created by Mistral on 2/4/14.
 */
define(['backbone'], function(Backbone) {

    var Receiver = Backbone.Model.extend({
        initialize: function(attributes,options) {
            this.reqres = options.reqres;
        },
        parse: function(response) {
            return response;
        }
    });

    return Receiver;
});

