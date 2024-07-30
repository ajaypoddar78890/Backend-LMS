(function (window) {
  window.SCORM = {
    initialized: false,
    data: {},

    LMSInitialize: function (param) {
      console.log("SCORM LMSInitialize");
      this.initialized = true;
      return "true";
    },

    LMSFinish: function (param) {
      console.log("SCORM LMSFinish");
      this.initialized = false;
      return "true";
    },

    LMSGetValue: function (key) {
      console.log(`SCORM LMSGetValue: ${key}`);
      return this.data[key] || "";
    },

    LMSSetValue: function (key, value) {
      console.log(`SCORM LMSSetValue: ${key} = ${value}`);
      this.data[key] = value;
      window.parent.postMessage(
        { type: "scorm", payload: { key, value } },
        "*"
      );
      return "true";
    },

    LMSCommit: function (param) {
      console.log("SCORM LMSCommit");
      return "true";
    },

    LMSGetLastError: function () {
      console.log("SCORM LMSGetLastError");
      return "0";
    },

    LMSGetErrorString: function (errorCode) {
      console.log(`SCORM LMSGetErrorString: ${errorCode}`);
      return "No error";
    },

    LMSGetDiagnostic: function (errorCode) {
      console.log(`SCORM LMSGetDiagnostic: ${errorCode}`);
      return "No diagnostic information available";
    },
  };
})(window);
