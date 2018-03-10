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
  },
  swipe:function (element) {
    // var lastX = 0;
    // console.log('XXXX : '+lastX);
    // $(document).on('touchmove', '.'+element, function(e) {
    //   //e.preventDefault();
    //   var currentX = e.originalEvent.touches[0].clientX;
    //   console.log(currentX);
    //   //var direction = getDirection();
    //   if (currentX > lastX) {
    //     console.log('swipe');
    //     $(this).animate({
    //       'transform': 'translateX(-50%)'
    //     })
    //   }
    // });
    var ts;
    var el = $('.' + element);
    el.bind('touchstart', function (e){
      ts = e.originalEvent.touches[0].clientX;
    });

    el.bind('touchend', function (e){
      var te = e.originalEvent.changedTouches[0].clientX;
      if(ts > te+5){
        $(this).addClass('swipe');
      }else if(ts < te-5){
        $(this).removeClass('swipe');
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

me.swipe('notification__list__item');