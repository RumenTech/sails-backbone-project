define([
    'marionette',
    'text!templates/reporting/reporting_form.html',
    'models/reporting',
    'views/error_message_view',
    'lib/backbone.modelbinder',
    'utils/conversionUtils'
], function (Marionette, Template, Reporting, ErrorMessageView, ModelBinder, ConversionUtils) {
    'use strict';

    var ReportingFormView = Marionette.Layout.extend({
        template: Template,

        events: {
            'focus #reporting-start': function () {
                ConversionUtils.insertYearsToNow('reporting-start', 'Enter start year here');
            },
            'focus #reporting-end': function () {
                ConversionUtils.insertYearsToNow('reporting-end', 'Enter end year here');
            },
            'click #go': function (e) {
                this.filterReporting(e);
            },
            'click #view-all': function (e) {
                this.viewAllReporting(e);
            },
            'change #arrange-skills': function (e) {
                var selectedval = $("#arrange-skills").val();
                if (selectedval) {
                    this.arrangeSkills(e, selectedval);
                }
            }
        },

        regions: {
            message: '.validation-messages'
        },

        bindings: {
        },

        initialize: function (params) {
            this.reqres = params.reqres;
            this.collection = params.collection;
            this.modelBinder = new ModelBinder();
            this.model = new Reporting(params.data, params);
            this.config = this.model.reqres.request('config');
            this.listenTo(this.model, 'invalid', this.showMessage, this);
        },

        recalculateCharts: function () {
            this.industryChart();
            this.employmentChart();
            this.educationChart();
            this.skillsChart();
        },

        onRender: function () {
            this.modelBinder.bind(this.model, this.el, this.bindings);
            $("#pageloader").fadeOut(200);
            this.recalculateCharts();
        },

        arrangeSkills: function (e, orderType) {
            e.preventDefault();
            this.skillsChart(orderType);
        },

        onShow: function () {
            this.startYear = $('#reporting-start').val();
            this.endYear = $('#reporting-end').val();
        },

        filterReporting: function (e) {
            e.preventDefault();
            $('.load_alumni').css('display', 'block');
            this.startYear = $('#reporting-start').val();
            this.endYear = $('#reporting-end').val();
            this.recalculateCharts();
        },

        viewAllReporting: function (e) {
            e.preventDefault();
            $('.load_alumni').css('display', 'block');
            var date = new Date(),
                year = date.getFullYear();
            this.startYear = 1900;
            this.endYear = year;
            this.recalculateCharts();
        },

        showMessage: function (model, message) {
            this.message.show(new ErrorMessageView({message: message}));
        },

        industryChart: function () {
            $.ajax({
                url: this.config.restUrl + '/reporting/alumniindustries',
                type: 'post',
                data: $.param({
                    startYear: this.startYear,
                    endYear: this.endYear
                }),
                cache: false,
                that: this,
                success: function (reportData) {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Topping');
                    data.addColumn('number', 'Slices');

                    data.addRows(reportData.reporting);
                    var options = {
                        'width': 400,
                        'height': 300
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('chartIndustries'));
                    var that = this.that;

                    function selectHandler(that) {
                        var selectedItem = chart.getSelection()[0];
                        if (selectedItem) {
                            var industry = data.getValue(selectedItem.row, 0);
                            var industriesObj = {};
                            industriesObj.industry = industry;
                            industriesObj.startYear = that.startYear;
                            industriesObj.endYear = that.endYear;
                            that.trigger('filterIndustry', that, industriesObj);
                        }
                    }

                    google.visualization.events.addListener(chart, 'select', function () {
                        selectHandler(that);
                    });
                    chart.draw(data, options);
                }
            });
        },

        employmentChart: function () {
            $.ajax({
                url: this.config.restUrl + '/reporting/alumniemployment',
                type: 'post',
                data: $.param({
                    startYear: this.startYear,
                    endYear: this.endYear
                }),
                cache: false,
                that: this,
                success: function (reportData) {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Topping');
                    data.addColumn('number', 'Slices');

                    data.addRows(reportData.reporting);
                    var options = {
                        'width': 400,
                        'height': 300
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('chartEmployment'));
                    var that = this.that;

                    function selectHandler(that) {
                        var selectedItem = chart.getSelection()[0];
                        if (selectedItem) {
                            var employment = data.getValue(selectedItem.row, 0);
                            var employmentObj = {};
                            employmentObj.employment = employment;
                            employmentObj.startYear = that.startYear;
                            employmentObj.endYear = that.endYear;
                            that.trigger('filterEmployment', that, employmentObj);
                        }
                    }

                    google.visualization.events.addListener(chart, 'select', function () {
                        selectHandler(that);
                    });
                    chart.draw(data, options);
                }
            });
        },

        educationChart: function () {
            $.ajax({
                url: this.config.restUrl + '/reporting/highesteducationlevel',
                type: 'post',
                data: $.param({
                    startYear: this.startYear,
                    endYear: this.endYear
                }),
                cache: false,
                that: this,
                success: function (reportData) {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Topping');
                    data.addColumn('number', 'Alumni');

                    data.addRows(reportData.reporting);

                    var options = {
                        width: 870,
                        height: 300,
                        legend: 'none'
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('chartEducation')),
                        that = this.that;

                    function selectHandler(that) {
                        var selectedItem = chart.getSelection()[0];
                        if (selectedItem) {
                            var education = data.getValue(selectedItem.row, 0);
                            var educationObj = {};
                            educationObj.education = education;
                            educationObj.startYear = that.startYear;
                            educationObj.endYear = that.endYear;
                            that.trigger('filterEducation', that, educationObj);
                        }
                    }

                    google.visualization.events.addListener(chart, 'select', function () {
                        selectHandler(that)
                    });
                    chart.draw(data, options);
                }
            });
        },

        skillsChart: function (arrangementType, offset) {
            arrangementType = arrangementType || 1;

            $.ajax({
                url: this.config.restUrl + '/reporting/alumniskills',
                type: 'post',
                data: $.param({
                    startYear: this.startYear,
                    endYear: this.endYear,
                    order: arrangementType
                }),
                cache: false,
                that: this,
                success: function (reportData) {
                    var data = new google.visualization.DataTable();
                    data.addColumn('string', 'Topping');
                    data.addColumn('number', 'alumni');

                    data.addRows(reportData.reporting);
                    var options = {
                        'width': 870,
                        'height': 600,
                        legend: 'none'
                    };

                    var chart = new google.visualization.BarChart(document.getElementById('chartSkills'));
                    var that = this.that;
                    that.offset = offset;
                    function selectHandler(that) {
                        var selectedItem = chart.getSelection()[0];
                        if (selectedItem) {
                            var skill = data.getValue(selectedItem.row, 0);
                            var skillObj = {};
                            skillObj.skill = skill;
                            skillObj.startYear = that.startYear;
                            skillObj.endYear = that.endYear;
                            that.trigger('filterSkills', that, skillObj);
                        }
                    }

                    google.visualization.events.addListener(chart, 'select', function () {
                        selectHandler(that);
                    });
                    chart.draw(data, options);
                }
            });
        }
    });
    return ReportingFormView;
});