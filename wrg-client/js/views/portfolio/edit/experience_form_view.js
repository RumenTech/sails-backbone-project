define([
    'marionette',
    'text!templates/portfolio/edit/experience_form.html',
    'lib/backbone.modelbinder',
    'models/portfolio/experience',
    'models/portfolio/student',
    'views/error_message_view',
    'views/portfolio/edit/experience_media',
    'models/portfolio/experience_media',
    'utils/imageUploader',
    'utils/notifier',
    'utils/imageValidator',
    'utils/conversionUtils',
    'utils/eventValidation',
    'jqueryform'

], function (Marionette, Template, ModelBinder, Experience, Student, ErrorMessageView, MediaView, ExperienceMediaModel, imageControl, Notificator, imageValidator, ConversionUtils, validationRules) {
    // 'use strict'; Can't use strict since Globals are declared on lines 469 and 470.

    var ExperienceFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click .icon-plus': 'addNewMediaEntry',
            'click #add-media-video': 'loadNewVideo',
            'click #present': 'checkPresent',
            'click #interactive-video': 'youTubeVirtual',
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
            var threeSource = "//cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js";

            if (typeof THREE === "undefined") {
                console.log("Grabing the THREE script");
                $.getScript(threeSource)
                    .done(function (script, textStatus) {

                    })
                    .fail(function (jqxhr, settings, exception) {
                        $("div.log").text("Triggered ajaxError handler.");
                    });
            }


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
            this.student_id = params.reqres.request('student_id');

            this.listenTo(this.model, 'invalid', this.showMessage, this);

            MediaCollection = Backbone.Collection.extend({
                model: ExperienceMediaModel
            });

            this.model.mediaCollection = new MediaCollection();
            this.model.mediaCollection.add(this.model.get('media'));
            this.setMediaIndexes();
            this.model.set("imageManipulationEndPoint", config.restUrl + "/imgUpload/image");//Handlebar property
        },

        youTubeVirtual: function () {
            var that = this;

            $("#virtualcontainer").empty();

            $("#virtual-youtube").dialog({
                //dialogClass: 'customDialogue',
                show: {
                    effect: "drop",
                    duration: 300
                },
                hide: {
                    effect: "drop",
                    duration: 300
                },
                width: $(window).width(), // 1.6,// / 2,
                height: $(window).height(),// / 1.6,
                dialogClass: "noTitleStuff",
                resizable: false,
                draggable: false,
                modal: true,
                close: function () {
                    $('.noTitleStuff div.ui-dialog-titlebar').show();
                },
                buttons: {
                    Close: function () {
                        $(this).dialog("close");
                        //$("#virtual-youtube").empty();
                    }
                },

                open: function () {
                    //$('.noTitleStuff div.ui-dialog-titlebar').hide();

                    var css3DRenderer = "js/lib/CSS3DRenderer.js";

                    $.getScript(css3DRenderer)
                        .done(function (script, textStatus) {
                            console.log("CSS3Drenderer loaded.");
                            that.youTubeVirtualizer();
                        })
                        .fail(function (jqxhr, settings, exception) {
                            $("div.log").text("Triggered ajaxError handler.");
                        });
                }
            });
        },

        youTubeVirtualizer: function () {
            var that = this;

            var camera, scene, renderer;
            var player;

            var auto = true;

            var Element = function (entry) {

                var dom = document.createElement('div');
                dom.style.width = '480px';
                dom.style.height = '360px';

                var image = document.createElement('img');
                image.style.position = 'absolute';
                image.style.width = '480px';
                image.style.height = '360px';
                image.src = entry.media$group.media$thumbnail[ 2 ].url;
                image.title = entry.title.$t;
                dom.appendChild(image);

                var button = document.createElement('img');
                button.style.position = 'absolute';
                button.style.left = ( ( 480 - 86 ) / 2 ) + 'px';
                button.style.top = ( ( 360 - 61 ) / 2 ) + 'px';
                button.style.visibility = 'hidden';
                button.style.WebkitFilter = 'grayscale()';
                button.src = 'data:image/png;base64,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';
                dom.appendChild(button);

                var blocker = document.createElement('div');
                blocker.style.position = 'absolute';
                blocker.style.width = '480px';
                blocker.style.height = '360px';
                blocker.style.background = 'rgba(0,0,0,0.5)';
                blocker.style.cursor = 'pointer';
                dom.appendChild(blocker);

                var object = new THREE.CSS3DObject(dom);
                object.position.x = Math.random() * 4000 - 2000;
                // object.position.y = Math.random() * 2000 - 1000;
                object.position.y = 3000;
                object.position.z = Math.random() * -5000;

                image.addEventListener('load', function (event) {

                    button.style.visibility = 'visible';

                    new TWEEN.Tween(object.position)
                        .to({ y: Math.random() * 2000 - 1000 }, 2000)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();

                }, false);

                dom.addEventListener('mouseover', function () {
                    console.log(image.title);
                    $("#videotitle").text(image.title);
                    button.style.WebkitFilter = '';
                    blocker.style.background = 'rgba(0,0,0,0)';

                }, false);

                dom.addEventListener('mouseout', function () {
                    $("#videotitle").empty();
                    button.style.WebkitFilter = 'grayscale()';
                    blocker.style.background = 'rgba(0,0,0,0.75)';

                }, false);

                dom.addEventListener('click', function (event) {

                    event.stopPropagation();

                    auto = false;

                    if (player !== undefined) {

                        player.parentNode.removeChild(player);
                        player = undefined;
                    }

                    player = document.createElement('iframe');
                    player.style.position = 'absolute';
                    player.style.width = '480px';
                    player.style.height = '360px';
                    player.style.border = '0px';
                    player.src = 'https://www.youtube.com/embed/' + entry.id.$t.split(':').pop() + '?rel=0&autoplay=1&controls=1&showinfo=0';
                    this.appendChild(player);

                    var youTubeUrl = "https://www.youtube.com/watch?v=" + entry.id.$t.split(':')[3];
                    that.loadNewVideo(youTubeUrl, entry.title.$t);

                    var prev = object.position.z + 400;

                    new TWEEN.Tween(camera.position)
                        .to({ x: object.position.x, y: object.position.y - 25 }, 1500)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();

                    new TWEEN.Tween({ value: prev })
                        .to({ value: 0  }, 2000)
                        .onUpdate(function () {

                            move(this.value - prev);
                            prev = this.value;

                        })
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();

                }, false);

                return object;
            };
            init();
            animate();

            function init() {

                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
                camera.position.y = -25;

                scene = new THREE.Scene();

                renderer = new THREE.CSS3DRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = 0;
                document.getElementById('virtualcontainer').appendChild(renderer.domElement);

                var query = document.getElementById('query');
                query.addEventListener('keyup', function (event) {

                    if (event.keyCode === 13) {
                        search(query.value);
                    }

                }, false);

                var button = document.getElementById('button');
                button.addEventListener('click', function (event) {

                    search(query.value);

                }, false);

                if (window.location.hash.length > 0) {
                    query.value = window.location.hash.substr(1);
                }

                search(query.value);

                document.body.addEventListener('mousewheel', onMouseWheel, false);

                document.body.addEventListener('click', function (event) {
                    auto = true;

                    if (player !== undefined) {

                        player.parentNode.removeChild(player);
                        player = undefined;
                    }

                    new TWEEN.Tween(camera.position)
                        .to({ x: 0, y: -25 }, 1500)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start();
                }, false);

                window.addEventListener('resize', onWindowResize, false);
            }

            function search(query) {

                for (var i = 0, l = scene.children.length; i < l; i++) {

                    (function () {

                        var object = scene.children[ i ];
                        var delay = i * 15;

                        new TWEEN.Tween(object.position)
                            .to({ y: -2000 }, 1000)
                            .delay(delay)
                            .easing(TWEEN.Easing.Exponential.In)
                            .onComplete(function () {
                                scene.remove(object);
                            })
                            .start();
                    })();
                }

                var request = new XMLHttpRequest();
                request.addEventListener('load', onData, false);
                request.open('GET', 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&max-results=50&q=' + query, true);
                request.send(null);
            }

            function onData(event) {

                var data = JSON.parse(event.target.responseText);
                var entries = data.feed.entry;

                for (var i = 0; i < entries.length; i++) {

                    (function (data, time) {
                        setTimeout(function () {
                            scene.add(new Element(data));
                        }, time);
                    })(entries[ i ], i * 15);
                }
            }

            function move(delta) {

                for (var i = 0; i < scene.children.length; i++) {

                    var object = scene.children[ i ];

                    object.position.z += delta;

                    if (object.position.z > 0) {
                        object.position.z -= 5000;

                    } else if (object.position.z < -5000) {
                        object.position.z += 5000;
                    }
                }
            }

            function onMouseWheel(event) {
                move(event.wheelDelta);
            }

            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            function animate() {

                requestAnimationFrame(animate);

                TWEEN.update();

                if (auto === true) {
                    move(1);
                }
                renderer.render(scene, camera);
            }
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
                    media.set('index', index++);
                });
            }
        },

        showMediaRegion: function () {
            if (this.media.currentView === undefined) {
                this.media.show(new MediaView({data: this.model.mediaCollection}));
            }
        },

        loadNewVideo: function (videoUrl, name) {

            var videoUrlValue = $("#videoUrl").val() || videoUrl;

            var isVideo = this.youTubeLinkValidator(videoUrlValue, false);
            if (isVideo) {
                //Always same same video format to DB
                this.addNewMediaEntry('Video', "https://www.youtube.com/watch?v=" + videoUrlValue.split("v=")[1]);
                //TODO Use Class versus direct css property injection
                $("#videoUrl").css('background-color', 'green');
                $("#videoUrl").val("");
            } else {
                $("#videoUrl").css('background-color', 'red');
                $("#videoUrl").val("");
            }
        },

        matchCategories: function () {
            var checks = new Array();
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

                    if (data.hasOwnProperty("errormessage")) {
                        $("#loaderIcon").empty();
                        //if flag property exists, server rejectged the upload as it is too big
                        Notificator.validate(data.errormessage, "error");
                    } else {
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
                                if (element.category_id == this.$('#intern-coop').val()) {
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
                                if (element.category_id == this.$('#community-service').val()) {
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
                                if (element.category_id == this.$('#public-speaking').val()) {
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
                                if (element.category_id == this.$('#research').val()) {
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
                                if (element.category_id == this.$('#leadership').val()) {
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
                                if (element.category_id == this.$('#innovation').val()) {
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
                                if (element.category_id == this.$('#industry-outreach').val()) {
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
                                if (element.category_id == this.$('#grit').val()) {
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

            array_media = new Array();
            error_media = '';

            if (this.model.mediaCollection) {
                experienceMediaToDelete = this.model.mediaCollection.where({deleted: 'on'});
                this.model.mediaCollection.remove(experienceMediaToDelete);
                this.model.mediaCollection.models.forEach(function (media) {

                    if (media.get('id') == undefined) {

                        media.set('name', this.$('#media-name-' + media.get('index')).val());

                        if (media.get('type') != 'Video') {
                            media.set('data', this.$('#media-image-blob-' + media.get('index')).attr('src'));
                        } else {
                            media.set('data', this.$('#media-video-url-' + media.get('index')).val());
                        }
                        if (!media.get('data')) {
                            if (media.get('type') == 'Video') {
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