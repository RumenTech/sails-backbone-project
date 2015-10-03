/**
 * Created with JetBrains PhpStorm.
 * User: mike
 * Date: 9/19/13
 * Time: 2:43 PM
 * To change this template use File | Settings | File Templates.
 */


function login_fail(){

    var data_sent = {
        "username":"alumniwrg",
        "password" : "jajaaaja"
    };

    $("#before_login_fail").html("EMPTY");
    $.ajax({
        type: "GET",
        url: "/user/",
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#before_login_fail").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#before_login_fail").html(errMsg);

        },
        statusCode: {
            403: function() {
                $("#before_login_fail").html("Good : Must Be 404 Error");
            }

        }


    });

    $("#login_answer_1").html("EMPTY");
    $.ajax({
        type: "POST",
        url: "/auth/process",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#login_answer_1").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#login_answer_1").html(errMsg);

        }


    });

    $("#after_login_fail").html("EMPTY");
    $.ajax({
        type: "GET",
        url: "/user/",
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#after_login_fail").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#after_login_fail").html(errMsg);

        },
        statusCode: {
            403: function() {
                $("#after_login_fail").html("SUCCESSFUL : Must Be 404 Error");
            }

        }


    });

}

function login_success(){

    var data_sent = {
        "username":"alumniwrg",
        "password" : "jajaja"
    };

    $("#login_answer_2").html("EMPTY");
    $.ajax({
        type: "POST",
        url: "/auth/process",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data_sent),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data){

            $("#login_answer_2").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#login_answer_2").html(errMsg);

        }


    });

    $("#after_login_success").html("EMPTY");
    $.ajax({
        type: "GET",
        url: "/user/",
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#after_login_success").html(JSON.stringify(data));

        },
        failure: function(errMsg) {

            $("#after_login_success").html(errMsg);

        },
        statusCode: {
            403: function() {
                $("#after_login_success").html("Status Code 403");
            }

        }


    });


}

function logout(){

    $("#logout_answer").html("EMPTY");
    $.ajax({
        type: "GET",
        url: "/logout",
        // The key needs to match your method's input parameter (case-sensitive).
        async: false,
        success: function(data){

            $("#logout_answer").html(data);

        },
        failure: function(errMsg) {

            $("#logout_answer").html(errMsg);

        }


    });

    $("#after_logout").html("EMPTY");
    $.ajax({
        type: "GET",
        url: "/user",
        // The key needs to match your method's input parameter (case-sensitive).
        dataType: "json",
        async: false,
        success: function(data){

            $("#after_logout").html(data);

        },
        failure: function(errMsg) {

            $("#after_logout").html(errMsg);

        },
        statusCode: {
            403: function() {
                $("#after_logout").html("SUCCESSFUL : Must Be 404 Error");
            }

        }


    });




}






