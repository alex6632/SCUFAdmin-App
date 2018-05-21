var page = {
  /*
   * -------------------
   * PROFILE PAGE
   * -------------------
   */
  profile: function (authTokenVALUE, userID) {
    $('#profile').append('<div class="loader"><div class="loader__gif"></div></div>');
    var api = window.localStorage.getItem('ENV') + "/user/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        console.log(response)
        $('#profile .loader').remove();
        var role = "";
        switch (response.user.role) {
          case 1:
            role = 'Salarié';
            break;
          case 2:
            role = 'Manager';
            break;
          case 3:
            role = 'Superviseur';
            break;
          case 4:
            role = 'Administrateur';
            break;
          default:
            role = "Aucun";
        }
        let hoursToPlanify = response.user.hoursTodo - response.user.hoursPlanified;
        
        let percentageHoursTodoThisWeek = response.hoursTodoThisWeek == 0 ? (0).toFixed(2) : ((response.hours_done / response.hoursTodoThisWeek) * 100).toFixed(2);
        let valided = response.hours_done;
        let notValided = response.hoursTodoThisWeek - response.hours_done;

        let percentageHoursTodo = response.user.hoursTodo == 0 ? (0).toFixed(2) : ((response.user.hoursDone / response.user.hoursTodo) * 100).toFixed(2);
        let percentageHoursPlanified = hoursToPlanify == 0 ? (0).toFixed(2) : ((response.user.hoursPlanifiedByMe / hoursToPlanify) * 100).toFixed(2);
        let coeff = window.localStorage.getItem('settingCOEFF');
        let restHours = Math.trunc(response.user.overtime * coeff);
        let restMinutes = Math.floor((response.user.overtime * coeff).toFixed(2) * 60) % 60;
        let rest = restHours == 0 ? restMinutes + '<span>MIN</span>' : restHours + '<span>H</span>' + restMinutes;
      
        if (response.user.access.length > 0) {
          var listAccess = '';
          for (var i = 0; i < response.user.access.length; i++) {
            listAccess += '' +
              '<div>' +
              '<input type="checkbox" checked disabled>' +
              '<label>' + response.user.access[i].title + '</label>' +
              '</div>';
          }
        } else {
          listAccess = 'Aucun';
        }

        $('#profile-firstname').text(response.user.firstname);
        $('#profile-lastname').text(response.user.lastname);
        $('#profile-username').text(response.user.username);
        $('#profile-role').text(role);
        $('#profile-superior').text(response.superiorName);
        $('#profile-access').text(listAccess);

        $('#jsHoursTodoThisWeek .progress-bar__ratio').html('<span class="ratio-ok">' + valided + '</span>/' + response.hoursTodoThisWeek + '<span>H</span>');
        $('#jsHoursTodoThisWeek .progress-bar__bar__text, #jsHoursTodoThisWeek .progress-bar__bar__wip span').text(percentageHoursTodoThisWeek + '%');
        $('#jsHoursTodoThisWeek .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursTodoThisWeek + '%;');
        $('#validedHours').text(valided);
        $('#notValidedHours').text(notValided);

        $('#jsHoursTodo .progress-bar__ratio').html('<span class="ratio-ok">' + response.user.hoursDone + '</span>/' + response.user.hoursTodo + '<span>H</span>');
        $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text(percentageHoursTodo + '%');
        $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursTodo + '%;');
        $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok">' + response.user.hoursPlanifiedByMe + '</span>/' + hoursToPlanify + '<span>H</span>');
        $('#jsHoursPlanified .progress-bar__bar__text, #jsHoursPlanified .progress-bar__bar__wip span').text(percentageHoursPlanified + '%');
        $('#jsHoursPlanified .progress-bar__bar__wip').attr('style', 'width: ' + percentageHoursPlanified + '%;');
        $('.profile-page__info-hours__nb').html(rest);
      },
      error: function (response) {
        $('#profile .loader').remove();
        console.log(response);
        var error = response.responseJSON.code + " : " + response.responseJSON.message;
        $('.msg-flash .alert').remove();
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
      }
    });
    $('#profile-update-password').on('click', function () {
      $(this).fadeOut();
      $('#profile-cancel-password').fadeIn();
      $(this).parents('.profile-page__edit__text--update-pwd').find('.container-update-pwd').fadeIn();
    });
    $('#profile-cancel-password').on('click', function () {
      $(this).fadeOut();
      $('#profile-update-password').fadeIn();
      $(this).parents('.profile-page__edit__text--update-pwd').find('input').val('');
      $(this).parents('.profile-page__edit__text--update-pwd').find('.container-update-pwd').fadeOut();
    })
    $('#jsUpdatePassword').on('click', function () {
      previousPassword = $('#previous_password').val();
      plainPassword = $('#new_password').val();
      confirmPassword = $('#confirm_new_password').val();

      if (previousPassword.length != "" && plainPassword.length != "" && confirmPassword.length != "") {
        var api = window.localStorage.getItem('ENV') + "/user/update/" + userID;
        var data = {
          previous_password: previousPassword,
          plain_password: plainPassword,
          confirm_password: confirmPassword
        };
        $.ajax({
          url: api,
          type: 'PATCH',
          data: data,
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
            //page.refreshProfile(authTokenVALUE, userID);
            $('#profile-cancel-password').fadeOut();
            $('#profile-update-password').fadeIn();
            $('#profile-cancel-password').parents('.profile-page__edit__text--update-pwd').find('input').val('');
            $('#profile-cancel-password').parents('.profile-page__edit__text--update-pwd').find('.container-update-pwd').fadeOut();
          },
          error: function (response) {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.responseJSON.message + '</div>');
          }
        })
      } else {
        $('.msg-flash .alert').remove();
        $('.msg-flash').append('<div class="alert alert--error" role="alert">Tous les champs sont obligatoire !</div>');
      }
    });
  },
  /*
   * ---------------------
   * REFRESH PROFILE PAGE
   * ---------------------
   */
  refreshProfile: function (authTokenVALUE, userID) {
    $('.jsRefreshProfile').on('click', function () {
      // Reset all data
      $('#profile-firstname').text('');
      $('#profile-lastname').text('');
      $('#profile-username').text('');
      $('#profile-role').text('');
      $('#profile-superior').text('');
      $('#profile-access').text('');
      $('#jsHoursTodo .progress-bar__ratio').html('');
      $('#jsHoursTodo .progress-bar__bar__text, #jsHoursTodo .progress-bar__bar__wip span').text('%');
      $('#jsHoursTodo .progress-bar__bar__wip').attr('style', 'width: 0%;');
      $('#jsHoursPlanified .progress-bar__ratio').html('<span class="ratio-ok"></span>/<span>H</span>');
      $('#jsHoursPlanified .progress-bar__bar__text, #jsHoursPlanified .progress-bar__bar__wip span').text('%');
      $('#jsHoursPlanified .progress-bar__bar__wip').attr('style', 'width: 0%;');
      $('.profile-page__info-hours__nb').html('');

      // Re inject data
      page.profile(authTokenVALUE, userID);
    });
  },

  /*
   * ------------------------
   * GET COEFF VALUE FROM DB
   * ------------------------
   */
  getSetting: function (element, authTokenVALUE) {
    var api = window.localStorage.getItem('ENV') + "/setting/main/" + element;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        window.localStorage.setItem('settingCOEFF', response[0].value);
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  /*
   * -------------------------------
   * GET EMPLOYEES LIST FOR A USER
   * -------------------------------
   */
  getEmployees: function (authTokenVALUE, userID, page) {
    var api = window.localStorage.getItem('ENV') + "/users/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        switch (page) {
          case "hours":
            for (var i = 0; i < response.length; i++) {
              $('#jsEmployeesList').append('<option value="' + response[i].id + '">' + response[i].firstname + ' ' + response[i].lastname + '</option>');
            }
            break;
          case "planning":
            $('.selectUserToEditPlanning option').remove();
            $('.selectUserToEditPlanning').append('<option value="default">Liste des utilisateurs</option>');
            for (var i = 0; i < response.length; i++) {
              $('.selectUserToEditPlanning').append('<option value="' + response[i].id + '">' + response[i].firstname + ' ' + response[i].lastname + '</option>');
            }
            break;
        }
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  /*
   * -------------------
   * NOTIFICATION PAGE
   * -------------------
   */
  notifications: function (authTokenVALUE, userID) {
    $('#jsNotifications').append('<div class="loader"><div class="loader__gif"></div></div>');
    var api = window.localStorage.getItem('ENV') + "/notifications/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        console.log(response);
        $('#jsNotifications .loader').remove();
        if(response.count > 0) {
          $('.notification__wait').text(response.countInProgress + ' en attente de traitement');
          for (var i = 0; i < response.list.length; i++) {
            let li = '';
            let view = response.list[i].view == 0 ? "not-seen" : "";
            let statusClass = "";
            if (response.list[i].status != 2) {
              statusClass = response.list[i].status == 0 ? "notification__status--refused" : "notification__status--accepted";
            }
            switch (response.list[i].type) {
              case 'rest':
                li = '' +
                  '<li class="notification__list__item ' + view + '">' +
                  '<div class="notification__status ' + statusClass + '"></div>' +
                  '<form>' +
                  '<input type="hidden" class="notification-userID" value="' + response.list[i].userID + '">' +
                  '<input type="hidden" class="notification-id" value="' + response.list[i].id + '">' +
                  '<input type="hidden" class="notification-type" value="' + response.list[i].type + '">' +
                  '<input type="hidden" class="notification-start" value="' + response.list[i].startUnformatted + '">' +
                  '<input type="hidden" class="notification-end" value="' + response.list[i].endUnformatted + '">' +
                  '<div class="notification__author">De ' + response.list[i].userFirstName + ' ' + response.list[i].userLastName + '</div>' +
                  '<div>Demande de repos compensatoire</div>' +
                  '<div>Le ' + response.list[i].startDate + ' de ' + response.list[i].startHours + ' à ' + response.list[i].endHours + '</div>' +
                  '<div class="notification__justification">' + response.list[i].justification + '</div>' +
                  '<div class="options">' +
                  '<div class="options__inner options__inner--approve jsApproveAction">' +
                  '<span>Accepter</span>' +
                  '</div>' +
                  '<div class="options__inner options__inner--decline jsADeclineAction">' +
                  '<span>Décliner</span>' +
                  '</div>' +
                  '</div>' +
                  '</div>' +
                  '</form>' +
                  '</li>';
                break;
              case 'hours':
                li = '' +
                  '<li class="notification__list__item ' + view + '">' +
                  '<div class="notification__status ' + statusClass + '"></div>' +
                  '<form>' +
                  '<input type="hidden" class="notification-userID" value="' + response.list[i].userID + '">' +
                  '<input type="hidden" class="notification-id" value="' + response.list[i].id + '">' +
                  '<input type="hidden" class="notification-type" value="' + response.list[i].type + '">' +
                  '<input type="hidden" class="notification-start" value="' + response.list[i].startUnformatted + '">' +
                  '<input type="hidden" class="notification-end" value="' + response.list[i].endUnformatted + '">' +
                  '<input type="hidden" class="notification-justification" value="' + response.list[i].justification + '">' +
                  '<input type="hidden" class="notification-location" value="' + response.list[i].location + '">' +
                  '<div class="notification__author">De ' + response.list[i].userFirstName + ' ' + response.list[i].userLastName + '</div>' +
                  '<div>Demande d\'heures supplémentaires : ' + response.list[i].justification + '</div>' +
                  '<div>Lieu : ' + response.list[i].location + '</div>' +
                  '<div>Le ' + response.list[i].startDate + ' de ' + response.list[i].startHours + ' à ' + response.list[i].endHours + '</div>' +
                  '<div class="notification__motivation">Acceptez ! <br> Vous serez bientôt récompensé par un repos compensatoire !</div>' +
                  '<div class="options">' +
                  '<div class="options__inner options__inner--approve jsApproveAction">' +
                  '<span>Accepter</span>' +
                  '</div>' +
                  '<div class="options__inner options__inner--decline jsADeclineAction">' +
                  '<span>Décliner</span>' +
                  '</div>' +
                  '</div>' +
                  '</form>' +
                  '</li>';
                break;
              case 'leave':
                li = '' +
                  '<li class="notification__list__item ' + view + '">' +
                  '<div class="notification__status ' + statusClass + '"></div>' +
                  '<form>' +
                  '<input type="hidden" class="notification-userID" value="' + response.list[i].userID + '">' +
                  '<input type="hidden" class="notification-id" value="' + response.list[i].id + '">' +
                  '<input type="hidden" class="notification-type" value="' + response.list[i].type + '">' +
                  '<input type="hidden" class="notification-start" value="' + response.list[i].startUnformatted + '">' +
                  '<input type="hidden" class="notification-end" value="' + response.list[i].endUnformatted + '">' +
                  '<div class="notification__author">De ' + response.list[i].userFirstName + ' ' + response.list[i].userLastName + '</div>' +
                  '<div>Demande de congés</div>' +
                  '<div>Du ' + response.list[i].startDate + ' au ' + response.list[i].endDate + '</div>' +
                  '<div class="notification__justification">' + response.list[i].justification + '</div>' +
                  '<div class="options">' +
                  '<div class="options__inner options__inner--approve jsApproveAction">' +
                  '<span>Accepter</span>' +
                  '</div>' +
                  '<div class="options__inner options__inner--decline jsADeclineAction">' +
                  '<span>Décliner</span>' +
                  '</div>' +
                  '</div>' +
                  '</form>' +
                  '</li>' +
                  '';
                break;
            }
            $('.notification__list').append(li);
          }
        } else {
          $('.notification__wait').text(response + ' en attente de traitement');
          $('#jsNotifications .success').remove();
          $('#jsNotifications').append('<span class="success">Aucune notification pour le moment !</span>')
        }
      },
      error: function (response) {
        $('#jsNotifications .loader').remove();
        console.log(response);
      }
    });
  },

  /*
   * ---------------------------
   * REFRESH NOTIFICATION PAGE
   * ---------------------------
   */
  refreshNotifications: function (authTokenVALUE, userID) {
    var api = window.localStorage.getItem('ENV') + "/notifications/count/" + userID;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        if (response > 0) {
          $('.jsNotifications').find('#push').html('<div class="push"></div>');
        }
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  /*
  * ------------------------------------
  * IF USER DECLINE A NOTIFICATION
  * ------------------------------------
  */
  declineNotification: function (authTokenVALUE, userID) {
    $('.notification__list').on('click', '.jsADeclineAction', function (e) {
      e.preventDefault();

      // 1. Add loader
      $('#jsNotifications').append('<div class="loader"><div class="loader__gif"></div></div>');

      let item = $(this).parents('.notification__list__item');
      let actionID = item.find('.notification-id').val();

      // 2. Update data into DB
      var api = window.localStorage.getItem('ENV') + "/action/update/" + actionID;
      $.ajax({
        url: api,
        type: 'PATCH',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          console.log(response);

          // 0. Refresh notifications
          utils.removeHTML('notifications');
          page.notifications(authTokenVALUE, userID);

          // 1. Remove loader
          $('#jsNotifications .loader').remove();

          // 2. Remove "not-seen" class to item
          item.removeClass('not-seen');

          // 3. Show success message on notification page
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');

          // 4. Remove handlers event
          $('.notification__list').off('click', '.jsApproveAction');
          $('.notification__list').off('click', '.jsADeclineAction');
        },
        error: function (err) {
          console.log(err);
          $('#jsNotifications .loader').remove();
        }
      });
    });
  },
  /*
  * ------------------------------------
  * ACTION PAGE
  * ------------------------------------
  */
  actions: function (ROLE) {

    // SALARIE
    let role1 = '' +
    '<ul class="action__list">' +
      '<li class="action__list__item arrow jsGoLevel2" data-routing="rest">Repos compensatoire</li>' +
      '<li class="action__list__item arrow jsGoLevel2" data-routing="leave">Congés</li>' +
    '</ul>';

    // MANAGER
    let role2 = '';
    role2 += role1 + '' +
    '<ul class="action__list">' +
      '<li class="action__list__item premium" data-routing="dashboard">Dashboard</li>' +
      '<li class="action__list__item arrow jsGoLevel2" data-routing="edit">Editer un planning</li>' +
    '</ul>';

    // SUPERVISEUR
    let role3 = '';
    role3 += role2 + '' +
    '<ul class="action__list">' +
      '<li class="action__list__item arrow jsGoLevel2" data-routing="hours">Heures supplémentaires</li>' +
    '</ul>';

    // ADMINISTRATEUR
    let role4 = role3;

    // SUPER ADMINISTRATEUR (ROOT)
    let role42 = role4;

    let action = role1;
    switch(ROLE) {
      case '1':
        action = role1;
        break;
      case '2':
        action = role2;
        break;
      case '3' :
        action = role3;
        break;
      case '4' :
        action = role4;
        break;
      case '42' :
        action = role42;
      default :
        action = role1;
    }

    $('#generateActionsByRole').append(action);
  },
  /*
  * ------------------------------------
  * VALIDATION PAGE
  * ------------------------------------
  */
  validation: function (authTokenVALUE, userID, date) {

    // 1. Add loader
    $('#validation').append('<div class="loader"><div class="loader__gif"></div></div>');

    // 2. Refresh list of days in progress
    const api1 = window.localStorage.getItem('ENV') + '/events/in-progress/' + userID;
    $.ajax({
      url: api1,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        console.log(response);
        $('#jsListDaysInProgress option').remove();
        $('#jsListDaysInProgress').append('<option value="0">Choisir une date</option>');
        for(let i=0; i<response.length; i++) {
          let selected = '';
          //selected = moment().format('YYYY-MM-DD') == response[i].dateEN ? " selected" : '';
          if(date != 'now') {
            selected = response[i].dateEN == date ? " selected" : "";
          } 
          $('#jsListDaysInProgress').append('<option value="' + response[i].dateEN + '"' + selected + '>' + response[i].date + '</option>');
        }
      },
      error: function (err) {
        $('#validation .loader').remove();
        console.log(err);
      }
    });

    // 3. Update page if user choose an other date
    $('#jsListDaysInProgress').on('change', function () {
      utils.removeEventHandlers("validation");
      utils.removeHTML('validation');
      
      date = $(this).val();
      anim.switch('stop', authTokenVALUE);
      anim.switch('ok', authTokenVALUE);
      anim.switch('no', authTokenVALUE);
      anim.switch('label--stop', authTokenVALUE);
      anim.switch('label--ok', authTokenVALUE);
      anim.switch('label--no', authTokenVALUE);
      page.validation(authTokenVALUE, userID, date);
      page.confirmValidation(authTokenVALUE);
    });

    // 4. Show tasks to validate
    const api2 = window.localStorage.getItem('ENV') + '/user/' + userID + '/event/' + date;
    $.ajax({
      url: api2,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        console.log(response);
        $('#validation .loader').remove();

        if(response.list.length == 0) {

          let html = '' +
          '<header class="header">' +
            '<div class="header__link header__link--icon jsNotifications">' +
              '<div id="push"></div>' +
              '<span class="icon icon-notification push"></span>' +
            '</div>' +
            '<h1 class="title">Validation</h1>' +
          '</header>' +
          '<h2 class="header-lvl2">' +
            '<div class="header-lvl2__inner"><span>semaine ' + response.week + '</span>' + response.date + '</div>' +
          '</h2>' +
          '<div class="routing__center"><span class="success">Tout a correctement été validé pour cette journée !</span></div>';
          $('#validation').append(html);

        } else {

          let html = '' +
            '<header class="header">' +
              '<div class="header__link header__link--icon jsNotifications">' +
                '<div id="push"></div>' +
                '<span class="icon icon-notification push"></span>' +
              '</div>' +
              '<h1 class="title">Validation</h1>' +
            '</header>' +

            '<h2 class="header-lvl2">' +
              '<div class="header-lvl2__inner"><span>semaine ' + response.week + '</span>' + response.date + '</div>' +
            '</h2>' +

            '<div class="routing__center">' +
            '';

          for (let i = 0; i < response.list.length; i++) {
            let noChecked = "";
            let okChecked = "";
            let stopChecked = "";
            let switchBtn = "";
            let text = "";
            let justification = "";
            let justificationContent = response.list[i].justification != null ? response.list[i].justification : "";
            let submitButton = "";
            let disabled = response.list[i].confirm == true ? 'disabled ' : '';

            if(response.list[i].validation == 0) {
              noChecked =  "checked";
              switchBtn = "no";
              text = "Non fait";
              justification = '' +
              '<div class="validation-item__justification jsJustificationNo">' +
                '<ul class="action__list">' +
                  '<li class="action__list__item textarea">' +
                  '<textarea name="justification"  class="justification small" cols="30" rows="10" placeholder="Justification">' + justificationContent + '</textarea>' +
                  '<span class="error-msg error-msg--validation"></span>' +
                  '</li>' +
                '</ul>' +
              '</div>';
              submitButton = response.list[i].confirm == true ? '' : '<button type="submit" class="validationConfrim">Valider définitivement ce choix</button>';
            }
            if(response.list[i].validation == 1) {
              okChecked =  "checked";
              switchBtn = "ok";
              text = "Fait";
            }
            if(response.list[i].validation == 2) {
              stopChecked =  "checked";
              switchBtn = "stop";
              text = "Partiellement";
              justification = '' +
              '<div class="validation-item__justification jsJustificationStop">' +
                '<ul class="action__list">' +
                  '<li class="action__list__item">' +
                    '<span>Heure de début : </span>' +
                    '<input type="time" value="' + response.list[i].partialStart + '" class="startAction">' +
                    '<span class="error-msg"></span>' +
                    '<input type="hidden" name="partial_start" value="" class="partial_start">' +
                  '</li>' +
                  '<li class="action__list__item">' +
                    '<span>Heure de fin : </span>' +
                    '<input type="time" value="' + response.list[i].partialEnd + '" class="endAction">' +
                    '<span class="error-msg"></span>' +
                    '<input type="hidden" name="partial_end" value="" class="partial_end">' +
                  '</li>' +
                '</ul>' +
                '<ul class="action__list">' +
                  '<li class="action__list__item textarea">' +
                    '<textarea name="justification"  class="justification small" cols="30" rows="10" placeholder="Justification">' + response.list[i].justification + '</textarea>' +
                    '<span class="error-msg error-msg--validation"></span>' +
                  '</li>' +
                '</ul>' +
              '</div>';
            }

            html += '' +
              '<form class="' + disabled + 'jsFormValidation validation-item border-' + switchBtn + '" data-id="' + response.list[i].id + '" data-date="' + response.dateEN + '">' +
                '<input type="hidden" name="validation" class="jsValidationVvalue" value="">' +
                '<input type="checkbox" name="confirm" value="" checked style="visibility: hidden;">' +
                '<input type="hidden" name="type" value="' + response.list[i].type + '">' +
                '<input type="hidden" name="user" value="' + response.list[i].userID + '">' +
                '<div class="validation-item__title">' + response.list[i].title + ', ' +
                  '<span>' + response.list[i].location + '</span>' +
                '</div>' +
                '<div class="validation-item__hours" data-start="' + response.list[i].startHours + '" data-end="' + response.list[i].endHours + '">' + response.list[i].startHours + ' - ' + response.list[i].endHours + '</div>' +
                '<ul class="action__list justification-next">' +
                  '<li class="action__list__item">' +
                  'Validation' +
                  '<span class="validation-item__status">' + text + '</span>' +
                  '<div class="switch">' +
                  '<input type="radio" value="0" class="no" ' + noChecked + '>' +
                  '<label for="" class="label label--no" data-status="no"></label>' +
                  '<input type="radio" value="2" class="stop" ' + stopChecked + '>' +
                  '<label for="" class="label label--stop" data-status="stop"></label>' +
                  '<input type="radio" value="1" class="ok" ' + okChecked + '>' +
                  '<label for="" class="label label--ok" data-status="ok"></label>' +
                  '<div class="switch__btn ' + switchBtn + '">' +
                  '<div class="switch__btn__bar"></div>' +
                  '<div class="switch__btn__bar"></div>' +
                  '<div class="switch__btn__bar"></div>' +
                  '</div>' +
                  '</div>' +
                  '</li>' +
                '</ul>' + justification +
                submitButton +
              '</form>';
          }
          html += '</div>'; // end of .routing__center

          $('#validation').append(html);
        }
      },
      error: function (err) {
        $('#validation .loader').remove();
        console.log(err);
      }
    });
  },

  confirmValidation: function (authTokenVALUE) {
    
    $('#validation').on('submit', '.jsFormValidation', function (e) {
      e.preventDefault();
      const form = $(this);
      const eventID = $(this).attr('data-id');
      const eventVALIDATION = $(this).find('.switch__btn');
      const dateBase = $(this).attr('data-date');
      let justification;
      let errors = false;
      let jsValidationVvalue = 0;
      console.log('confirm', eventVALIDATION);

      if(eventVALIDATION.hasClass('stop')) {
        jsValidationVvalue = 2;
        justification = $(this).find('.justification');
        let startAction = $(this).find('.startAction');
        let endAction = $(this).find('.endAction');
        let errorHours = utils.checkHours(startAction, endAction);
        
        $(this).find('.partial_start').val( dateBase + ' ' + startAction.val() + ':00' );
        $(this).find('.partial_end').val( dateBase + ' ' + endAction.val() + ':00' );
        
        errorJustification = utils.checkJustification(justification);
          if (errorHours || errorJustification) {
            errors = true;
          }
      } else if(eventVALIDATION.hasClass('no')) {
        jsValidationVvalue = 0;
        justification = $(this).find('.justification');
        errors = utils.checkJustification(justification);
      } else {
        jsValidationVvalue = 1;
      }
      $(this).find('.jsValidationVvalue').val(jsValidationVvalue);

      if(!errors) {
        const api = window.localStorage.getItem('ENV') + '/event/' + eventID + '/confirm';
        $.ajax({
          url: api,
          type: 'PATCH',
          data: $(this).serialize(),
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            console.log(response);

            form.addClass('disabled');
            form.find('button[type=submit]').remove();

            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
          },
          error: function (err) {
            console.log(err);
          }
        });
      }
    });
  },


};