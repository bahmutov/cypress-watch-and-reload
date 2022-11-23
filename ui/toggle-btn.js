function insertToggleButton() {
  const doc = window.top.document

  let existing = doc.querySelector('#cypress-watch-and-reload-toggle')
  if (existing) {
    existing.remove()
  }

  const controls = doc.querySelector('.controls')
  const span = doc.createElement('span')
  span.id = 'cypress-watch-and-reload-toggle'
  // reuse existing classes for simplicity
  span.innerHTML = `
    <button title="Toggle watch and reload" class="reload-enabled">
      <i style="color: #8bc34a"></i>
      <i class="fas fa-eye"></i>
    </button>
    <style>
      button.reload-enabled i {
        color: #1fa971;
      }
    </style>
  `
  controls.prepend(span)

  return span.querySelector('button')
}

module.exports = insertToggleButton
