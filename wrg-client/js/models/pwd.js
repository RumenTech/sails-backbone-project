/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 12/3/13
 * Time: 11:18 AM
 * To change this template use File | Settings | File Templates.
 */

//this model only use to sent data to login in login_view.js

define(['backbone'], function(Backbone) {

    var Pwd = Backbone.Model.extend({


        initialize: function(attrs, options) {
            this.reqres = options.reqres;
            var config = this.reqres.request('config');
            this.restUrl = config.restUrl;
        },

        url: function () {
            return this.restUrl + '/PwdReq/requestPassChange';
        }
        ,
        validate: function(attrs, options){
            if(!attrs.username){
                return "Username is a required field";
            }
           if(!attrs.username.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/)) {
                return 'Username is not valid email';
            }
        }

    });

    return Pwd;
});