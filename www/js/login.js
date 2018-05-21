/*
* LOGIN
*/
var login = {
  loginPage: function () {
    if (window.localStorage.getItem('authTokenID') === null) {
      $('.loginTrigger').removeClass('hide');
      var loginHTMLPage = '' +
        '<div class="login">' +
        '<div class="login__top" id="jsShowConnectForm">' +
        '<div class="login__top__inner">' +
        '<div class="login__head">' +
        '<div class="icon icon-lock"></div>' +
        '<div class="login__head__title">Connexion</div>' +
        '</div>' +
        '<div class="login__info-touch">Toucher pour vous connecter</div>' +
        '<form action="" class="login__form">' +
        '<div class="login__form__block">' +
        '<label for="login-email" class="login__form__label">Nom utilisateur</label>' +
        '<input type="text" class="login__form__input" id="login-email" name="login" autocomplete="off"/>' +
        '</div>' +
        '<div class="login__form__block">' +
        '<label for="login-pwd" class="login__form__label">Mot de passe</label>' +
        '<input type="password" class="login__form__input" id="login-pwd" name="password" autocomplete="off"/>' +
        '</div>' +
        '<button type="submit" class="button">Se connecter</button>' +
        '</form>' +
        '</div>' +
        '</div>' +
        '<div class="logo">' +
        '<img src="images/logo.jpg" alt="">' +
        '</div>' +
        '</div>';

      $('.loginTrigger').append(loginHTMLPage);

      $('.loginTrigger').on('click', '#jsShowConnectForm', function () {
        $(this).parents('.login').addClass('step2');
        $(this).find('.login__info-touch').fadeOut();
        $(this).find('.login__form').delay(800).fadeIn();
      });
      anim.input('login-email');
      anim.input('login-pwd');

    } else {
      $('.loginTrigger .login').remove();
      $('.loginTrigger').addClass('hide');
      const authTokenVALUE = window.localStorage.getItem('authTokenVALUE');
      const userID = window.localStorage.getItem('userID');
      me.init();
    }
  },

  ajaxLogin: function () {
    $('.loginTrigger').on('submit', '.login__form', function (e) {
      e.preventDefault();
      $('#jsShowConnectForm').append('<div class="loader"><div class="loader__gif"></div></div>');
      var api = window.localStorage.getItem('ENV') + "/auth-tokens";
      $.ajax({
        url: api,
        data: $(this).serialize(),
        type: 'POST',
        success: function (response) {
          console.log(response);
          
          // App reload for prevent any bug caused by off activity
          window.location.reload(true);

          $('#jsShowConnectForm .loader').remove();
          $('.msg-flash .alert').remove();
          window.localStorage.setItem('authTokenID', response.authToken.id);
          window.localStorage.setItem('authTokenVALUE', response.authToken.value);
          window.localStorage.setItem('userID', response.authToken.user.id);
          window.localStorage.setItem('ROLE', response.authToken.user.role);
          window.localStorage.setItem('authTokenCREATED', response.createdTime);
          window.localStorage.setItem('tokenValidityDuration', response.tokenValidityDuration);

          login.loginPage();
        },
        error: function (response) {
          $('#jsShowConnectForm .loader').remove();
          console.log(response);
          var error = response.responseJSON.code + " : " + response.responseJSON.message;
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
        }
      });
    });
  },

  cleaLogin: function (authTokenVALUE, userID) {
    $('.loginTrigger .login').remove();
    $('.loginTrigger').addClass('hide');
    //location.reload();
    utils.reloadDefaultPageOnRefresh(authTokenVALUE, userID);
  }
};