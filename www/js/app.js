var me = {
  routing: function(element) {
    $('.' + element).on('click', function () {
      // Tab bar
      $('.tab-bar__item').removeClass('current');
      $(this).addClass('current');

      // Pages
      $('.routing').removeClass('show');
      var current = $(this).attr('data-routing');
      $('.routing#' + current).addClass('show');
    });
  },
  login: function() {
    $('#jsShowConnectForm').on('click', function () {
      $(this).parents('.login').addClass('step2');
      $('.login__info-touch').fadeOut();
      $('.login__form').delay(800).fadeIn();
    });
  },
  input:function(element) {
    var myElement = $('#' + element);
    myElement.keyup(function() {
      var n = myElement.val();
      if (n != "") {
        myElement.prev().addClass('move');
      } else {
        myElement.prev().removeClass('move');
      }
    });
  }
};

me.routing('planning');
me.routing('validation');
me.routing('actions');
me.routing('profile');

me.login();
me.input('login-email');
me.input('login-pwd');