define([
    'marionette',
    'text!templates/readonly/alumni.html',
    'lib/backbone.modelbinder',
    'models/read_only_alumni',
    'utils/conversionUtils',
    'views/messages/sponsors_view',
    'views/readonly/media_view',
    'regions/modal_region',
    'views/readonly/friend_request_view'
], function (Marionette, Template, ModelBinder, ReadOnlyAlumni, ConversionUtils, SponsorsView, MediaView, ModalRegion, FriendRequestView) {
    'use strict';

    var AlumniView = Marionette.Layout.extend({
        template: Template,

        regions: {
            sponsors: '#sponsors-section',
            modal: ModalRegion
        },

        events: {
            'click .project-view': 'openModal',
            'click .connection': 'viewConnection',
            'click #sendFriendRequest': 'addFriend'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var alumniId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new ReadOnlyAlumni(alumniId, params);

            this.listenTo(this.model, 'loaded', this.onLoaded, this);
        },

        onLoaded: function () {
            if (this.model.get('error') != "Permission denied") {
                var experiences = this.model.get('experiences');
                if (experiences) {
                    var ranking = ConversionUtils.calculatePoints(experiences);
                    for (var i = 0; i < ranking.length; i++) {
                        if (ranking[i] < 8) {
                            this.model.set('percent_' + i, (ranking[i] * 11) + '%');
                            this.model.set('number_' + i, ranking[i]);
                        } else {
                            this.model.set('percent_' + i, '88%');
                            this.model.set('number_' + i, ranking[i] + "+");
                        }
                    }

                    for (var i = 0; i < experiences.length; i++) {
                        var start = ConversionUtils.convertMonth(new Date(experiences[i].start_date).getMonth() + 1) + ', ' + new Date(experiences[i].start_date).getFullYear().toString();
                        var end = ConversionUtils.convertMonth(new Date(experiences[i].end_date).getMonth() + 1) + ', ' + new Date(experiences[i].end_date).getFullYear().toString();
                        experiences[i].start = start;
                        experiences[i].end = end;
                        if (experiences[i].media) {
                            if (experiences[i].media.length) {
                                for (var j = 0; j < experiences[i].media.length; j++) {
                                    experiences[i].media[j].showIndex = i;
                                    if (experiences[i].media[j].type === 'Video') {
                                        var shortUrl = experiences[i].media[j].data.split("watch?v=");
                                        experiences[i].media[j].id_video = shortUrl[1];
                                        experiences[i].media[j].embedded = shortUrl[0] + 'embed/' + shortUrl[1];
                                        experiences[i].media[j].isVideo = true;
                                    }
                                }
                            }
                        }
                    }

                    this.model.set('experiences', experiences);
                }

                var connections = this.model.get('connections');
                var emptyInformation, reducedInformation;
                if (connections) {
                    for (var i = 0; i < connections.length; i++) {
                        if (connections[i].alumni_id === null) {
                            connections[i].role = 'student';
                        }
                        else {
                            connections[i].role = 'alumni';
                        }

                        if (connections[0].information !== undefined && connections[0].information !== null) {
                            emptyInformation = connections[0].information.split(" ");
                            if (emptyInformation[0] === '' && emptyInformation[1] === 'at') {
                                reducedInformation = '';
                            } else if (connections[0].information.length > 35) {
                                reducedInformation = connections[0].information.slice(0, 35) + '...';
                            } else {
                                reducedInformation = connections[0].information;
                            }
                        }
                    }
                }

                var month = ConversionUtils.convertMonth(this.model.get('graduation_month'));
                this.model.set('graduation_month', month);
            }
            this.render();
        },

        onRender: function () {
            if (this.model.get('error') === "Permission denied") {
                $('#errorDiv').show();
                $('#profileDiv').hide();
            }

            if (this.model.get('awards') === undefined) {
                $("#awardsDiv").hide();
            }

            if (this.model.get('experiences') === undefined) {
                $("#experienceDiv").hide();
            }
            if (this.model.get('skills') === undefined) {
                $("#skillsDiv").hide();
            }

            if (this.model.get('high_school') === undefined && this.model.get('company') === undefined && this.model.get('job_title') === undefined) {
                $("#portfolioInfoDiv").hide();
            }
            $("#pageloader").fadeIn(100).delay(200).fadeOut(100);
            $('body').css('visibility', 'visible');
            this.sponsors.show(new SponsorsView());
        },

        openModal: function (e) {
            var index = $(e.currentTarget).attr('index');
            var exp = this.model.get('experiences')[index];
            this.showModal(MediaView, exp);
        },

        showModal: function (formClass, model) {
            var options = {
                model: model,
                reqres: this.reqres
            };
            options = _.extend(options, this.options);
            this.modal.show(new formClass({model: model, reqres: this.reqres}, options));
        },

        viewConnection: function (e) {
            var connectionId = $(e.currentTarget).attr('userId');
            var connectionRole = $(e.currentTarget).attr('userRole');

            if (connectionId == this.session.id) {
                if (this.session.role === 'student') {
                    window.location = '#portfolio';
                }
                else {
                    window.location = '#alumni_portfolio';
                }
            }
            else if (connectionRole === 'student') {
                window.location = '#student/' + connectionId;
            }
            else {
                window.location = '#alumni_user/' + connectionId;
            }
        },

        addFriend: function () {
            this.showModal(FriendRequestView, this.model);
        }
    });
    return AlumniView;
});
