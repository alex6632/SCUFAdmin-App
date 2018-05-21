/*
* LOGOUT ACTION
*/
var logout = {
  ajaxLogout: function (authTokenVALUE, authTokenID) {
    $('.jsLogout').on('click', function () {
      if (confirm("Êtes vous certain de vouloir vous déconnecter ?")) {
        $('.routing.show').append('<div class="loader"><div class="loader__gif"></div></div>');
        var api = window.localStorage.getItem('ENV') + "/auth-tokens/" + authTokenID;
        $.ajax({
          url: api,
          type: 'DELETE',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function () {
            
            // App reload to be sure that all env variables are cleaned
            window.location.reload(true);

            //document.location.href="/";
            //document.location.href="http://localhost/_SCUFAdmin/web/www/index.html";
            $('.routing.show .loader').remove();
            window.localStorage.removeItem('authTokenID');
            window.localStorage.removeItem('authTokenVALUE');
            window.localStorage.removeItem('userID');
            window.localStorage.removeItem('ROLE');
            window.localStorage.removeItem('authTokenCREATED');
            window.localStorage.removeItem('tokenValidityDuration');
            window.localStorage.removeItem('settingCOEFF');
            login.loginPage();
          },
          error: function (response) {
            $('.routing.show .loader').remove();
            console.log(response);
            //var error = response.responseJSON.code + " : " + response.responseJSON.message;
            //$('.msg-flash .alert').remove();
            //$('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
          }
        });
      }
    });
  }
};