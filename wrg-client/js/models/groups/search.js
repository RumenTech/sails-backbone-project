/**
 * Created by Mistral on 2/17/14.
 */

define(['backbone'], function(Backbone) {

    var Search = Backbone.Model.extend({

        initialize:function (attributes, options) {
            this.reqres = options.reqres;
            // this.config = this.collcetionreqres.request('config');
            //   this.session = this.reqres.request('session');
        }

    });

    return Search;
});
