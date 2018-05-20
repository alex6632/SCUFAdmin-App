var anim = {
  showForm: function (element, authTokenVALUE, ROLE) {
    var elt = $('.' + element);
    $('#' + element).on('click', function () {
      $(this).addClass('hide');
      $('#jsCloseFormAddUser').addClass('show');
      elt.slideDown();
      
      //utils.ajaxGet('access', 'all', authTokenVALUE);

      let roleList = '' +
      '<option value="2">Manager</option>' +
      '<option value="1">Salarié</option>';

      if(ROLE == 4) {
        roleList += '<option value="4">Administrateur</option>' +
        '<option value="3">Superviseur</option>';
      }
      $('#roleList option').remove();
      $('#roleList').append(roleList);
    });
    $('#jsCloseFormAddUser').on('click', function () {
      $(this).removeClass('show');
      $('#jsFormAddUser').removeClass('hide');
      elt.slideUp();
      $('.action__list__item.list div').detach();
    })
  },

  fadeInPage: function (authTokenVALUE, userID) {
    $('.routing').on('click', '.jsNotifications', function () {
      $('#jsNotifications').fadeIn();
      page.notifications(authTokenVALUE, userID);
      page.declineNotification(authTokenVALUE, userID);
      calendar.addEventFromNotification(authTokenVALUE, userID);
    })
    $('.notification__close').click(function() {
      $('#jsNotifications').fadeOut();
      utils.removeHTML("notifications");
      $('.notification__list').off('click', '.jsApproveAction');
      $('.notification__list').off('click', '.jsADeclineAction');
    })
  },

  input: function (element) {
    var myElement = $('#' + element);
    myElement.keyup(function () {
      var n = myElement.val();
      if (n != "") {
        myElement.prev().addClass('move');
      } else {
        myElement.prev().removeClass('move');
      }
    });
  },

  swipe: function (element) {
    var ts;
    var el = $('.' + element);
    el.on('touchstart', '.notification__list__item', function (e) {
      if ($(this).hasClass('not-seen')) {
        ts = e.originalEvent.touches[0].clientX;
      }
    });

    el.on('touchend', '.notification__list__item', function (e) {
      if ($(this).hasClass('not-seen')) {
        var te = e.originalEvent.changedTouches[0].clientX;
        if (ts > te + 5) {
          $('.notification__list__item').removeClass('swipe');
          $(this).addClass('swipe');
        } else if (ts < te - 5) {
          $(this).removeClass('swipe');
        }
      }
    });
  },

  switch: function (element, authTokenVALUE) {

    $('#validation').on('click', '.' + element, function () {

      // 1. Make Anim
      status = $(this).attr('data-status');
      validationItem = $(this).parents('.validation-item');
      validationItem.find('.validation-item__justification').remove();
      validationItem.find('.error-msg').remove();
      validationItem.find('.validationConfrim').remove();
      validationItem.removeClass('border-ok');
      validationItem.removeClass('border-no');
      validationItem.removeClass('border-stop');
      validationItem.addClass('border-' + status);
      validationItem.find('.validation-item__justification').fadeOut();
      $(this).parents('.switch').find('.switch__btn').removeClass('stop');
      $(this).parents('.switch').find('.switch__btn').removeClass('ok');
      $(this).parents('.switch').find('.switch__btn').removeClass('no');
      $(this).parents('.switch').find('.switch__btn').addClass(status);
      const startHours = $(this).parents('form').find('.validation-item__hours').attr('data-start');
      const endHours = $(this).parents('form').find('.validation-item__hours').attr('data-end');

      let notJustification = '' +
      '<div class="validation-item__justification jsJustificationNo">' +
        '<ul class="action__list">' +
          '<li class="action__list__item textarea">' +
            '<textarea name="justification"  class="justification small" cols="30" rows="10" placeholder="Justification"></textarea>' +
            '<span class="error-msg error-msg--validation"></span>' +
          '</li>' +
        '</ul>' +
      '</div>';

      let partialJustification = '' +
      '<div class="validation-item__justification jsJustificationStop">' +
        '<ul class="action__list">' +
          '<li class="action__list__item">' +
            '<span>Heure de début : </span>' +
            '<input type="time" min="' + startHours + '" max="' + endHours + '" step="900" class="startAction">' +
            '<span class="error-msg"></span>' +
            '<input type="hidden" name="partial_start" value="" class="partial_start">' +
          '</li>' +
          '<li class="action__list__item">' +
            '<span>Heure de fin : </span>' +
            '<input type="time" min="' + startHours + '" max="' + endHours + '" step="900" class="endAction">' +
            '<span class="error-msg"></span>' +
            '<input type="hidden" name="partial_end" value="" class="partial_end">' +
          '</li>' +
        '</ul>' +
        '<ul class="action__list">' +
          '<li class="action__list__item textarea">' +
            '<textarea name="justification"  class="justification small" cols="30" rows="10" placeholder="Justification"></textarea>' +
            '<span class="error-msg error-msg--validation"></span>' +
          '</li>' +
        '</ul>' +
      '</div>';

      if (status == 'stop') {
        $(this).parents('.switch').prev().text('Partiellement');
        validationItem.append(partialJustification);
      } else if (status == 'ok') {
        $(this).parents('.switch').prev().text('Fait');
      } else {
        $(this).parents('.switch').prev().text('Non fait');
        validationItem.append(notJustification);
      }

      validationItem.append('<button type="submit" class="validationConfrim">Valider définitivement ce choix</button>');

    })
  },

  progressBar: function () {
    var screenWidth = ($(document).width());
    $('.progress-bar').css('width', screenWidth);
    $('.progress-bar__bar__wip span').css('min-width', screenWidth);
  },
};