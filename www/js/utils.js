var utils = {

  removeAlert: function() {
    $('.msg-flash').click(function() {
      $('.msg-flash .alert').remove();
    });
  },

  removeHTML: function (element) {
    $('.msg-flash .alert').remove();

    switch (element) {
      case "level2Access":
        $('.access-list li').remove();
        break;
      case "level2Setting":
        $('.setting-list li').remove();
        break;
      case "level2User":
        $('.action__list__item.list div').remove();
        $('.user-list tbody form').remove();
        break;
      case "level2Leave":
        $('.leave-list tbody form').remove();
        break;
      case "level2Rest":
        $('.rest-list tbody form').remove();
        break;
      case "level2Hours":
        $('#jsEmployeesList option').remove();
        $('.hours-list tbody form').remove();
        break;
      case "notifications":
        $('.notification__list li').remove();
        break;
      case "level2Section":
        $('.section-list li').remove();
        break;
      case "level2Week":
        $('.week-list tbody form').remove();
        break;
      case "validation":
        $('#validation .header').remove();
        $('#validation .header-lvl2').remove();
        $('#validation .routing__center').remove();
        break;
    }
  },

  removeEventHandlers: function (element) {
    switch (element) {
      case "level2Access":
        $('.jsFormAddAccess').off('submit');
        $('.access-list').off('click', '.delete');
        $('.access-list').off('click', 'li .editEnabled');
        $('.access-list').off('click', 'li .editCanceled');
        $('.access-list').off('click', 'li .edit');
        break;
      case "level2Setting":
        $('.setting-list').off('click', '.delete');
        $('.setting-list').off('click', 'li .editEnabled');
        $('.setting-list').off('click', 'li .editCanceled');
        $('.setting-list').off('click', 'li .edit');
        break;
      case "level2User":
        $('.jsFormAddUser').off('submit');
        $('.user-list').off('click', '.delete');
        $('.user-list').off('click', 'form .editEnabled');
        $('.user-list').off('click', 'form .editCanceled');
        $('.user-list').off('click', 'form .edit');
        break;
      case "level2Leave":
        $('.form-add-leave').off('submit');
        $('.leave-list').off('click', '.delete');
        break;
      case "level2Rest":
        $('.form-add-rest').off('submit');
        $('.rest-list').off('click', '.delete');
        break;
      case "level2Hours":
        $('.form-add-hours').off('submit');
        $('.hours-list').off('click', '.delete');
        break;
      case "level2Section":
        $('.jsFormAddSection').off('submit');
        $('.section-list').off('click', '.delete');
        $('.section-list').off('click', 'li .editEnabled');
        $('.section-list').off('click', 'li .editCanceled');
        $('.section-list').off('click', 'li .edit');
        break;
      case "level2Week":
        $('.jsFormAddWeek').off('submit');
        $('.week-list').off('click', '.delete');
        $('.week-list').off('click', 'form .editEnabled');
        $('.week-list').off('click', 'form .editCanceled');
        $('.week-list').off('click', 'form .edit');
        break;
      case "calendar":
        $('.generic-planning').off('click', '.jsCloseModalCalendar');
        $('.generic-planning').off('click', '.jsConfirmAddEvent');
        $('.generic-planning').off('click', '.jsConfirmEditEvent');
        $('.generic-planning').off('click', '.jsConfirmDeleteEvent');
        $('.calendar-navigation-prev').off('click');
        $('.calendar-navigation-next').off('click');
        $('.calendar-view__button--week').off('click');
        $('.calendar-view__button--day').off('click');
        break;
      case "calendar-edit":
        $('.generic-planning').off('click', '.jsCloseModalCalendar');
        $('.generic-planning').off('click', '.jsConfirmAddEvent');
        $('.generic-planning').off('click', '.jsConfirmEditEvent');
        $('.generic-planning').off('click', '.jsConfirmDeleteEvent');
        $('.calendar-navigation-prev').off('click');
        $('.calendar-navigation-next').off('click');
        break;
      case "validation":
        $('#validation').off('submit', '.jsFormValidation');
        $('#jsListDaysInProgress').off('change');
        $('#validation').off('click', '.stop');
        $('#validation').off('click', '.ok');
        $('#validation').off('click', '.no');
        $('#validation').off('click', '.label--stop');
        $('#validation').off('click', '.label--ok');
        $('#validation').off('click', '.label--no');
        break;
    }
  },

  emptyForm: function (type) {
    switch (type) {
      case "access":
        $('.jsFormAddAccess input:text').val('');
        break;
      case "user":
        $('.jsFormAddUser input:text').val('');
        $('.jsFormAddUser input:password').val('');
        $('.jsFormAddUser select').prop('selectedIndex', 0);
        $('.jsFormAddUser input:checkbox').removeAttr('checked');
        break;
      case "leave":
        $('.form-add-leave input:text').val('');
        $('.form-add-leave textarea').val('');
        break;
      case "rest":
        $('.form-add-rest input:text').val('');
        $('.form-add-rest textarea').val('');
        break;
      case "hours":
        $('.form-add-hours input:text').val('');
        $('.form-add-hours textarea').val('');
        break;
      case "section":
        $('.jsFormAddSection input:text').val('');
        break;
      case "week":
        $('.jsFormAddWeek input:number').val($('.jsFormAddWeek input:number').val() + 1);
        break;
    }
  },

  reloadDefaultPageOnRefresh: function (authTokenVALUE, userID) {
    /**
     * -------------------------
     * Calendar is default page
     * -------------------------
     * /!\ Calendar need to be laod in first to get all events and show them on validation page /!\
     * -------------------------
     * If you want to change it:
     * 1. Go to index.html
     * 2. Change the .current on .tab-bar__item of your choice
     * 3. Change the .show on .routing of your choice
     * 4. Add load function in correct case below
     */
    var activePage = $('.tab-bar').find('.current').attr('data-routing');
    switch (activePage) {
      case "notification":

        break;
      case "planning":
        calendar.init(authTokenVALUE, userID, 'calendar');
        $('#calendar').fullCalendar('refetchEvents');
        $('#calendar').fullCalendar('refetchEventSources');
        break;
      case "validation":

        break;
      case "actions":

        break;
      case "profile":
        page.getSetting('coeff', authTokenVALUE);
        page.profile(authTokenVALUE, userID);
        page.refreshProfile(authTokenVALUE, userID);
        break;
    }
  },

  isValidToken: function () {
    console.log('Check if token is valid....');

    var authTokenCREATED = localStorage.getItem('authTokenCREATED'),
      isConnected = false;

    if (authTokenCREATED !== null) {
      var date = Math.trunc(Date.now() / 1000),
        tokenValidityDuration = localStorage.getItem('tokenValidityDuration');

      if (date - authTokenCREATED < tokenValidityDuration) {
        console.log('....token OK :-)');
        isConnected = true;
      } else {
        console.log('....token expired, please login again :-)');
        localStorage.removeItem('authTokenID');
        localStorage.removeItem('authTokenVALUE');
        localStorage.removeItem('userID');
        localStorage.removeItem('authTokenCREATED');
        localStorage.removeItem('tokenValidityDuration');
        login.loginPage();
      }
    }
    return isConnected;
  },

  ajaxGet: function (element, type, authTokenVALUE) {
    var api = localStorage.getItem('ENV') + "/" + element;
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        //console.log(response);
        if (type == 'checked') {
          //*****************
          console.log(response);
          utils.parseCheckAccess(response);
          //****************
        } else {
          for (var j = 0; j < response.length; j++) {
            $('.action__list__item.list').append(
              '<div>' +
              '<input type="checkbox" name="access[]" value="' + response[j].id + '" id="' + response[j].slug + '"><label for="' + response[j].slug + '">' + response[j].title + '</label>' +
              '</div>'
            );
          }
        }
      },
      error: function (response) {
        console.log(response);
      }
    });
  },

  parseCheckAccess: function (response) {
    console.log(response);
    var allListAccess = '';
    for (var i = 0; i < response.length; i++) {
      allListAccess += '' +
        '<div>' +
        '<input type="checkbox" name="access[]" value="' + response[i].id + '" id="' + response[i].slug + '"><label for="' + response[i].slug + '">' + response[i].title + '</label>' +
        '</div>';
    }
    console.log(allListAccess);
  },
  /**
   * SEARCH
   */
  ajaxSearchUser: function (element) {

    $('#searchForm').on('submit', function (e) {
      e.preventDefault();
    });

    $('#' + element).instantSearch({
      minQueryLength: 3,
      noItemsFoundMessage: 'Aucun utilisateur trouvé',
      previewDelay: 200
    });
    //lowercase, asciifolding

  },
  /**
   * CHECK DATES & HOURS
   */
  checkDate: function (startDate, endDate = "") {
    var error = false;
    var regex = new RegExp('[0-9]{2}-[0-9]{2}-[0-9]{4}');

    if (!regex.test(startDate.val())) {
      error = true;
      startDate.next().text('Format incorrect.');
    } else {
      startDate.next().text('');
    }

    if (endDate != "") {
      if (!regex.test(endDate.val())) {
        error = true;
        endDate.next().text('Format incorrect.');
      } else {
        endDate.next().text('');
      }
    }
    return error;
  },

  checkHours: function (startHour, endHour) {
    var error = false;
    var regex = new RegExp('[0-9]{2}:[0-9]{2}');

    if (!regex.test(startHour.val()) || !regex.test(endHour.val())) {
      error = true;
    }

    if (!regex.test(startHour.val())) {
      error = true;
      startHour.next().text('Format incorrect.');
    } else {
      startHour.next().text('');
    }

    if (!regex.test(endHour.val())) {
      error = true;
      endHour.next().text('Format incorrect.');
    } else {
      endHour.next().text('');
    }

    if (startHour.val() > endHour.val() ) {
      error = true;
      startHour.next().text('L\'heure de début doit être antérieure à l\'heure de fin.');
    } else {
      startHour.next().text('');
    }

    return error;
  },

  checkText: function (tab) {
    let error = [];

    for (let i = 0; i < tab.length; i++) {
      if (tab[i].val() == '') {
        error[i] = true;
        tab[i].next().text('Ce champs est obligatoire');
      } else {
        tab[i].next().text('');
        error[i] = false;
      }
    }
    return error;
  },

  checkJustification: function (justification) {
    var error = false;

    if (justification.val() == '') {
      error = true;
      justification.next().text('La justification est obligatoire');
    } else {
      justification.next().text('');
    }
    return error;
  },

  checkFullDate: function (start, end) {
    var error = false;
    var regex = new RegExp('[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}');

    if (!regex.test(start.val()) || !regex.test(end.val())) {
      error = true;
    }

    if (!regex.test(start.val())) {
      start.next().text('Format incorrect.');
    } else {
      start.next().text('');
    }

    if (!regex.test(end.val())) {
      end.next().text('Format incorrect.');
    } else {
      end.next().text('');
    }
    return error;
  },
  /**
   * GET USERS
   */
  ajaxGetUsers: function (authTokenVALUE) {
    $.ajax({
      url: localStorage.getItem('ENV') + '/users',
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        $('.jsUsersList option').remove();
        for (var i = 0; i < response.length; i++) {
          $('.jsUsersList').append('<option value="' + response[i].id + '">' + response[i].firstname + ' ' + response[i].lastname + '</option>');
        }
        let selectUserID = $('.jsUsersList').val();
        crud.ajaxSimpleList(localStorage.getItem('ENV') + '/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
      },
      error: function (err) {
        console.log(err);
      }
    })
  },

  /**
   * GET WEEKS TYPE
   */
  ajaxGetWeeksType: function (authTokenVALUE) {
    // TODO: Add loader here and remove it on ajaxSimplePage just before re append it for list loading
    $.ajax({
      url: localStorage.getItem('ENV') + '/setting/week',
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        $('.jsWeeksTypeList option').remove();
        for (var i = 0; i < response.length; i++) {
          $('.jsWeeksTypeList').append('<option value="' + response[i].id + '">' + response[i].title + ' (' + response[i].value + 'h)</option>');
        }
      },
      error: function (err) {
        console.log(err);
      }
    })
  },

  /**
   * GET WEEKS BY USER
   */
  loadWeeksOnChange: function (authTokenVALUE) {
    $('.jsUsersList').on('change', function () {
      utils.removeHTML('level2Week');
      const selected = $(this).find('option:selected').val();
      $('.jsUsersList option[value="' + selected + '"]').prop('selected', true);
      selectUserID = $(this).val();
      crud.ajaxSimpleList(localStorage.getItem('ENV') + '/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
      console.log("Change for user " + selectUserID);
    });
  },
};