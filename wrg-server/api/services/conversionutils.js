exports.returnInteger = function (value, errormessage, fromWhere) {
    "use strict";
    var result = null;
    if ((parseFloat(value) === parseInt(value, 10)) && !isNaN(value)) {
        result = parseInt(value, 10);
    } else {
        if (errormessage) {
            if(fromWhere === 'group') {
                console.log('  -- Catching error --  ');
                result = 0;
            } else {
                throw errormessage;
            }

        } else {
            throw 'Error parsing integer ' + value;
        }
    }
    return result;
};

exports.convertTime = function (time) {
    var timeInt = time.slice(0, time.indexOf(':')),
        timeInteger;
    if (time.indexOf('am') !== -1) {
        timeInteger = this.returnInteger(timeInt);
    } else if (time.indexOf('pm') !== -1) {
        timeInteger = this.returnInteger(timeInt) + 12;
    }
    return timeInteger;
};

exports.convertIndustriesToArray = function (report) {
    var reportData = {};
    reportData.reporting = [];
    for (var i = 0; i < report.length; i++) {
        if(report[i].industry === '' || report[i].industry === null || report[i].industry === undefined) {
            i++;
        }
        reportData.reporting[i] = [report[i].industry,  this.returnInteger(report[i].count)]
    }
    return reportData;
};


exports.convertEducationToArray = function (report) {
    var reportData = {};
    reportData.reporting = [];
    for (var i = 0; i < report.length; i++) {
        if(report[i].highest_edu_level === '' || report[i].highest_edu_level === null || report[i].highest_edu_level === undefined) {
            i++;
        }
        if (i < report.length) {
            reportData.reporting[i] = [report[i].highest_edu_level,  this.returnInteger(report[i].count)]
        }

    }
    return reportData;
};

exports.convertSkillsToArray = function (report) {
    var reportData = {};
    reportData.reporting = [];
    for (var i = 0; i < report.length; i++) {
        if(report[i].name === '' || report[i].name === null || report[i].name === undefined) {
            i++;
        }
        reportData.reporting[i] = [report[i].name,  this.returnInteger(report[i].count)]
    }
    return reportData;
};

exports.checkTimeDifference = function (usersDate) {
    var date = new Date();

    var userDate = usersDate.split('-'),
        userYear = this.returnInteger(userDate[0]),
        userMonth = this.returnInteger(userDate[1]),
        userDay = this.returnInteger(userDate[2].slice(0,2));

    userDate = new Date(userYear, userMonth-1, userDay);

    var diff = Math.floor(date.getTime() - userDate.getTime());
    var day = 1000* 60 * 60 * 24;

    var days = Math.floor(diff/day);
    var months = Math.floor(days/31);
    var years = Math.floor(months/12);

    var message = userDate.toDateString();
    message += " was ";
    message += days + " days ";
    message += months + " months ";
    message += years + " years ago \n";

    console.log(message);

    return months;
};

exports.categoryArray = function (categoryId) {
    var categories = [];
    categories[0] = 'Internship/Co-op';
    categories[1] = 'Community Service';
    categories[2] = 'Public Speaking';
    categories[3] = 'Research';
    categories[4] = 'Leadership';
    categories[5] = 'Innovation';
    categories[6] = 'Industry Outreach';

    return categories[categoryId - 1];
};

exports.convertEmploymentToArray = function (report, res, collegeName, startYear, endYear) {
    var reportData = {};
    reportData.reporting = [];
    var employedCounter = 0;
    if (report[0]) {
        employedCounter = this.returnInteger(report[0].count);
    }

    var yearPart =   " AND AlumniStory.graduation_year >= " + startYear + " AND AlumniStory.graduation_year <= " + endYear;
    if(startYear === 1900 ){
        //We want to show all users even though some did not enter graduation year
        yearPart = "";
    }

    var query = "SELECT COUNT(AlumniStory.id)" +
        " FROM AlumniStory " +
        " WHERE lower(AlumniStory.alma_mater) LIKE lower('%" +collegeName + "%') " +
        yearPart;

    AlumniStory.query(query, null, function(err, alumni) {
        try {
            if (err) {
                return res.send({ message : err.message }, 500);
            } else {
               var numberOfAlumnus = alumni.rows[0].count,
                   unemployedNumber = numberOfAlumnus - employedCounter;
                reportData.reporting[0] = ['Employed',   employedCounter];
                reportData.reporting[1] = ['Not Employed',   unemployedNumber];
                return res.send(reportData, 200);

            }
        } catch (err) {
            return res.send({ message : err.message }, 500);
        }
    });

};
