var clip = new ClipboardJS('#copy')
var text = document.getElementById('copy')
clip.on('success', function (e) {
  text.innerHTML = 'copiado'
  text.removeAttribute('id')
  e.clearSelection()
})
