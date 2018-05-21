var me = {

  init: function () {

    // CHECK IF TOKEN IS VALID ?
    let isConnected = utils.isValidToken();

    if (isConnected) {

      const authTokenID = window.localStorage.getItem('authTokenID'),
        authTokenVALUE = window.localStorage.getItem('authTokenVALUE'),
        userID = window.localStorage.getItem('userID'),
        ROLE = window.localStorage.getItem('ROLE');

      page.getSetting('coeff', authTokenVALUE);

      login.cleaLogin(authTokenVALUE, userID);

      // REMOVE ALERT
      utils.removeAlert();

      // CHECK IF THERE ARE NOTIFICATIONS
      page.refreshNotifications(authTokenVALUE, userID);

      // LOAD ACTIONS
      page.actions(ROLE);

      // FIND ACTIVE PAGE
      //utils.reloadDefaultPageOnRefresh(authTokenVALUE, userID);

      // DISCONNECT
      logout.ajaxLogout(authTokenVALUE, authTokenID);

      // ROUTING
      routing.level1('planning', authTokenVALUE, ROLE);
      routing.level1('validation', authTokenVALUE, ROLE);
      routing.level1('actions', authTokenVALUE, ROLE);
      routing.level1('profile', authTokenVALUE, ROLE);
      routing.level2(authTokenVALUE, userID, ROLE);

      // SPECIAL PAGES
      anim.fadeInPage(authTokenVALUE, userID);

      // OTHER EVENTS
      //anim.swipe('notification__list');
      anim.swipe('notification__list');
      anim.progressBar();

      // SHOW ADD FORM
      anim.showForm('jsFormAddUser', authTokenVALUE, ROLE);

      // SEARCH USER - AUTOCOMPLETE -
      utils.ajaxSearchUser('jsSearchUser');

    } else {
      // CONNECT
      login.loginPage();
      login.ajaxLogin();
    }

  },

  config: function () {
    // If ENV exist, remove it
    if(window.localStorage.getItem('ENV') !== null) {
      window.localStorage.removeItem('ENV');
    }
    window.localStorage.setItem('ENV', 'http://api.scufrh.ovh');

    // Define new ENV
    // if (window.location.href.indexOf("localhost") > -1) {
    //   window.localStorage.setItem('ENV', 'http://127.0.0.1:8000');
    // } else {
    //   window.localStorage.setItem('ENV', 'http://api.scufrh.ovh');
    // }
  },

};

$(document).ready(function () {
  me.config();
  me.init();
});