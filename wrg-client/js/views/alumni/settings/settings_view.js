define([
    'marionette',
    'text!templates/alumni/settings/settings.html',
    'regions/modal_region',
    'models/professional/professional',
    'models/user',
    'collections/portfolio/privacy_settings',
    'utils/notifier',
    'views/portfolio/settings/change_form_view'
], function (Marionette, Template, ModalRegion, Alumnus, User, Privacy, Notificator, FormView) {
    //"use strict"; // Not strict since we have global variable on line 99

    var SettingsIndexView = Marionette.Layout.extend({
        template: Template,

        regions: {
            modal: ModalRegion,
            groups: '#group-section',
            message: '.validation-messages'
        },

        events: {
            'click #editalumni-first-name': function () {
                this.edit('alumni-first-name');
            },
            'click #editalumni-last-name': function () {
                this.edit('alumni-last-name');
            },
            'click #savealumni-first-name': function () {
                this.save('alumni-first-name');
            },
            'click #savealumni-last-name': function () {
                this.save('alumni-last-name');
            },
            'click .save-button': 'savePrivacy',
            'click .change-password-button': 'changePassword'
        },

        initialize: function (options) {
            this.vent = options.vent;
            this.reqres = options.reqres;
            this.config = this.reqres.request('config');
            this.model = new Alumnus(null, options);
            this.params = {};
            this.params.reqres = this.reqres;
            this.user = new User(null, this.params);
            this.model.on('loaded', this.render, this);
            $("#pageloader").fadeIn(100).delay(300).fadeOut(100);
            this.model.set('privacy', 'off');
            this.setPrivacy();
        },

        loadPrivacy: function () {
            var privacyObject = {};
            privacyObject.friend = {};
            privacyObject.employer = {};
            privacyObject.general = {};
            this.privacyCollection.forEach(function (privacy, index) {
                if (privacy.get('role') === 'friend') {
                    privacyObject.friend.wrg_points = privacy.get('wrg_points');
                    privacyObject.friend.skills = privacy.get('skills');
                    privacyObject.friend.awards = privacy.get('awards');
                    privacyObject.friend.connections = privacy.get('connections');
                }
                else if (privacy.get('role') === 'company') {
                    privacyObject.employer.wrg_points = privacy.get('wrg_points');
                    privacyObject.employer.skills = privacy.get('skills');
                    privacyObject.employer.awards = privacy.get('awards');
                    privacyObject.employer.connections = privacy.get('connections');
                }
                else if (privacy.get('role') === 'general') {
                    privacyObject.general.wrg_points = privacy.get('wrg_points');
                    privacyObject.general.skills = privacy.get('skills');
                    privacyObject.general.awards = privacy.get('awards');
                    privacyObject.general.connections = privacy.get('connections');
                }
            });

            this.model.set('privacySettings', privacyObject);
            this.showPrivacy();
        },

        setPrivacy: function () {
            if (this.model.get('privacy') === 'off') {
                this.privacyCollection = new Privacy(null, this.params);
                this.listenTo(this.privacyCollection, 'loaded', this.loadPrivacy, this);
            } else {
                $('#privacy-settings').css('display', 'none');
                this.model.set('privacy', 'off');
            }
        },

        showPrivacy: function () {
            $('#privacy-settings').css('display', 'block');
            this.model.set('privacy', 'on');
            var privacy = this.model.get('privacySettings'),
                employerPrivacy = privacy.employer,
                friendPrivacy = privacy.friend;
            generalPrivacy = privacy.general; // Is this global on purpose?

            $('#s2').attr('checked', friendPrivacy.wrg_points);
            $('#s4').attr('checked', friendPrivacy.skills);
            $('#s5').attr('checked', friendPrivacy.awards);
            $('#s7').attr('checked', friendPrivacy.connections);

            $('#e2').prop('checked', employerPrivacy.wrg_points);
            $('#e4').prop('checked', employerPrivacy.skills);
            $('#e5').prop('checked', employerPrivacy.awards);
            $('#e7').prop('checked', employerPrivacy.connections);

            $('#p2').prop('checked', generalPrivacy.wrg_points);
            $('#p4').prop('checked', generalPrivacy.skills);
            $('#p5').prop('checked', generalPrivacy.awards);
            $('#p7').prop('checked', generalPrivacy.connections);
        },

        savePrivacy: function () {
            var that = this;
            if (this.privacyCollection) {
                this.privacyCollection.forEach(function (privacy, err) {
                    if (privacy.get('role') === 'friend') {
                        privacy.set('wrg_points', $('#s2').prop('checked'));
                        privacy.set('skills', $('#s4').prop('checked'));
                        privacy.set('awards', $('#s5').prop('checked'));
                        privacy.set('connections', $('#s7').prop('checked'));
                    }
                    else if (privacy.get('role') === 'company') {
                        privacy.set('wrg_points', $('#e2').prop('checked'));
                        privacy.set('skills', $('#e4').prop('checked'));
                        privacy.set('awards', $('#e5').prop('checked'));
                        privacy.set('connections', $('#e7').prop('checked'));
                    }
                    else if (privacy.get('role') === 'general') {
                        privacy.set('wrg_points', $('#p2').prop('checked'));
                        privacy.set('skills', $('#p4').prop('checked'));
                        privacy.set('awards', $('#p5').prop('checked'));
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
            var privacyFriendModel = new Backbone.Model();
            privacyFriendModel.set('role', 'friend');
            var privacyEmployerModel = new Backbone.Model();
            privacyEmployerModel.set('role', 'employer');
            this.privacyCollection.add(privacyFriendModel);
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
                first_name: $('#inputalumni-first-name').val(),
                last_name: $('#inputalumni-last-name').val()
            });
            this.user.save(null, {
                type: 'PUT',
                success: _.bind(function () {
                    this.model.trigger('saved');

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