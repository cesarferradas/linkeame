var clip = new ClipboardJS('#copy')
var trigger = document.getElementById('copy')
clip.on('success', function (e) {
  trigger.className = 'fa fa-check'
  setTimeout(function() {
    trigger.className = 'fa fa-copy'
  }, 500)
  e.clearSelection()
})
