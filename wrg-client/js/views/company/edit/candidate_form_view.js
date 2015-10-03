define([
    'marionette',
    'text!templates/company/edit/candidate_form.html',
    'lib/backbone.modelbinder',
    'models/company/candidate',
    'views/error_message_view',
    'tagsinput',
    'wysiwyg'

], function (Marionette, Template, ModelBinder, Candidate, ErrorMessageView) {
    "use strict";

    var CandidateFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'click .save-button': 'save',
            'click .delete-button': 'removeCandidate'
        },

        regions: {
            message: '.validation-messages'
        },

        triggers: {
            'click .close-reveal-modal': 'closeModal'
        },

        bindings: {
            'position': '#position',
            'description': '#requireddescription',
            'preffereddescription': '#preffereddescription',
            'skill_keywords': '#keywords',
            'department': '#department'
        },

        initialize: function (params) {

            this.reqres = params.reqres;
            var config = this.reqres.request('config');

            this.modelBinder = new ModelBinder();
            if (!this.model) {
                this.model = new Candidate(params.data, params);
                this.model.set('company_id', params.company_id);
                this.isNew = true;
            }
            this.listenTo(this.model, 'invalid', this.showMessage, this);

            this.model.sliderOptionsConfig = config;
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
        },

        onShow: function (options) {

            var that = this;

            $('#keywords').tagsInput({
                width: '932px',
                defaultText: 'Add skill',
                minChars: 3,
                interactive: true,
                maxChars: 25,
                'onAddTag': function (addedTag) {

                    var currentDBSkill = that.model.get("skill_keywords");
                    var tempSkillSize,
                        tempSkillVal = "";

                    if (!currentDBSkill) {//First time Skill Added Case
                        that.model.set("skill_keywords", addedTag);
                        return;
                    }

                    tempSkillSize = currentDBSkill.split(",")[1];

                    if (!tempSkillSize) {
                        tempSkillVal = that.model.get("skill_keywords");
                        tempSkillVal += "," + addedTag;
                        that.model.set("skill_keywords", tempSkillVal);

                    } else {
                        tempSkillVal = that.model.get("skill_keywords");
                        tempSkillVal += "," + addedTag;
                        that.model.set("skill_keywords", tempSkillVal);
                    }
                },

                'onRemoveTag': function (removedTag) {
                    var tempSkillSize = that.model.get("skill_keywords").split(",").length;
                    var tempVal = that.model.get("skill_keywords");

                    if (tempSkillSize === 1) {  //Remove not needed commas, and last skill scenario
                        var result = tempVal.replace(removedTag, "");
                        that.model.set("skill_keywords", null);
                    } else {
                        var result = tempVal.replace("," + removedTag, "");
                        that.model.set("skill_keywords", result);
                    }
                }
            });

            setTimeout(function () {
                $('#requireddescription').wysiwyg({
                    autoGrow: true,
                    initialContent: "Required Qualifications",
                    maxlength: 500,
                    controls: {
                        strikeThrough: { visible: true },
                        underline: { visible: true },
                        subscript: { visible: true },
                        superscript: { visible: true }
                    }
                });
            }, 200)

            setTimeout(function () {
                $('#preffereddescription').wysiwyg({
                    autoGrow: true,
                    initialContent: "Preferred Qualifications",
                    maxlength: 500,
                    controls: {
                        strikeThrough: { visible: true },
                        underline: { visible: true },
                        subscript: { visible: true },
                        superscript: { visible: true }
                    }
                });
            }, 200)

            //Internship
            $("#intern-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("internship"),
                create: function (event, ui) {
                    if ((typeof that.model.get("internship") !== "undefined") && (that.model.get("internship") !== null)) {
                        $("#intern-slider-range-min").find(".ui-slider-handle").text(that.model.get("internship"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("internship", ui.value)
                    $("#intern-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Community Service
            $("#community-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("communityservice"),
                create: function (event, ui) {
                    if ((typeof that.model.get("communityservice") !== "undefined") && (that.model.get("communityservice") !== null)) {
                        $("#community-slider-range-min").find(".ui-slider-handle").text(that.model.get("communityservice"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("communityservice", ui.value)
                    $("#community-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Public speaking
            $("#public-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("publicspeaking"),
                create: function (event, ui) {
                    if ((typeof that.model.get("publicspeaking") !== "undefined") && (that.model.get("publicspeaking") !== null)) {
                        $("#public-slider-range-min").find(".ui-slider-handle").text(that.model.get("publicspeaking"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("publicspeaking", ui.value)
                    $("#public-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Research
            $("#research-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("research"),
                create: function (event, ui) {
                    if ((typeof that.model.get("research") !== "undefined") && (that.model.get("research") !== null)) {
                        $("#research-slider-range-min").find(".ui-slider-handle").text(that.model.get("research"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("research", ui.value)
                    $("#research-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Leadership
            $("#leadership-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("leadership"),
                create: function (event, ui) {
                    if ((typeof that.model.get("leadership") !== "undefined") && (that.model.get("leadership") !== null)) {
                        $("#leadership-slider-range-min").find(".ui-slider-handle").text(that.model.get("leadership"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("leadership", ui.value)
                    $("#leadership-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Innovation
            $("#innovation-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("innovation"),
                create: function (event, ui) {
                    if ((typeof that.model.get("innovation") !== "undefined") && (that.model.get("innovation") !== null)) {
                        $("#innovation-slider-range-min").find(".ui-slider-handle").text(that.model.get("innovation"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("innovation", ui.value)
                    $("#innovation-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Industry Outreach
            $("#industry-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("industryoutreach"),
                create: function (event, ui) {
                    if ((typeof that.model.get("industryoutreach") !== "undefined") && (that.model.get("industryoutreach") !== null)) {
                        $("#industry-slider-range-min").find(".ui-slider-handle").text(that.model.get("industryoutreach"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("industryoutreach", ui.value)
                    $("#industry-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });

            //Grit
            $("#grit-slider-range-min").slider({
                range: "max",
                min: 0,
                max: this.model.sliderOptionsConfig.media.idealCandidatePointsSlider,
                value: this.model.get("grit"),
                create: function (event, ui) {
                    if ((typeof that.model.get("grit") !== "undefined") && (that.model.get("grit") !== null)) {
                        $("#grit-slider-range-min").find(".ui-slider-handle").text(that.model.get("grit"));
                    }
                },
                slide: function (event, ui) {
                    that.model.set("grit", ui.value)
                    $("#grit-slider-range-min").find(".ui-slider-handle").text(ui.value);
                }
            });
        },

        save: function () {

            this.$('.save-button').attr("disabled", true);
            this.message.close();
            this.model.save(null, {
                success: _.bind(function () {

                    var position = this.model.get('position');

                    if (position !== null && position !== undefined) {
                        var positionStrings = position.split(" "),
                            reducedPosition = '';
                        for (var i = 0; i < positionStrings.length; i++) {
                            if (positionStrings[i].length > 18) {
                                positionStrings[i] = positionStrings[i].slice(0, 15) + '...';
                            }
                            reducedPosition += positionStrings[i] + " ";
                        }
                        this.model.set('reducedPosition', reducedPosition);
                    }

                    if (this.isNew) {
                        this.collection.add(this.model);
                        if (this.collection.models.length > 0) {
                            for (var i = 0; i < this.collection.models.length; i++) {
                                if (this.collection.models[i].attributes.department !== "Sales") {
                                    $("#sales").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Marketing") {
                                    $("#marketing").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Information Technology (IT)") {
                                    $("#informationtech").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Production") {
                                    $("#production").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Finance/Accounting") {
                                    $("#finance").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Customer Service") {
                                    $("#customerservice").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Human Resources") {
                                    $("#humanresources").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Research & Design") {
                                    $("#research").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Operations") {
                                    $("#operations").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                                if (this.collection.models[i].attributes.department !== "Legal") {
                                    $("#legal").find("#li" + this.collection.models[i].attributes.id).remove();
                                }
                            }

                            if (this.model.attributes.department === "Sales") {
                                $("#salesli").show();
                            }
                            if (this.model.attributes.department === "Marketing") {
                                $("#marketingli").show();
                            }
                            if (this.model.attributes.department === "Information Technology (IT)") {
                                $("#informationtechli").show();
                            }
                            if (this.model.attributes.department === "Production") {
                                $("#productionli").show();
                            }
                            if (this.model.attributes.department === "Finance/Accounting") {
                                $("#financeli").show();
                            }
                            if (this.model.attributes.department === "Customer Service") {
                                $("#customerserviceli").show();
                            }
                            if (this.model.attributes.department === "Human Resources") {
                                $("#humanresourcesli").show();
                            }
                            if (this.model.attributes.department === "Research & Design") {
                                $("#researchli").show();
                            }
                            if (this.model.attributes.department === "Operations") {
                                $("#operationsli").show();
                            }
                            if (this.model.attributes.department === "Legal") {
                                $("#legalli").show();
                            }
                        }
                    }

                    this.model.trigger('saved');
                    $('.close-reveal-modal').click();

                }, this),
                error: _.bind(function (model, response) {
                    this.$('.save-button').attr("disabled", false);
                    var message = response.responseJSON.message;
                    this.showMessage(this.model, message)
                }, this)
            });
        },

        removeCandidate: function () {
            var candidate_id = this.model.get("id");
            if (candidate_id) {
                this.model.fetch({ data: $.param({ id: candidate_id }),
                    type: 'delete',
                    success: _.bind(function () {

                        this.model.collection.remove(this.model);
                        if (this.model.attributes.department === "Sales") {
                            $("#sales").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Marketing") {
                            $("#marketing").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Information Technology (IT)") {
                            $("#informationtech").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Production") {
                            $("#production").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Finance/Accounting") {
                            $("#finance").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Customer Service") {
                            $("#customerservice").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Human Resources") {
                            $("#humanresources").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Research & Design") {
                            $("#research").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Operations") {
                            $("#operations").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Legal") {
                            $("#legal").find("#li" + this.model.attributes.id).remove();
                        }
                        if (this.model.attributes.department === "Other") {
                            $("#other").find("#li" + this.model.attributes.id).remove();
                        }

                        //hiding departments if there is no any element in list

                        if ($("#sales").children().length < 1) {
                            $("#salesli").hide();
                        }
                        if ($("#marketing").children().length < 1) {
                            $("#marketingli").hide();
                        }
                        if ($("#informationtech").children().length < 1) {
                            $("#informationtechli").hide();
                        }
                        if ($("#production").children().length < 1) {
                            $("#productionli").hide();
                        }
                        if ($("#finance").children().length < 1) {
                            $("#financeli").hide();
                        }
                        if ($("#customerservice").children().length < 1) {
                            $("#customerserviceli").hide();
                        }
                        if ($("#humanresources").children().length < 1) {
                            $("#humanresourcesli").hide();
                        }
                        if ($("#research").children().length < 1) {
                            $("#researchli").hide();
                        }
                        if ($("#operations").children().length < 1) {
                            $("#operationsli").hide();
                        }
                        if ($("#legal").children().length < 1) {
                            $("#legalli").hide();
                        }
                        if ($("#other").children().length < 1) {
                            $("#otherli").hide();
                        }

                        $('#descriptionDiv').empty();

                        $('.close-reveal-modal').click();
                    }, this),
                    error: _.bind(function (model, response) {
                        var message = response.responseText;
                        this.showMessage(this.model, message);
                    }, this)
                }, null);
            } else {
                this.showMessage(this.model, 'You must insert candidate first');
            }
        },
        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        }
    });
    return CandidateFormView;
});
