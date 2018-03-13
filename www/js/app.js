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
  routingLevel2: function (element) {
    $('.' + element).on('click', function () {
      var content = $(this).text();
      $(this).parents('.level1').addClass('swipe');
      $('#' + element).addClass('show');
      $(this).parents('.routing').find('.jsGoLevel1').addClass('show');
      $(this).parents('.routing').find('.jsGoSearch').addClass('hide');
      $(this).parents('.routing').find('.header__lvl2').text(content).addClass('show');
    });
    $('.jsGoLevel1').on('click', function () {
      $(this).removeClass('show');
      $(this).prev().removeClass('hide');
      $(this).parents('.routing').find('.level1').removeClass('swipe');
      $(this).parents('.routing').find('.level2').removeClass('show');
      $(this).parents('.routing').find('.header__lvl2').text('').removeClass('show');
    });
  },
  fadeInPage: function (element) {
    $('.' + element).on('click', function () {
      var elementToShow = $('#' + element);
      if(elementToShow.css('display') == 'none') {
        elementToShow.fadeIn();
      } else {
        elementToShow.fadeOut();
      }
    })
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
        $('.notification__list__item').removeClass('swipe');
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

me.routingLevel2('rest');
me.routingLevel2('leave');
me.routingLevel2('hours');

me.fadeInPage('jsNotifications');

me.login();
me.input('login-email');
me.input('login-pwd');

me.swipe('notification__list__item');