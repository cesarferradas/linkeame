"use strict";

var target = new ClipboardJS("#copy");
var trigger = document.getElementById("copy");

target.on("success", function (e) {
  trigger.className = "fa fa-check";
  setTimeout(function () {
    trigger.className = "fa fa-copy";
  }, 500);
  e.clearSelection();
});
