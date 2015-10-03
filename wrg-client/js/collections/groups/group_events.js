/**
 * Created by Mistral on 2/19/14.
 */
/**
 * Created by Mistral on 12/30/13.
 */
define([
    'backbone',
    'models/groups/group_event'
], function (Backbone, Event) {

    var GroupEventsCollection = Backbone.Collection.extend({
        model: Event,

        initialize: function (attributes, params) {
            for (var i = 0; i < attributes.length; i++) {
                attributes[i].role = params.role;
            }
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
        },

        url: function () {
            var config = this.reqres.request('config');
            return config.restUrl + '/groupevent';
        }
    });

    return GroupEventsCollection;
});