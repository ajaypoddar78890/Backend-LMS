(function (window) {
  window.SCORM = {
    initialize: function () {
      console.log("SCORM initialized");
      return true;
    },
    terminate: function () {
      console.log("SCORM terminated");
      return true;
    },
    getValue: function (key) {
      console.log(`SCORM getValue: ${key}`);
      return "some value";
    },
    setValue: function (key, value) {
      console.log(`SCORM setValue: ${key} = ${value}`);
      window.parent.postMessage(
        { type: "scorm", payload: { key, value } },
        "*"
      );
      return true;
    },
    commit: function () {
      console.log("SCORM commit");
      return true;
    },
  };
})(window);

// document.addEventListener("DOMContentLoaded", () => {
//   if (window.SCORM) {
//     const scormInitialized = window.SCORM.initialize();
//     if (scormInitialized) {
//       console.log("SCORM initialized successfully");
//       window.SCORM.setValue("cmi.core.lesson_status", "incomplete");
//       window.SCORM.commit();
//       const lessonStatus = window.SCORM.getValue("cmi.core.lesson_status");
//       console.log("Lesson Status:", lessonStatus);
//     } else {
//       alert("Unable to acquire the LMS API. Content may not play correctly.");
//     }
//   } else {
//     alert("SCORM API not found. Content may not play correctly.");
//   }

//   // Add event listeners for user interactions
//   document.getElementById("startButton").addEventListener("click", (event) => {
//     trackUserInteraction("click", {
//       element: event.target.tagName,
//       id: event.target.id,
//       class: event.target.className,
//     });
//   });

//   const video = document.getElementById("courseVideo");
//   video.addEventListener("play", () => {
//     trackUserInteraction("videoPlay", { id: video.id });
//   });
//   video.addEventListener("pause", () => {
//     trackUserInteraction("videoPause", { id: video.id });
//   });
//   video.addEventListener("ended", () => {
//     trackUserInteraction("videoEnded", { id: video.id });
//   });
// });

// function trackUserInteraction(eventType, eventData) {
//   const scormData = {
//     userId: "user-id-here",
//     courseId: "course-id-here",
//     eventType: eventType,
//     eventData: {
//       ...eventData,
//       timestamp: new Date().toISOString(),
//     },
//   };

//   fetch("http://localhost:5500/scorm-api/save-data", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(scormData),
//   })
//     .then((response) => response.json())
//     .then((data) => console.log("Data sent successfully:", data))
//     .catch((error) => console.error("Error sending data:", error));
// }
