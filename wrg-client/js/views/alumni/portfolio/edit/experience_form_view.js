define([
    'marionette',
    'text!templates/alumni/portfolio/edit/experience_form.html',
    'lib/backbone.modelbinder',
    'models/professional/experience',
    'views/error_message_view',
    'views/alumni/portfolio/edit/experience_media',
    'models/professional/experience_media',
    'utils/imageUploader',
    'utils/notifier',
    'utils/imageValidator',
    'utils/conversionUtils',
    'utils/eventValidation',
    'jqueryform'
], function (Marionette, Template, ModelBinder, Experience, ErrorMessageView, MediaView, ExperienceMediaModel, imageControl, Notificator, imageValidator, ConversionUtils, validationRules) {
    //"use strict"; Cant use strict due to global variables declaration on liens 144, 470, 471

    var ExperienceFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click .icon-plus': 'addNewMediaEntry',
            'click #add-media-video': 'loadNewVideo',
            'click #present': 'checkPresent',
            'focus #start-year': function () {
                ConversionUtils.insertYearsToNow('start-year', 'Start Year');
            },
            'focus #end-year': function () {
                ConversionUtils.insertYearsToNow('end-year', 'End Year');
            },
            'change .validator': function (e) {
                validationRules.validatorEngine(e);
            }
        },

        regions: {
            message: '.validation-messages',
            media: '#media-wrapper'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            title: '#title',
            organization: '#organization',
            start_month: '#start-month',
            start_year: '#start-year',
            end_month: '#end-month',
            end_year: '#end-year',
            description: '#description',
            reference_name: '#reference-name',
            reference_title: '#reference-title',
            reference_email: '#reference-email',
            present: '#present'
        },

        initialize: function (params) {
            var config, MediaCollection;

            config = params.reqres.request('config');
            this.reqres = params.reqres;

            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Experience(params.data, params);
                this.isNew = true;
            } else {
                this.matchCategories();
            }

            this.listenTo(this.model, 'invalid', this.showMessage, this);

            MediaCollection = Backbone.Collection.extend({
                model: ExperienceMediaModel
            });

            this.model.mediaCollection = new MediaCollection();
            this.model.mediaCollection.add(this.model.get('media'));
            this.setMediaIndexes();
            this.model.set("imageManipulationEndPoint", config.restUrl + "/imgUpload/image");//Handlebar property

        },

        imageUpload: function () {
            imageControl.imageUploader(this, "profile_image", "experience");
        },

        youTubeLinkValidator: function (url, returnType) {  //TODO IMplement the youtubechecker in other places in tghe code
            var link = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

            if (returnType) {
                return (url.match(link)) ? RegExp.$1 : false;  //returns valid youtube code
            } else {
                return (url.match(link)) ? true : false; //returns true
            }
        },

        setMediaIndexes: function () {
            var index = 0;

            if (this.model.mediaCollection.length > 0) {
                this.model.mediaCollection.models.forEach(function (media) {
                    media.set('index', ++index);
                });
            }
        },

        showMediaRegion: function () {
            if (this.media.currentView === undefined) {
                this.media.show(new MediaView({data: this.model.mediaCollection}));
            }
        },

        loadNewVideo: function () {
            var videoUrlValue = $("#videoUrl").val();
            var isVideo = this.youTubeLinkValidator(videoUrlValue, false);

            if (isVideo) {
                this.addNewMediaEntry('Video', "http://www.youtube.com/watch?v=" + videoUrlValue.split("v=")[1]);
                //TODO Use Class versus direct css property injection
                $("#videoUrl").css('background-color', 'green');
                $("#videoUrl").val("");
            } else {
                $("#videoUrl").css('background-color', 'red');
                $("#videoUrl").val("");
            }
        },

        matchCategories: function () {
            var checks = [];
            checks[0] = undefined;
            checks[1] = undefined;
            checks[2] = undefined;
            checks[3] = undefined;
            checks[4] = undefined;
            checks[5] = undefined;
            checks[6] = undefined;
            checks[7] = undefined;
            if (this.model) {
                if (this.model.get('categories')) {
                    categories = this.model.get('categories');
                    this.model.get('categories').forEach(function (category) {
                        switch (category.category_id) {
                            case '1':
                                checks[0] = 1;
                                break;
                            case '2':
                                checks[1] = 1;
                                break;
                            case '3':
                                checks[2] = 1;
                                break;
                            case '4':
                                checks[3] = 1;
                                break;
                            case '5':
                                checks[4] = 1;
                                break;
                            case '6':
                                checks[5] = 1;
                                break;
                            case '7':
                                checks[6] = 1;
                                break;
                            case '8':
                                checks[7] = 1;
                                break;
                            default :
                                break;
                        }
                    });
                }
                this.model.set('checks', checks);
            }
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
            this.showMediaRegion();
        },

        onShow: function () {
            var config = this.model.reqres.request('config');
            var that = this;
            var bar = $('.bar');
            var percent = $('.percent');
            var status = $('#status');

            $('#file-image').on('change', function () {
                $("#uploadFiles").click();
            });

            $('form').ajaxForm({
                beforeSend: function () {

                    $("#loaderIcon").append("<img id='theImg' src='/img/ajax-loader-small.gif'/>");
                    var controlFlow = true;
                    if (!wrgSettings.browserVersion.msie) {
                        //modern browser detected, use client size validation as first defense
                        var validationResult = imageValidator.validate($("#file-image")[0].files, config.imageSize); //var validationResult = imageValidator.validate(this.files);

                        switch (validationResult) {
                            case 'Type':
                                throw new that.userException(config.errorMessages.imageBadType);
                                break;
                            case 'Size':
                                throw new that.userException(config.errorMessages.imageSizeBig);
                                break;
                            default:    //any other error will come from server
                                break;
                        }
                    }

                    if (!controlFlow) {
                        //If the size limit is breached in browsers that support multipart/form then break execution right here!!!
                        return;
                    }

                    status.empty();
                    var percentVal = '0%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },

                uploadProgress: function (event, position, total, percentComplete) {
                    var percentVal = percentComplete + '%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                },

                success: function () {
                    var percentVal = '100%';
                    bar.width(percentVal);
                    percent.html(percentVal);
                    $("#loader").empty();
                },

                complete: function (xhr) {
                    var data = $.parseJSON(xhr.responseText);
                    if (ConversionUtils.isBrowserIeLow()) { //Parse correct S3 image path
                        var tempData = data.url.split("amp;");
                        var endResult = tempData.join("");

                        data.url = endResult;
                    }

                    if (data.hasOwnProperty("errormessage")) {
                        //if flag property exists, server rejectged the upload as it is too big
                        Notificator.validate(data.errormessage, "error");
                        return;
                    }

                    $("#loaderIcon").empty();
                    that.addNewMediaEntry('Image');
                    var img = "";
                    $('.media-image').last().attr('src', img.src = data.url);
                    $('#loaderIcon').empty();
                }
            });
        },

        userException: function (message) {
            $("#loaderIcon").empty();
            Notificator.validate(message, "error");
        },

        save: function () {

            this.$('.save-button').attr("disabled", true);
            var experienceMediaToDelete;
            // Format and set the date attributes. Using 01 as the day since the
            // format requires a day, but we only care about year and month.
            this.message.close();

            this.model.set('start_date',
                    this.model.get('start_year') + '-' + this.model.get('start_month') + '-01'
            );
            this.model.set('end_date',
                    this.model.get('end_year') + '-' + this.model.get('end_month') + '-01'
            );

            // Set the student_id
            this.model.set('student_id', this.student_id);
            // Set the 'projects' attribute if project data has been entered.
            // We set it directly because they are nested attributes (e.g. a
            // plain javascript object under a single Backbone.Model attribute).
            // The Backbone.ModelBinder does not handle nested attribute events.

            var categoriesArray = [];
            var experience_id = this.model.get('id');

            var category;
            if (this.$('#intern-coop').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: $('#intern-coop').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#intern-coop').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            if (this.$('#community-service').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: $('#community-service').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#community-service').val()
                                )
                                {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            if (this.$('#public-speaking').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: $('#public-speaking').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#public-speaking').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            if (this.$('#research').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: $('#research').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#research').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }


            if (this.$('#leadership').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: $('#leadership').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#leadership').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            if (this.$('#innovation').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: $('#innovation').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#innovation').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            if (this.$('#industry-outreach').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: this.$('#industry-outreach').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#industry-outreach').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            if (this.$('#grit').is(':checked')) {
                category = {
                    experience_id: experience_id,
                    category_id: this.$('#grit').val(),
                    id: function () {
                        var cat = this.model.get('categories');
                        if (cat) {
                            cat.forEach(function (element) {
                                if (element.category_id === this.$('#grit').val()) {
                                    return element.id;
                                }
                            });
                        }
                        else {
                            return;
                        }
                    }
                };
                categoriesArray.push(category);
            }

            this.model.set('categories', categoriesArray);

            array_media = [];
            error_media = '';
            if (this.model.mediaCollection) {
                experienceMediaToDelete = this.model.mediaCollection.where({deleted: 'on'});
                this.model.mediaCollection.remove(experienceMediaToDelete);
                this.model.mediaCollection.models.forEach(function (media) {

                    if (media.get('id') === undefined) {

                        media.set('name', this.$('#media-name-' + media.get('index')).val());

                        if (media.get('type') !== 'Video') {
                            media.set('data', this.$('#media-image-blob-' + media.get('index')).attr('src'));
                        } else {
                            media.set('data', this.$('#media-video-url-' + media.get('index')).val());
                        }
                        if (!media.get('data')) {
                            if (media.get('type') === 'Video') {
                                this.$('.save-button').attr("disabled", false);
                                error_media = 'Video URL Media is missing';
                            } else {
                                $("#pageloader").css("display", "none");
                                this.$('.save-button').attr("disabled", false);
                                error_media = 'Image Media is missing';
                            }
                        }

                        array_media.push({name: media.get('name'),
                            type: media.get('type'),
                            data: media.get('data')});
                    } else {
                        array_media.push({
                            name: this.$('#media-name-' + media.get('index')).val(),
                            type: media.get('type'),
                            data: media.get('data')
                        });
                    }
                });

                experienceMediaToDelete.forEach(function (model) {
                    if (model.id > 0) {
                        array_media.push({id: model.get('id'),
                            deleted: "on"
                        });
                    }
                });

                this.model.set('mediaErrors', error_media);
            }

            this.model.set('media', array_media);
            // Save model.
            this.model.save(null, {
                success: _.bind(function () {
                    var id = this.model.id;
                    var reqres = this.reqres;

                    if (this.isNew) {
                        // Add the model to the experiences collection.
                        this.collection.add(this.model);
                    }

                    this.model.trigger('saved');
                    this.model.trigger('update_points');

                    $('.close-reveal-modal').click();
                }, this),
                error: _.bind(function (err) {
                    this.message.show(new ErrorMessageView({message: 'Server Problem. Verify your data. The dates could be wrong.'}));
                    this.$('.save-button').removeAttr("disabled");

                }, this)

            });
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        },

        addNewMediaEntry: function (type, videoUrl) {

            var ExperienceMedia, bindings, index;

            index = this.model.mediaCollection.length + 1;
            ExperienceMedia = new ExperienceMediaModel({ rest: this.reqres });
            ExperienceMedia.set('index', index);
            ExperienceMedia.set('type', type);

            if (type === 'Video') {
                var videoCode = this.youTubeLinkValidator(videoUrl, true);
                var fullYouTubeThumb = '//img.youtube.com/vi/' + videoCode + '/1.jpg';

                ExperienceMedia.set('isVideo', true);
                ExperienceMedia.set('youTubeUrl', videoUrl);
                ExperienceMedia.set('youTubeThumb', fullYouTubeThumb);
            }

            this.model.mediaCollection.add(ExperienceMedia);
        },

        checkPresent: function () {
            if (this.$('#present').is(':checked')) {
                var currentTime = new Date();
                this.model.set('end_year', currentTime.getFullYear());
                this.model.set('end_month', currentTime.getMonth() + 1);
                this.$('#end-year').attr("disabled", true);
                this.$('#end-month').attr("disabled", true);
            }
            else {
                this.$('#end-year').removeAttr("disabled");
                this.$('#end-month').removeAttr("disabled");
            }
        }
    });

    return ExperienceFormView;
});