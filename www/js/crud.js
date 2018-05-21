var crud = {
  /**
   * ADD AN ELEMENT
   */
  ajaxAdd: function (element, type, authTokenVALUE, ROLE = null) {
    $('.' + element).on('submit', function (e) {
      e.preventDefault();
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      $('form.' + element + ' button').prop("disabled", true);
      var api = window.localStorage.getItem('ENV') + "/" + type + "/create";
      $.ajax({
        url: api,
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          switch (type) {
            case 'access':
              if (response.type == 'success') {
                utils.removeHTML("level2Access");
                $('form.' + element + ' button').prop("disabled", true);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/access', $('.access-list'), 'access', authTokenVALUE);
                utils.emptyForm('access');
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
            case 'user':
              utils.removeHTML("level2User");
              $('form.' + element + ' button').prop("disabled", true);
              $('.msg-flash .alert').remove();
              $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
              crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/users', $('.user-list tbody'), 'user', authTokenVALUE, ROLE);
              utils.emptyForm('user');
              // Close form
              $('#jsCloseFormAddUser').removeClass('show');
              $('#jsFormAddUser').removeClass('hide');
              $('.jsFormAddUser').slideUp();
              $('.action__list__item.list div').detach();
              break;
            case 'section':
              utils.removeHTML("level2Section");
              $('.msg-flash .alert').remove();
              $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
              crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/sections', $('.section-list'), 'section', authTokenVALUE);
              utils.emptyForm('section');
              break;
          }
        },
        error: function (response) {
          console.log(response);
          $('#actions .loader').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'ajout</div>');
        }
      })
    });
  },

  /**
   * SHOW SIMPLE LIST
   */
  ajaxSimpleList: function (api, element, type, authTokenVALUE, ROLE = null) {
    $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
    $.ajax({
      url: api,
      type: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
      },
      success: function (response) {
        $('#actions .loader').remove();
        switch (type) {
          case "leave":
            if (response.success) {
              $('#leave .no-result').text('');
              var status = 'En attente';
              var css = 'progress';
              var action = '';
              for (var i = 0; i < response.list.length; i++) {
                switch (response.list[i].status) {
                  case 0:
                    status = 'Refusé';
                    css = 'refused';
                    break;
                  case 1:
                    status = 'Accepté';
                    css = 'accepted';
                    break;
                  case 2:
                    status = 'En attente';
                    css = 'progress';
                    break;
                  default:
                    status = 'En attente';
                    css = 'progress';
                }
                if (response.list[i].status == 2) {
                  action = '' +
                    // '<span class="link-table editEnabled">Modifier</span>' +
                    // '<span class="link-table edit" id="editLeave' + response.list[i].id + '">Valider</span>' +
                    // '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteLeave' + response.list[i].id + '">Supprimer</span>';
                } else {
                  action = 'La demande n\'est plus modifiable';
                }
                $(element).append(
                  '<form action="" id="formLeave' + response.list[i].id + '" class="tr">' +
                  '<div class="td td--created">Le ' + response.list[i].created + '</div>' +
                  '<div class="td td--updated">' + response.list[i].updated + '</div>' +
                  '<div class="td"><input type="text" name="start" value="' + response.list[i].startDate + '" disabled></div>' +
                  '<div class="td"><input type="text" name="end" value="' + response.list[i].endDate + '" disabled></div>' +
                  '<div class="td td--justification"><teaxtarea name="justification" disabled>' + response.list[i].justification + '</textarea></div>' +
                  '<div class="td td--status"><span class="' + css + '">' + status + '</span></div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('#leave .no-result').text('');
              $('.leave-list').next().append(response.message);
            }
            break;
          case "rest":
            if (response.success) {
              $('#rest .no-result').text('');
              var status = 'En attente';
              var css = 'progress';
              var action = '';
              for (var i = 0; i < response.list.length; i++) {
                switch (response.list[i].status) {
                  case 0:
                    status = 'Refusé';
                    css = 'refused';
                    break;
                  case 1:
                    status = 'Accepté';
                    css = 'accepted';
                    break;
                  case 2:
                    status = 'En attente';
                    css = 'progress';
                    break;
                  default:
                    status = 'En attente';
                    css = 'progress';
                }
                if (response.list[i].status == 2) {
                  action = '' +
                    // '<span class="link-table editEnabled">Modifier</span>' +
                    // '<span class="link-table edit" id="editRest' + response.list[i].id + '">Valider</span>' +
                    // '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteRest' + response.list[i].id + '">Supprimer</span>';
                } else {
                  action = 'La demande n\'est plus modifiable';
                }
                $(element).append(
                  '<form action="" id="formRest' + response.list[i].id + '" class="tr">' +
                  '<div class="td td--created">Le ' + response.list[i].created + '</div>' +
                  '<div class="td td--updated">' + response.list[i].updated + '</div>' +
                  '<div class="td">' + response.list[i].startDate + '</div>' +
                  '<div class="td"><input type="text" name="start" value="' + response.list[i].startHours + '" disabled></div>' +
                  '<div class="td"><input type="text" name="end" value="' + response.list[i].endHours + '" disabled></div>' +
                  '<div class="td td--justification"><teaxtarea name="justification" disabled>' + response.list[i].justification + '</textarea></div>' +
                  '<div class="td td--status"><span class="' + css + '">' + status + '</span></div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('#rest .no-result').text('');
              $('.rest-list').next().append(response.message);
            }
            break;
          case "hours":
            console.log(response);
            if (response.success) {
              $('#hours .no-result').text('');
              var status = 'En attente';
              var css = 'progress';
              var action = '';
              for (var i = 0; i < response.list.length; i++) {
                switch (response.list[i].status) {
                  case 0:
                    status = 'Refusé';
                    css = 'refused';
                    break;
                  case 1:
                    status = 'Accepté';
                    css = 'accepted';
                    break;
                  case 2:
                    status = 'En attente';
                    css = 'progress';
                    break;
                  default:
                    status = 'En attente';
                    css = 'progress';
                }
                if (response.list[i].status == 2) {
                  action = '' +
                    // '<span class="link-table editEnabled">Modifier</span>' +
                    // '<span class="link-table edit" id="editHours' + response.list[i].id + '">Valider</span>' +
                    // '<span class="link-table editCanceled">Annuler</span>' +
                    '<span class="link-table delete" id="deleteHours' + response.list[i].id + '">Supprimer</span>';
                } else {
                  action = 'La demande n\'est plus modifiable';
                }
                $(element).append(
                  '<form action="" id="formHours' + response.list[i].id + '" class="tr">' +
                  '<div class="td td--created">Le ' + response.list[i].created + '</div>' +
                  '<div class="td td--updated">' + response.list[i].updated + '</div>' +
                  '<div class="td">' + response.list[i].startDate + '</div>' +
                  '<div class="td"><input type="text" name="start" value="' + response.list[i].startHours + '" disabled></div>' +
                  '<div class="td"><input type="text" name="end" value="' + response.list[i].endHours + '" disabled></div>' +
                  '<div class="td">' + response.list[i].recipientFirstName + ' ' + response.list[i].recipientLastName + '</div>' +
                  '<div class="td td--status"><span class="' + css + '">' + status + '</span></div>' +
                  '<div class="td">' + action + '</div>' +
                  '</form>'
                );
              }
            } else {
              $('#hours .no-result').text('');
              $('.hours-list').next().append(response.message);
            }
            break;
        }
      },
      error: function (response) {
        $('#actions .loader').remove();
        $('.msg-flash .alert').remove();
        var error = response.responseJSON.code !== "" ? response.responseJSON.code + " : " + response.responseJSON.message : response.message;
        $('.msg-flash').append('<div class="alert alert--error" role="alert">' + error + '</div>');
      }
    })
  },
  /**
   * EDIT AN ELEMENT
   */
  ajaxEdit: function (click, element, type, authTokenVALUE) {
    $(click).on('click', 'li .editEnabled', function () {
      $(this).parents('li').find('input').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('li').find('.editCanceled').addClass('show');
      $(this).parents('li').find('.edit').addClass('show');
    });
    $(click).on('click', 'li .editCanceled', function () {
      $(this).parents('li').find('input').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('li').find('.edit').removeClass('show');
      $(this).parents('li').find('.editEnabled').removeClass('hide');
    });
    $(click).on('click', 'li .edit', function () {
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = window.localStorage.getItem('ENV') + "/" + type + "/update/" + id;
      var value = '';
      var data = {};
      if (type == 'access') {
        value = $(this).parents('li').find('input').val();
        data = { title: value };
        console.log(value);
      } else if (type == 'setting') {
        value = $(this).parents('li').find('input').val();
        data = { value: value };
      } else {
        value = $(this).parents('li').find('input').val();
        data = { name: value };
      }
      $.ajax({
        url: api,
        type: 'PATCH',
        data: data,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          switch (type) {
            case "access":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.id).parents('li').html(
                  '<input type="text" name="title" value="' + response.title + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editAccess' + response.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteAccess' + response.id + '">Supprimer</span>'
                );
              } else {
                console.log(response);
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
              }
              break;
            case "setting":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.id).parents('li').html(
                  '<span>' + response.title + '</span> : <input type="text" name="value" value="' + response.value + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editSetting' + response.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteSetting' + response.id + '">Supprimer</span>'
                );
              }
              break;
            case "section":
              if (response.type == 'success') {
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                $(element + '' + response.section.id).parents('li').html(
                  '<input type="text" name="value" value="' + response.section.name + '" disabled>' +
                  '<span class="link editEnabled">Editer</span>' +
                  '<span class="link edit" id="editSection' + response.section.id + '">Valider</span>' +
                  '<span class="link editCanceled">Annuler</span>' +
                  '<span class="link delete" id="deleteSection' + response.section.id + '">Supprimer</span>'
                );
              }
              break;
          }
        },
        error: function (response) {
          console.log(response);
          $('#actions .loader').remove();
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },
  /**
   * EDIT USER & WEEK (SPECIFIC)
   */
  ajaxEditForm: function (element, type, authTokenVALUE, ROLE = null) {
    $(element).on('click', 'form .editEnabled', function () {
      if(ROLE == "4" || ROLE == "42") {
        $(this).parents('form').find('input').prop('disabled', false);
      } else {
        $(this).parents('form').find('input').not('.editSuperior').prop('disabled', false);
      }
      if(type != 'user' || ROLE == "4" || ROLE == "42") $(this).parents('form').find('select').prop('disabled', false);
      $(this).addClass('hide');
      $(this).parents('form').find('.editCanceled').addClass('show');
      $(this).parents('form').find('.edit').addClass('show');
      $(this).parent().find('.delete').addClass('hide');
    });
    $(element).on('click', 'form .editCanceled', function () {
      $(this).parents('form').find('input').prop('disabled', true);
      if(type != 'user' || ROLE == "4" || ROLE == "42") $(this).parents('form').find('select').prop('disabled', true);
      $(this).removeClass('show');
      $(this).parents('form').find('.edit').removeClass('show');
      $(this).parents('form').find('.editEnabled').removeClass('hide');
      $(this).parent().find('.delete').removeClass('hide');
      if(type == 'user') {
        utils.removeHTML("level2User");
        crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/users', $('.user-list tbody'), 'user', authTokenVALUE, ROLE);
      } else {
        utils.removeHTML("level2Week");
        crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
      }
    });
    $(element).on('click', 'form .edit', function () {
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      var idStr = $(this).attr('id');
      var reg = /([0-9]+)/.exec(idStr);
      var id = RegExp.$1;
      var api = window.localStorage.getItem('ENV') + "/" + type + "/update/" + id;
      form = $(this).parents('form');
      console.log(form);
      $.ajax({
        url: api,
        type: 'PATCH',
        data: form.serialize(),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          if (response.type == 'success') {
            switch(type) {
              case "user":
                utils.removeHTML("level2User");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/users', $('.user-list tbody'), 'user', authTokenVALUE, ROLE);
                break;
              case "week":
                utils.removeHTML("level2Week");
                $('.msg-flash .alert').remove();
                $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                const selectUserID = $('.jsUsersList').val();
                crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
                break;
            }
          } else {
            console.log(response);
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');
          }
        },
        error: function (response) {
          console.log(response);
          $('#actions .loader').remove();
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de l\'édition</div>');
        }
      })
    });
  },
  /**
   * REMOVE AN ELEMENT
   */
  ajaxRemove: function (click, element, type, authTokenVALUE, actionType = "") {
    $(click).on('click', '.delete', function () {
      if (confirm("Cette action sera irréversible.")) {
        $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
        var idStr = $(this).attr('id');
        var reg = /([0-9]+)/.exec(idStr);
        var id = RegExp.$1;
        var api = window.localStorage.getItem('ENV') + "/" + type + "/delete/" + id;
        $.ajax({
          url: api,
          type: 'DELETE',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('#actions .loader').remove();
            if (actionType != "") {
              switch (actionType) {
                case "leave":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formLeave' + response.id).remove();
                  break;
                case "rest":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formRest' + response.id).remove();
                  break;
                case "hours":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formHours' + response.id).remove();
                  break;
              }
            } else {
              switch (type) {
                case "access":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parent().remove();
                  }
                  break;
                case "setting":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parent().remove();
                  }
                  break;
                case "user":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parents('#formUser' + response.id).remove();
                  }
                  break;
                case "action":
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  $(element + '' + response.id).parents('#formLeave' + response.id).remove();
                  break;
                case "section":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parent().remove();
                  }
                  break;
                case "week":
                  if (response.type == 'success') {
                    $('.msg-flash .alert').remove();
                    $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                    $(element + '' + response.id).parents('#formWeek' + response.id).remove();
                  }
                  break;
              }
            }
          },
          error: function (response) {
            console.log(response);
            $('#actions .loader').remove();
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">Erreur lors de la suppression</div>');
          }
        })
      }
    });
  },
  /**
   * ADD AN ACTION
   */
  ajaxAddAction: function (type, authTokenVALUE, userID) {
    $('.form-add-' + type).on('submit', function (e) {
      e.preventDefault();

      let error = false;
      let start = "";
      let end = "";
      let errorJustification = false;
      let justification = $(this).find('.justification');
      let location = $(this).find('.location');
      let hours = false;
      let errorText = false;

      if (type == 'hours') {
        hours = true;
        let tab = [justification, location];
        let errortab = utils.checkText(tab);
        errorText = errortab.includes(true) ? true : false;
      }
      if (type == 'rest' || type == 'hours') {
        let actionDay = $(this).find('.actionDay');
        let errorDay = utils.checkDate(actionDay);
        let startAction = $(this).find('.startAction');
        let endAction = $(this).find('.endAction');
        let errorHours = utils.checkHours(startAction, endAction);

        start = $(this).find('.start').val(actionDay.val() + ' ' + startAction.val());
        end = $(this).find('.end').val(actionDay.val() + ' ' + endAction.val());

        if (!hours) {
          // 'Rest' case
          errorJustification = utils.checkJustification(justification);
          if (errorDay || errorHours || errorJustification) {
            error = true;
          }
        } else {
          // 'Hours' case
          if (errorDay || errorHours || errorText) {
            error = true;
          }
        }
      } else {
        // 'Leave' case
        let startAction = $(this).find('.startAction');
        let endAction = $(this).find('.endAction');
        let errorDates = utils.checkDate(startAction, endAction);
        errorJustification = utils.checkJustification(justification);

        start = $(this).find('.start').val(startAction.val() + ' 08:00');
        end = $(this).find('.end').val(endAction.val() + ' 18:00');

        if (errorJustification || errorDates) {
          error = true;
        }
      }

      if (!error) {
        $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
        const api = window.localStorage.getItem('ENV') + "/action/create/" + type + "/" + userID;
        $.ajax({
          url: api,
          type: 'POST',
          data: $(this).serialize(),
          beforeSend: function (xhr) {
            xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
          },
          success: function (response) {
            $('#actions .loader').remove();
            if(response.type == 'success') {
              switch (type) {
                case "leave":
                  utils.removeHTML("level2Leave");
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/actions/leave/' + userID, $('.leave-list tbody'), 'leave', authTokenVALUE);
                  utils.emptyForm('leave');
                  break;
                case "rest":
                  utils.removeHTML("level2Rest");
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/actions/rest/' + userID, $('.rest-list tbody'), 'rest', authTokenVALUE);
                  utils.emptyForm('rest');
                  break;
                case "hours":
                  utils.removeHTML("level2Hours");
                  $('.msg-flash .alert').remove();
                  $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
                  crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/actions/hours/' + userID, $('.hours-list tbody'), 'hours', authTokenVALUE);
                  utils.emptyForm('hours');
                  break;
              }
            } else {
              $('.msg-flash .alert').remove();
              $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.message + '</div>');  
            }
          },
          error: function (response) {
            console.log(response);
            $('#actions .loader').remove();
            $('.msg-flash .alert').remove();
            $('.msg-flash').append('<div class="alert alert--error" role="alert">' + response.responseJSON.message + '</div>');
          }
        })
      }
    });
  },
  /**
   * ADD A WEEK
   */
  ajaxAddWeek: function (authTokenVALUE) {
    $('.jsFormAddWeek').on('submit', function (e) {
      e.preventDefault();
      $('#actions').append('<div class="loader"><div class="loader__gif"></div></div>');
      const api = window.localStorage.getItem('ENV') + "/week/create";
      $.ajax({
        url: api,
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function (xhr) {
          xhr.setRequestHeader('X-Auth-Token', authTokenVALUE);
        },
        success: function (response) {
          $('#actions .loader').remove();
          console.log(response);
          utils.removeHTML("level2Week");
          $('.msg-flash .alert').remove();
          $('.msg-flash').append('<div class="alert alert--success" role="alert">' + response.message + '</div>');
          const selectUserID = $('.jsUsersList').val();
          crud.ajaxSimpleList(window.localStorage.getItem('ENV') + '/weeks/' + selectUserID, $('.week-list tbody'), 'week', authTokenVALUE);
          utils.emptyForm('hours');
        },
        error: function (err) {
          console.log(err);
          $('#actions .loader').remove();
        }
      })
    });
  }
};