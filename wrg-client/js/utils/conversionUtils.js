define([], function () {
    'use strict';
    var conversionUtils = {

        returnInteger: function (value, errormessage) {
            var result = null;
            if ((parseFloat(value) === parseInt(value, 10)) && !isNaN(value)) {
                result = parseInt(value, 10);
            } else {
                if (errormessage) {
                    throw errormessage;

                } else {
                    throw 'Error parsing integer ' + value;
                }
            }
            return result;
        },

        convertTime: function (time) {
            var timeInt = time.split(':'),
                timeInteger;
            if (time.indexOf('AM') !== -1) {
                timeInteger = this.returnInteger(timeInt[0]);
            } else if (time.indexOf('PM') !== -1) {
                timeInteger = this.returnInteger(timeInt[0]) + 12;
            }
            return timeInteger;
        },

        convertMonth: function (number) {
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept',
                'Oct', 'Nov', 'Dec'];
            return monthNames[number - 1];
        },

        convertCategoryId: function (id) {
            var divId = [
                'Internship/Co-op',
                'Community Service',
                'Public Speaking',
                'Research',
                'Leadership',
                'Innovation',
                'Industry Outreach'
            ];
            return divId[id - 1];
        },

        calculatePoints: function (experiences) {
            var experience, ranking, experiencePoints;

            ranking = [];
            for (var i = 0; i < 8; i++) {
                ranking[i] = 0;
            }
            for (var i = 0; i < experiences.length; i++) {

                experience = experiences[i];

                if (experience.categories) {

                    //experiencePoints = this.diffMonths(experience.start_date, experience.end_date);
                    experiencePoints = 1; // Calculate experience points based on event not on time
                    for (var j = 0; j < experience.categories.length; j++) {
                        var category = experience.categories[j];
                        switch (category.category_id) {
                            case '1':
                            case '3':
                            case '4':
                            case '5':
                            case '6':
                            case '7':
                            case '8':
                                ranking[category.category_id - 1] += experiencePoints;
                                break;
                            default:
                                ranking[category.category_id - 1]++;
                        }
                    }
                }
            }
            return ranking;
        },

        calculateProfessionalPoints: function (experiences) {
            var experience, ranking, experiencePoints;

            ranking = [];
            for (var i = 0; i < 8; i++) {
                ranking[i] = 0;
            }
            for (var i = 0; i < experiences.length; i++) {

                experience = experiences[i];

                if (experience.attributes.categories) {

                    //experiencePoints = this.diffMonths(experience.attributes.start_date, experience.attributes.end_date);
                    experiencePoints = 1; // Calculate experience points based on event not on time
                    for (var j = 0; j < experience.attributes.categories.length; j++) {
                        var category = experience.attributes.categories[j];
                        switch (category.category_id) {
                            case '1':
                            case '3':
                            case '4':
                            case '5':
                            case '6':
                            case '7':
                            case '8':
                                ranking[category.category_id - 1] += experiencePoints;
                                break;
                            default:
                                ranking[category.category_id - 1]++;
                        }
                    }
                }
            }
            return ranking;
        },

        diffMonths: function (start, end) {
            var start_month = parseInt(start.substring(0, 4)) * 12 + parseInt(start.substring(5, 7)) - 1;
            var end_month = parseInt(end.substring(0, 4)) * 12 + parseInt(end.substring(5, 7)) - 1;
            return Math.floor((end_month - start_month + 1) / 3);
        },

        parseVideoUrl: function (videoUrl) {

            if (typeof (videoUrl) !== "undefined") {
                var parsedUrl = videoUrl.split("/"),
                    result = '';

                if (parsedUrl[2] === "youtu.be") {
                    result = parsedUrl[3];
                } else if (parsedUrl[2] === "www.youtube.com") {
                    result = parsedUrl[3].split("v=")[1];
                } else if (parsedUrl[3] === "embed") {
                    result = parsedUrl[4].split(" ")[0].replace('"', '');
                }
                return result;
            }
        },

        insertYearsFromNow: function (elementId, defaultText) {
            var select = document.getElementById(elementId),
                now = new Date(),
                year = now.getFullYear();
            select.length = 0;
            select.options.add(new Option(defaultText, 0));
            for (var i = 0; i < 50; i++) {
                var d = year++;
                select.options.add(new Option(d, d));
            }
        },

        insertYearsToNow: function (elementId, defaultText) {
            var select = document.getElementById(elementId),
                now = new Date(),
                year = now.getFullYear();
            select.length = 0;
            select.options.add(new Option(defaultText, 0));
            for (var i = 0; i < 50; i++) {
                var d = year--;
                select.options.add(new Option(d, d));
            }
        },

        insertCategories: function (cats, elementId, defaultText) {
            var select = document.getElementById(elementId);
            select.length = 0;
            select.options.add(new Option(defaultText, 0));
            for (var i = 0; i < cats.length; i++) {
                select.options.add(new Option(cats[i].get('name'), cats[i].id));
            }
        },

        insertHours: function (elementId, defaultText) {
            var select = document.getElementById(elementId);
            var hour = 0;
            select.length = 0;
            select.options.add(new Option(defaultText, 0));
            for (var i = 0; i < 24; i++) {
                hour = i + 1;
                select.options.add(new Option(hour, hour));
            }
        },

        convertCreatedAtToLong: function (createdAt) {
            var messageDateArray = [];
            messageDateArray = createdAt.split('-');
            var day = messageDateArray[2].slice(0, 2),
                month = messageDateArray[1],
                year = messageDateArray[0],
                time = messageDateArray[2].slice(3, 11);
            month = this.convertMonth(this.returnInteger(month));
            var date = month + ' / ' + day + ' ' + time;
            return date;
        },

        convertDate: function (date) {
            var messageDateArray = [];
            messageDateArray = date.split('-');
            var day = messageDateArray[2].slice(0, 2),
                month = messageDateArray[1],
                year = messageDateArray[0];
            return month + '/' + day + '/' + year;
        },

        checkTime: function (usersDate) {
            var date = new Date();

            var userDate = usersDate.split('-'),
                userYear = this.returnInteger(userDate[0]),
                userMonth = this.returnInteger(userDate[1]),
                userDay = this.returnInteger(userDate[2].slice(0, 2));

            userDate = new Date(userYear, userMonth - 1, userDay);

            var diff = Math.floor(userDate.getTime() - date.getTime());
            return diff;
        },

        shortenName: function (model) {
            var firstName = model.get('first_name'),
                lastName = model.get('last_name');
            var name = '';
            if (lastName) {
                name = firstName + lastName;
                if (name.length > 15) {
                    model.set('last_name', '');
                }
            }
        },

        isBrowserIeLow: function () { //TODO Extend this check for other specific browser type (if needed)
            var currentBrowserVer = parseFloat(wrgSettings.browserVersion.version);

            if (wrgSettings.browserVersion.msie && currentBrowserVer < 10) { //10 and above is HTMLFive compliant
                return true;
            } else {
                return false;
            }
        }
    };
    return conversionUtils;
});