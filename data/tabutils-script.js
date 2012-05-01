var display = document.getElementById ("tabutils-display");

display.onclick = function () {
  self.port.emit ("count");
}

self.port.on ("update", function (data) {
  display.innerHTML = data;
});
