define([
    'marionette',
    'text!templates/readonly/student.html',
    'lib/backbone.modelbinder',
    'models/read_only_student',
    'utils/conversionUtils',
    'views/messages/sponsors_view',
    'views/readonly/media_view',
    'regions/modal_region',
    'views/readonly/friend_request_view',
    'text!templates/readonly/employer_view_student.html'//,
    //'jqueryui'
], function (Marionette, Template, ModelBinder, ReadOnlyStudent, ConversionUtils, SponsorsView, MediaView, ModalRegion, FriendRequestView, customTemplate) {
    'use strict';

    var StudentView = Marionette.Layout.extend({
        template: Template,

        regions: {
            sponsors: '#sponsors-section',
            modal: ModalRegion
        },

        events: {
            'click .project-view': 'openModal',
            'click .connection': 'viewConnection',
            'click #showFutureSelf': 'showFutureSelf',
            'click #showXpPoints': 'showXpPoints',
            'click #sendFriendRequest': 'addFriend',
            'click .meter': 'displayExperienceOnHover',
            'click .closeme': function (e) {
                this.hideExperienceOnHover(e.currentTarget.id);
            },
            'click .project-viewtwo': 'zoomedExperienceMediaDisplay'
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.session = this.reqres.request('session');
            this.modelBinder = new ModelBinder();
            var studentId = document.location.href.split('/')[document.location.href.split('/').length - 1];
            this.model = new ReadOnlyStudent(studentId, params);
            this.listenTo(this.model, 'loaded', this.onLoaded, this);
        },

        onLoaded: function () {
            if (this.model.get('future_self') && this.model.get('experiences') && !this.model.get('notExperience')) {
                this.model.set('both', 'show');
            } else if (this.model.get('future_self') && this.model.get('notExperience')) {
                this.model.set('future', 'show');
            }
            if (this.model.get('error') != "Permission denied") {
                if (this.model.get('experiences')) {
                    this.showExperiences();
                }
                var connections = this.model.get('connections');
                if (connections) {
                    this.showConnections(connections);
                }
                if (this.model.get('future_self')) {
                    this.showReadOnlyFutureSelf();
                }

                var personalUrl = this.model.get('video_url');
                if (personalUrl !== "undefined" && personalUrl !== null) {
                    var videoUrl = ConversionUtils.parseVideoUrl(personalUrl);
                    if (videoUrl !== '') {
                        this.model.set('id_video', videoUrl);
                    }
                }

                var month = ConversionUtils.convertMonth(this.model.get('graduation_month'));
                this.model.set('graduation_month', month);
            }
            this.render();
        },

        zoomedExperienceMediaDisplay: function (e) {
            $("#dialog-message").html("");
            var wWidth = 348, hHeight = 430;
            var media = e.target.id.split("-")[0];

            if (media === "video") {
                wWidth = 600;
                hHeight = 720;
            }

            $('#imageHolder').empty();

            $("#dialog-message").dialog({
                dialogClass: 'customDialogue',
                show: {
                    effect: "drop",
                    duration: 300
                },
                hide: {
                    effect: "drop",
                    duration: 300
                },
                width: wWidth,
                height: hHeight,
                resizable: false,
                draggable: false,
                modal: true,
                close: function () {
                    $("#dialog-message").html("");
                },
                buttons: {
                    Close: function () {
                        $(this).dialog("close");
                        $("#dialog-message").html("");
                    }
                },
                open: function () {

                    $('.ui-dialog-buttonset').find('button:first').addClass('customDialogueButton');

                    var mediaCaption = "<div>" + e.target.title + "</div>";

                    if (media === "image") {
                        var myImage = $('<img/>');
                        myImage.attr('width', 300);
                        myImage.attr('height', 300);
                        myImage.attr('class', "groupMediaPhoto");
                        myImage.attr('src', e.target.src);
                        myImage.appendTo($('#dialog-message'));
                        $("#dialog-message").append(mediaCaption);

                    } else {
                        var youTubeUrl = e.target.src.split("/")[4];

                        var myVideo = $('<iframe/>', {
                            width: "550",
                            height: "550",
                            src: "http://www.youtube.com/embed/" + youTubeUrl + "?autoplay=true"
                        });
                        myVideo.appendTo($('#dialog-message'));
                        $("#dialog-message").append(mediaCaption);
                    }
                }
            });
        },

        displayExperienceOnHover: function (e) {
            var hoveredExperienceId = e.currentTarget.id;
            var cHTML = "";
            var employerRenderer = Handlebars.compile(customTemplate);
            //Only one experience is on DOM at any given time
            this.hideExperienceOnHover(this.model.get("currentHoveredExperience"));

            this.model.set("currentHoveredExperience", hoveredExperienceId);

            this.model.attributes.experiences.forEach(function (value, index, complete) {

                value.currentBar = hoveredExperienceId; //Used on Clickme to close the current hovered experience
                var sizeOfTempExperienceId = value.categories.length;

                //Defense against free experience. Experience does not have category assigned to it.
                if (sizeOfTempExperienceId === 0) {
                    return;
                }

                var tempValue = value.categories;
                var tempExperienceId = value.categories[0].category_id;

                if (sizeOfTempExperienceId > 1) {
                    tempValue.forEach(function (tvalue, tindex, tcomplete) {

                        var tempExperienceId = tvalue.category_id;
                        if (hoveredExperienceId === tempExperienceId) {
                            cHTML += employerRenderer(value);
                        }
                    });
                } else {
                    if (hoveredExperienceId === tempExperienceId) {
                        cHTML += employerRenderer(value);
                    }
                }
            });
            var newItem = $(cHTML);

            newItem.hide();
            $("#showDetails-" + hoveredExperienceId).append(newItem);
            newItem.show("normal");

            $(".experience-grid").hide("normal");
            cHTML = "";
        },

        hideExperienceOnHover: function (id) {
            $('#imageHolder').empty();
            $("#showDetails-" + id).empty();
            $(".experience-grid").show("normal");
        },

        showExperiences: function () {
            var calculatedValue,
                inlineStyle;

            var experiences = this.model.get('experiences');
            this.ranking = ConversionUtils.calculatePoints(experiences);
            for (var i = 0; i < this.ranking.length; i++) {
                if (this.ranking[i] < 8) {
                    calculatedValue = this.ranking[i] * 11 + '%'; //Fix for Internet explorer all browsers.
                    //IE cant render "style" HTML attribute properly, therefore it is served as a model property
                    inlineStyle = "style=width:" + calculatedValue + ";";

                    this.model.set('percent_' + i, inlineStyle);
                    this.model.set('number_' + i, this.ranking[i]);

                } else {
                    inlineStyle = "style=width:" + "88%;";
                    this.model.set('percent_' + i, inlineStyle);
                    this.model.set('number_' + i, this.ranking[i] + "+");
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
        },

        showConnections: function (connections) {
            var emptyInformation, reducedInformation;
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
        },

        showReadOnlyFutureSelf: function () {
            var futureArray = [], createdDate = [], futureNotes = [];
            this.model.attributes.future_self.forEach(function (future) {
                futureArray[future.category_id - 1] = future.points;
                createdDate[future.category_id - 1] = future.createdAt;
                futureNotes[future.category_id - 1] = future.note;
            });
            for (var i = 0; i < 8; i++) {
                if (futureArray[i]) {
                    if (this.ranking[i] <= futureArray[i]) {
                        this.model.set('future_note_' + i, futureNotes[i]);
                        this.model.set('future_percent_' + i, (futureArray[i] * 11) + '%');
                        this.model.set('future_number_' + i, futureArray[i]);
                    }
                } else {
                    this.model.set('future_percent_' + i, (this.ranking[i] * 11) + '%');
                    this.model.set('future_number_' + i, this.ranking[i]);
                }
            }
        },

        showFutureSelf: function () {
            $('#futureSelf').css('display', 'block');
            $('#experiencePoints').css('display', 'none');
        },

        showXpPoints: function () {
            $('#futureSelf').css('display', 'none');
            $('#experiencePoints').css('display', 'block');
        },

        onRender: function () {
            if (this.model.get('future_self') && this.model.get('notExperience')) {
                this.showFutureSelf();
            }

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

            if (this.model.get('personal_statement') === null && this.model.get('video_url') === null) {
                $("#personalStatementDiv").hide();
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
    return StudentView;
});
