define([
    'marionette',
    'text!templates/header.html',
    'text!templates/header_company.html',
    'text!templates/header_college.html',
    'text!templates/header_alumni.html',
    'text!templates/header_admin.html'
], function (Marionette, Template, TemplateCompany, TemplateCollege, TemplateAlumni, TemplateAdmin) {
    'use strict';

    var HeaderView = Marionette.ItemView.extend({
        template: null,
        initialize: function (params) {
            this.session = params.reqres.request('session');
            switch (this.session.role) {
                case "student":
                    this.template = Template;
                    break;
                case "company":
                    this.template = TemplateCompany;
                    break;
                case "college":
                    this.template = TemplateCollege;
                    break;
                case "admin":
                    this.template = TemplateAdmin;
                    break;
                default :
                    this.template = TemplateAlumni;
                    break;
            }
            this.config = params.reqres.request('config');
            this.model = new Backbone.Model();
            var numberOfUnreadMessages = 0;
            var that = this;
            $.ajax({
                type: 'get',
                url: this.config.restUrl + '/message/getnumberofunreadmessages',
                dataType: 'json',
                success: function (data) {
                    numberOfUnreadMessages = data.length;
                    if (numberOfUnreadMessages > 0) {
                        that.model.set('numberOfMessages', numberOfUnreadMessages);
                        that.render();
                    }
                },
                error: function (err) {
                }
            });
        }
    });
    return HeaderView;
});