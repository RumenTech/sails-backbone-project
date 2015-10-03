function create_failed(){

    var data_sent = {
        "first_name" : "Alumni",
        "last_name" : "Student",
        "email" : "alumni@wrg.com",
        "password" : "jajaja",
        "alma_mater"          : "Alma",
        //"major"               : "my major",
        "graduation_month"    : 12,
        "graduation_year"     : 2012,
        "company"             : "westrick",
        "job_title"           : "computer",
        "activities"          : "my activities",
        "advice"              : "my advice"
    };

    var url = "/user/new_alumni";

    $("#fail_received").html("Waiting...");
    $("#fail_sent").html(JSON.stringify(data_sent));
    $("#fail_url").html(url);

    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#fail_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#fail_received").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#fail_received").html(err.responseText);
            }

        }


    });



    //---------------OK REGISTER -----------------

    var data_sent = {
        "first_name" : "Alumni",
        "last_name" : "WRG",
        "email" : "alumni@wrg.com",
        "password" : "jajaja",
        "alma_mater"          : "Alma",
        "major"               : "my major",
        "graduation_month"    : 12,
        "graduation_year"     : 2012,
        "company"             : "westrick",
        "job_title"           : "computer",
        "activities"          : "my activities",
        "advice"              : "my advice"
    };


    $("#ok_received").html("Waiting...");
    $("#ok_sent").html(JSON.stringify(data_sent));
    $("#ok_url").html(url);

    $.ajax({
        type: "POST",
        url: url,
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#ok_received").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#ok_received").html(errMsg);

        },
        statusCode: {
            500: function(err) {
                $("#ok_received").html(err.responseText);
            }

        }


    });
}

