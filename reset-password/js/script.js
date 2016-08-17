function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function validatePassword(password) {
    var regex = new RegExp(".+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2}[A-Za-z]*");
    return regex.exec(password);
}

$(function() {
    var updateSubmitButtonEnabledState = function() {
        var email = $('.reset-form #email').val();
        var password = $('.reset-form #password').val();

        if (password && password.length >= 8 && email && validatePassword(email)) {
            $("#saveButton").removeAttr("disabled");
        } else {
            $("#saveButton").attr("disabled", true);
        }
    };
    $("#email").on("change paste keyup", updateSubmitButtonEnabledState);
    $("#password").on("change paste keyup", updateSubmitButtonEnabledState);

    $('.reset-form').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        var token = getParameterByName('token');
        var email = $('.reset-form #email').val();
        var password = $('.reset-form #password').val();

        $("#saveButton").attr("disabled", true);
        $.ajax({
            url: 'https://api.hopestream.com/account/reset-password',
            type: 'PUT',
            data: { 'email': email, 'password': password, 'token': token },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'bearer 887798c9-ba9a-400c-86b3-9a0353d4fa17');
            },
            success: function () {
                $('.message').html($('<div class="alert alert-success">Password change successful.</div>'));
                $('.message').hide();
                $('.message').fadeIn('fast');
            },
            error: function () {
                $("#saveButton").removeAttr("disabled");
                $('.message').html($('<div class="alert alert-danger">Sorry, there was a problem resetting your password.</div>'));
                $('.message').hide();
                $('.message').fadeIn('fast');
                $('.message').delay(2500).fadeOut('fast');
            }
        });
    });
});
