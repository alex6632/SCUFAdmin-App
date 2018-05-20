var routing = {
  /**
   * LEVEL 1 ROUTING
   * - Planning
   * - Validations
   * - Actions
   * - Profil
   */
  level1: function (element, authTokenVALUE) {
    $('.' + element).on('click', function () {
      if (utils.isValidToken()) {
        var userID = localStorage.getItem('userID');
        
        // Tab bar
        $('.tab-bar__item').removeClass('current');
        $(this).addClass('current');

        // Pages
        $('.routing').removeClass('show');
        var current = $(this).attr('data-routing');
        $('.routing#' + current).addClass('show');

        if(current != "planning" || current != "editPlanning") {
          utils.removeEventHandlers('calendar');
        }

        // Specific actions for each page
        switch (current) {
          case "notification":
    
            break;
          case "planning":
            calendar.init(authTokenVALUE, userID, 'calendar');
            $('#calendar').fullCalendar('refetchEvents');
            break;
          case "validation":
            utils.removeHTML('validation');
            utils.removeEventHandlers('validation');
            anim.switch('stop', authTokenVALUE);
            anim.switch('ok', authTokenVALUE);
            anim.switch('no', authTokenVALUE);
            anim.switch('label--stop', authTokenVALUE);
            anim.switch('label--ok', authTokenVALUE);
            anim.switch('label--no', authTokenVALUE);
            let date = 'now'; // 2018-05-16
            page.validation(authTokenVALUE, userID, date);
            page.confirmValidation(authTokenVALUE);
            break;
          case "actions":
          
            break;
          case "profile":
            page.profile(authTokenVALUE, userID);
            page.refreshProfile(authTokenVALUE, userID);
            break;
        }

        // RefreshNotifications
        page.refreshNotifications(authTokenVALUE, userID);
      }
    });
  },
  /**
   * LEVEL 2 ROUTING
   * -- Demande de repos compensatoire
   * -- Demande de congés
   * -- Demande d'heures supplémentaires
   * -- Editer un planning
   * -- Droits
   * -- Réglages
   * -- Gestion des utilisateurs
   */
  level2: function (authTokenVALUE, userID, ROLE) {
    $('.jsGoLevel2').on('click', function () {
      let element = $(this).attr('data-routing');
      let jsGoLevel1 = $(this).parents('.routing').find('.jsGoLevel1');
      let content = '';
      $('.tab-bar__overlay').fadeIn();
      switch (element) {
        case "rest":
          jsGoLevel1.attr('data-id', 'level2Rest');
          crud.ajaxSimpleList(localStorage.getItem('ENV') + '/actions/rest/' + userID, $('.rest-list tbody'), 'rest', authTokenVALUE);
          crud.ajaxAddAction('rest', authTokenVALUE, userID);
          crud.ajaxRemove('.rest-list', '.rest-list #deleteRest', 'action', authTokenVALUE, 'rest');
          content = 'Repos';
          break;
        case "leave":
          jsGoLevel1.attr('data-id', 'level2Leave');
          crud.ajaxSimpleList(localStorage.getItem('ENV') + '/actions/leave/' + userID, $('.leave-list tbody'), 'leave', authTokenVALUE);
          crud.ajaxAddAction('leave', authTokenVALUE, userID);
          crud.ajaxRemove('.leave-list', '.leave-list #deleteLeave', 'action', authTokenVALUE, 'leave');
          content = 'Congés';
          break;
        case "hours":
          jsGoLevel1.attr('data-id', 'level2Hours');
          page.getEmployees(authTokenVALUE, userID, 'hours');
          crud.ajaxSimpleList(localStorage.getItem('ENV') + '/actions/hours/' + userID, $('.hours-list tbody'), 'hours', authTokenVALUE);
          crud.ajaxAddAction('hours', authTokenVALUE, userID);
          crud.ajaxRemove('.hours-list', '.hours-list #deleteHours', 'action', authTokenVALUE, 'hours');
          content = 'H. supp.';
          break;
        case "edit":
          jsGoLevel1.attr('data-id', 'level2Edit');
          calendar.init(authTokenVALUE, userID, 'calendar-edit');
          content = 'Modif. EDT';
          break;
      }
      $(this).parents('.level1').addClass('swipe');
      $('#' + element).addClass('show');
      jsGoLevel1.addClass('show');
      $(this).parents('.routing').find('.jsSearch').addClass('hide');
      $(this).parents('.routing').find('.title span').text("/ " + content);
    });

    // Back level 1
    $('.jsGoLevel1').on('click', function () {
      $('.tab-bar__overlay').fadeOut();
      var id = $(this).attr('data-id');
      utils.removeHTML(id);
      utils.removeEventHandlers(id);

      $(this).removeClass('show');
      $(this).removeAttr('id');
      $(this).prev().removeClass('hide');
      $(this).parents('.routing').find('.level1').removeClass('swipe');
      $(this).parents('.routing').find('.level2').removeClass('show');
      $(this).parents('.routing').find('.title span').text('');
    });
  }
};