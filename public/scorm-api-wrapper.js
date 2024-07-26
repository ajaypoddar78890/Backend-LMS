(function(window) {
  var SCORM = {
    API: null,

    // Initialize SCORM
    initialize: function() {
      if (this.API) {
        console.log("SCORM already initialized.");
        return true;
      }

      // Locate SCORM API
      var api = this.findAPI(window);
      if (api) {
        this.API = api;
        return api.LMSInitialize("");
      }
      
      console.error("SCORM API not found.");
      return false;
    },

    // Terminate SCORM
    terminate: function() {
      if (this.API) {
        return this.API.LMSFinish("");
      }
      console.error("SCORM API not initialized.");
      return false;
    },

    // Get value from SCORM
    getValue: function(name) {
      if (this.API) {
        return this.API.LMSGetValue(name);
      }
      console.error("SCORM API not initialized.");
      return "";
    },

    // Set value to SCORM
    setValue: function(name, value) {
      if (this.API) {
        return this.API.LMSSetValue(name, value);
      }
      console.error("SCORM API not initialized.");
      return false;
    },

    // Commit values to SCORM
    commit: function() {
      if (this.API) {
        return this.API.LMSCommit("");
      }
      console.error("SCORM API not initialized.");
      return false;
    },

    // Find SCORM API
    findAPI: function(win) {
      var api = null;
      while (win && !api) {
        if (win.API) {
          api = win.API;
        } else if (win.parent && win.parent !== win) {
          win = win.parent;
        } else {
          win = win.parent;
        }
      }
      return api;
    }
  };

  window.SCORM = SCORM;
})(window);
