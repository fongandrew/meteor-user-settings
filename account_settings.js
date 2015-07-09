(function() {
  'use strict';

  var emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+" + 
    "@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" + 
    "(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

  Template.accountSettings.helpers({
    addContext: function() {
      var user = Meteor.user();
      var email;
      if (user && user.emails && user.emails[0] && user.emails[0].address) {
        email = user.emails[0].address;
      }

      return _.extend({
        email: email,
        verified: email && user.emails[0].verified,
      }, this);
    }
  });


  // Set up basic state-tracking vars for each template ////////

  var settingsSetup = function(template) {
    template.onCreated(function() {
      this.createVars({
        saving: false,
        saved: false,
        error: false
      });
    });

    template.helpers({
      addContext: function() {
        return _.extend(Template.instance().getVars(), this);
      }
    });
  };

  settingsSetup(Template._changeEmail);
  settingsSetup(Template._verifyEmail);
  settingsSetup(Template._changePassword);
  settingsSetup(Template._resetPassword);


  // Events ////////////

  Template._changeEmail.events({
    'submit .change-email': function(e, template) {
      e.preventDefault();
      template.resetVars();

      var emailElm = $(e.target).find('[name=email]');
      var email = emailElm.val();

      if (! email) {
        template.setVar('error', 'blank');
        return;
      }

      if (! emailRegex.test(email)) {
        template.setVar('error', 'invalid');
        return;
      }

      template.setVar('saving', true);
      Meteor.call('fongandrew:user-settings/changeEmail', email, function(err) {
        template.setVar('saving', false);
        if (err) {
          if (err.reason === 'duplicate-email') {
            template.setVar('error', 'duplicate');
          } else {
            console.error(err);
            template.setVar('error', 'unknown');
          }
        } else {
          template.setVar('saved', true);
        }
      });
    },

    'keydown #email': function(e, template) {
      if (e.keyCode !== 13) {
        template.setVar('saving', false);
      }
    }
  });

  Template._verifyEmail.events({
    'submit .js-verify-email': function(e, template) {
      e.preventDefault();
      template.resetVars();
      template.setVar('saving', true);
      Meteor.call('fongandrew:user-settings/resendVerify', function(err) {
        template.setVar('saving', false);
        if (err) {
          template.setVar('error', 'unknown');
        } else {
          template.set('saved', true);
        }
      });
    }
  });

  Template._changePassword.events({
    'submit .change-password': function(e, template) {
      e.preventDefault();
      template.resetVars();

      var oldPassElm = $(e.target).find('[name=password]');
      var oldPass = oldPassElm.val();
      var newPassElm = $(e.target).find('[name=newPassword]');
      var newPass = newPassElm.val();

      if (! oldPass) {
        template.setVar('error', 'old-blank');
      }
      if (! newPass) {
        template.setVar('error', 'new-blank');
      }
      if (!newPass || !oldPass) return;

      template.setVar('saving', true);
      Accounts.changePassword(oldPass, newPass, function(err) {
        template.setVar('saving', false);
        if (err) {
          if (err.error === 403) {
            template.setVar('error', 'wrong-password');
          } else {
            template.setVar('error', 'unknown');
            console.error(err);
          }
        } else {
          template.setVar('saved', true);
          oldPassElm.val("");
          newPassElm.val("");
        }
      });
    },

    'keydown [type=password]': function(e, template) {
      if (e.keyCode !== 13) {
        template.setVar('saving', false);
      }
    }
  });

  Template._resetPassword.events({
    'submit .reset-password': function(e, template) {
      e.preventDefault();
      template.resetVars();

      var user = Meteor.user();
      var email;
      if (user.emails && user.emails[0]) {
        email = user.emails[0].address;
      } else {
        return;
      }

      template.setVar('saving', true);
      Accounts.forgotPassword({
        email: email
      }, function(err) {
        template.setVar('saving', false);
        if (err) {
          template.setVar('error', 'unknwon');
        } 
        else {
          template.setVar('saved', true);
        }
      });
    }
  });

})();