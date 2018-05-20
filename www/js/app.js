var me = {

  init: function () {

    // CHECK IF TOKEN IS VALID ?
    let isConnected = utils.isValidToken();

    if (isConnected) {

      const authTokenID = localStorage.getItem('authTokenID'),
        authTokenVALUE = localStorage.getItem('authTokenVALUE'),
        userID = localStorage.getItem('userID'),
        ROLE = localStorage.getItem('ROLE');

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
      routing.level1('planning', authTokenVALUE);
      routing.level1('validation', authTokenVALUE);
      routing.level1('actions', authTokenVALUE);
      routing.level1('profile', authTokenVALUE);
      routing.level2(authTokenVALUE, userID, ROLE);

      // SPECIAL PAGES
      anim.fadeInPage('jsNotifications', authTokenVALUE, userID);
      anim.fadeInPage('jsSearch', authTokenVALUE, userID);

      // OTHER EVENTS
      //anim.swipe('notification__list');
      anim.swipeDesktop('notification__list');
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
    if(localStorage.getItem('ENV') !== null) {
      localStorage.removeItem('ENV');
    }
    // Define new ENV
    if (window.location.href.indexOf("localhost") > -1) {
      localStorage.setItem('ENV', 'http://127.0.0.1:8000');
    } else {
      localStorage.setItem('ENV', 'http://api.scufrh.ovh');
    }
  },

};

$(document).ready(function () {
  me.config();
  me.init();
});