define([
    'marionette',
    'text!templates/portfolio/settings/settings.html',
    'views/portfolio/settings/settings_groups_compositeview',
    'regions/modal_region',
    'models/portfolio/student',
    'models/user',
    'collections/portfolio/privacy_settings',
    'collections/groups/group_settings',
    'utils/notifier',
    'views/portfolio/settings/change_form_view'
], function (Marionette, Template, GroupsCompositeView, ModalRegion, Student, User, Privacy, GroupsCollection, Notificator, FormView) {
    'use strict';

    var SettingsIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            groups: '#group-section',
            message: '.validation-messages'
        },

        events: {
            'click #editstudent-first-name': function () {
                this.edit('student-first-name');
            },
            'click #editstudent-last-name': function () {
                this.edit('student-last-name');
            },
            'click #savestudent-first-name': function () {
                this.save('student-first-name');
            },
            'click #savestudent-last-name': function () {
                this.save('student-last-name');
            },
            'click .save-button': 'savePrivacy',
            'click .change-password-button': 'changePassword'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.model = new Student(null, options);
            this.params = {};
            this.params.reqres = this.reqres;
            this.user = new User(null, this.params);

            if (wrgSettings.browserVersion.msie) {
                this.model.set('IE8', 'IE8');
            }

            this.model.on('loaded', this.render, this);
            this.listenTo(this.model, 'loaded', this.loadCollection, this);

            $("#pageloader").fadeIn(100).delay(300).fadeOut(100);
            this.model.set('privacy', 'off');
        },

        loadCollection: function () {
            this.collection = new GroupsCollection(null, {vent: this.vent, reqres: this.reqres, id: this.model.get('id')});
            this.collection.fetch({
                url: this.config.restUrl + '/group/getadmingroups',
                success: _.bind(function () {
                    this.onLoaded();
                }, this)
            });

            this.privacyCollection = new Privacy(null, this.params);
            this.listenTo(this.privacyCollection, 'loaded', this.loadPrivacy, this);
        },

        loadPrivacy: function () {
            var privacyObject = {};
            privacyObject.student = {};
            privacyObject.employer = {};
            privacyObject.general = {};
            this.privacyCollection.forEach(function (privacy, index) {
                if (privacy.get('role') === 'friend') {
                    privacyObject.student.gpa = privacy.get('gpa');
                    privacyObject.student.wrg_points = privacy.get('wrg_points');
                    privacyObject.student.future_self = privacy.get('future_self');
                    privacyObject.student.skills = privacy.get('skills');
                    privacyObject.student.awards = privacy.get('awards');
                    privacyObject.student.video = privacy.get('video');
                    privacyObject.student.connections = privacy.get('connections');
                }
                else if (privacy.get('role') === 'company') {
                    privacyObject.employer.gpa = privacy.get('gpa');
                    privacyObject.employer.wrg_points = privacy.get('wrg_points');
                    privacyObject.employer.future_self = privacy.get('future_self');
                    privacyObject.employer.skills = privacy.get('skills');
                    privacyObject.employer.awards = privacy.get('awards');
                    privacyObject.employer.video = privacy.get('video');
                    privacyObject.employer.connections = privacy.get('connections');
                }
                else if (privacy.get('role') === 'general') {
                    privacyObject.general.gpa = privacy.get('gpa');
                    privacyObject.general.wrg_points = privacy.get('wrg_points');
                    privacyObject.general.future_self = privacy.get('future_self');
                    privacyObject.general.skills = privacy.get('skills');
                    privacyObject.general.awards = privacy.get('awards');
                    privacyObject.general.video = privacy.get('video');
                    privacyObject.general.connections = privacy.get('connections');
                }
            });

            this.model.set('privacySettings', privacyObject);
            this.showPrivacy();
        },

        onLoaded: function () {
            this.groups.show(new GroupsCompositeView({
                reqres: this.reqres,
                data: this.collection
            }));
            this.listenTo(this.groups.currentView, 'showModal itemview:showModal', this.showModal, this);
        },

        showPrivacy: function () {
            var privacy = this.model.get('privacySettings'),
                employerPrivacy = privacy.employer,
                studentPrivacy = privacy.student,
                generalPrivacy = privacy.general;

            $('#s1').prop('checked', studentPrivacy.gpa);
            $('#s2').prop('checked', studentPrivacy.wrg_points);
            $('#s3').prop('checked', studentPrivacy.future_self);
            $('#s4').prop('checked', studentPrivacy.skills);
            $('#s5').prop('checked', studentPrivacy.awards);
            $('#s6').prop('checked', studentPrivacy.video);
            $('#s7').prop('checked', studentPrivacy.connections);

            $('#e1').prop('checked', employerPrivacy.gpa);
            $('#e2').prop('checked', employerPrivacy.wrg_points);
            $('#e3').prop('checked', employerPrivacy.future_self);
            $('#e4').prop('checked', employerPrivacy.skills);
            $('#e5').prop('checked', employerPrivacy.awards);
            $('#e6').prop('checked', employerPrivacy.video);
            $('#e7').prop('checked', employerPrivacy.connections);

            $('#p1').prop('checked', generalPrivacy.gpa);
            $('#p2').prop('checked', generalPrivacy.wrg_points);
            $('#p3').prop('checked', generalPrivacy.future_self);
            $('#p4').prop('checked', generalPrivacy.skills);
            $('#p5').prop('checked', generalPrivacy.awards);
            $('#p6').prop('checked', generalPrivacy.video);
            $('#p7').prop('checked', generalPrivacy.connections);
        },

        savePrivacy: function () {
            var that = this;
            if (this.privacyCollection) {
                this.privacyCollection.forEach(function (privacy, err) {
                    if (privacy.get('role') === 'friend') {
                        privacy.set('gpa', $('#s1').prop('checked'));
                        privacy.set('wrg_points', $('#s2').prop('checked'));
                        privacy.set('future_self', $('#s3').prop('checked'));
                        privacy.set('skills', $('#s4').prop('checked'));
                        privacy.set('awards', $('#s5').prop('checked'));
                        privacy.set('video', $('#s6').prop('checked'));
                        privacy.set('connections', $('#s7').prop('checked'));
                    }
                    else if (privacy.get('role') === 'company') {
                        privacy.set('gpa', $('#e1').prop('checked'));
                        privacy.set('wrg_points', $('#e2').prop('checked'));
                        privacy.set('future_self', $('#e3').prop('checked'));
                        privacy.set('skills', $('#e4').prop('checked'));
                        privacy.set('awards', $('#e5').prop('checked'));
                        privacy.set('video', $('#e6').prop('checked'));
                        privacy.set('connections', $('#e7').prop('checked'));
                    }
                    else if (privacy.get('role') === 'general') {
                        privacy.set('gpa', $('#p1').prop('checked'));
                        privacy.set('wrg_points', $('#p2').prop('checked'));
                        privacy.set('future_self', $('#p3').prop('checked'));
                        privacy.set('skills', $('#p4').prop('checked'));
                        privacy.set('awards', $('#p5').prop('checked'));
                        privacy.set('video', $('#p6').prop('checked'));
                        privacy.set('connections', $('#p7').prop('checked'));
                    }
                    privacy.save(null, {
                        url: that.config.restUrl + '/privacy',
                        success: _.bind(function () {
                        }, this),
                        error: _.bind(function (model, response) {
                            var message = response.responseJSON.message;
                            this.showMessage(this.model, message)
                        }, this)
                    });
                });

                Notificator.validate("Changes saved", "success", ".save-message");

                if (this.privacyCollection.length === 0) {
                    this.setPrivacySettings();
                }
            }
        },

        setPrivacySettings: function () {
            var privacyStudentModel = new Backbone.Model();
            privacyStudentModel.set('role', 'student');
            var privacyEmployerModel = new Backbone.Model();
            privacyEmployerModel.set('role', 'employer');
            this.privacyCollection.add(privacyStudentModel);
            this.privacyCollection.add(privacyEmployerModel);

            this.savePrivacy();
        },

        showModal: function (view, formClass, collection) {
            var options = {
                model: view.model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: view.model, collection: this.collection, reqres: this.reqres}, options));
            this.listenTo(this.modal.currentView, 'saved', this.update, this);
        },

        edit: function (idElement) {
            $('#span' + idElement).css("display", "none");
            $('#input' + idElement).css("display", "");
            $('#edit' + idElement).css("display", "none");
            $('#save' + idElement).css("display", "");
        },

        onSave: function (idElement) {
            $('#span' + idElement).css("display", "");
            $('#input' + idElement).css("display", "none");
            $('#edit' + idElement).css("display", "");
            $('#save' + idElement).css("display", "none");
            $('#span' + idElement).html($('#input' + idElement).val());
        },

        save: function (idElement) {
            this.onSave(idElement);
            this.message.close();
            this.user.set({
                id: this.model.get('user_id'),
                first_name: $('#inputstudent-first-name').val(),
                last_name: $('#inputstudent-last-name').val()
            });
            this.user.save(null, {
                type: 'PUT',
                success: _.bind(function () {
                    this.model.trigger('saved');
                    this.trigger('saved', this.model);
                }, this),
                error: _.bind(function (model, response) {
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        },

        changePassword: function () {
            this.modal.show(new FormView({ reqres: this.reqres}));
        }
    });
    return SettingsIndexView;
});