(function() {
  'use strict';

  var emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+" + 
    "@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" + 
    "(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");

  // Meteor methods for simple account management stuff
  Meteor.methods({
    'fongandrew:user-settings/resendVerify': function() {
      if (! this.userId) {
        throw new Meteor.Error(401, "login-required",
          "You must be logged in to perform this action");
      }

      Accounts.sendVerificationEmail(this.userId);
      return {
        sent: 1
      };
    },

    'fongandrew:user-settings/changeEmail': function(address) {
      if (! this.userId) {
        throw new Meteor.Error(401, "login-required",
          "You must be logged in to perform this action");
      }

      check(address, String);
      if (! emailRegex.test(address)) {
        throw new Meteor.Error(400, "invalid-email");
      }

      // TODO: Push new address onto list rather than replacing wholesale
      var updated = Meteor.users.update({
        _id: this.userId,
        "emails.address": {
          $ne: address
        }
      }, {
        $set: {
          emails: [{
            address: address,
            verified: false
          }]
        }
      });

      // Send e-mail verification if change successful
      if (updated && AccountSettingsConfig.verifyAfterChange) {
        Accounts.sendVerificationEmail(this.userId);
      }

      return {updated: updated};
    }
  });


})();