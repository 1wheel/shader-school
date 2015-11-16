var findup   = require('findup-element')
var remove   = require('remove-element')
var slider   = require('range-slider')
var escape   = require('escape-html')
var css      = require('insert-css')
var inherits = require('inherits')
var Emitter  = require('events/')
var domify   = require('domify')
var fs       = require('fs')

module.exports = GLCompareSidebar

var style  = fs.readFileSync(__dirname + '/sidebar.css', 'utf8')
var markup = fs.readFileSync(__dirname + '/sidebar.html', 'utf8')

inherits(GLCompareSidebar, Emitter)
function GLCompareSidebar(compare) {
  if (!(this instanceof GLCompareSidebar)) {
    return new GLCompareSidebar(compare)
  }

  Emitter.call(this)

  this._enabled = false
  this._statusColor = null
  this._status = ''
  this._amount = 1

  this.compare = compare
  this.el = document.body.appendChild(domify(markup))
  this.content  = this.el.querySelector('.gl-compare-content')
  this.modeBtns = this.el.querySelectorAll('[data-mode]')
  this.statmsg  = null

  if (style) css(style)
  style = null

  var status = this.el.querySelector('.gl-compare-status')
  var range  = this.el.querySelector('.gl-compare-amount')
  var hide   = this.el.querySelector('.gl-compare-hide')
  var test   = this.el.querySelector('.gl-compare-test')
  var self   = this

  this.elTest   = test
  this.elStatus = status

  range.style.position = 'absolute'

  slider(range, this.amount, function(value) {
    self.amount = value
  }).classList.add('gl-compare-inner')

  hide.addEventListener('click', function(e) {
    self.enabled = !self.enabled
  }, false)

  test.addEventListener('click', function(e) {
    self.emit('test')
  }, false)

  this.el.addEventListener('click', function(e) {
    var mode = findup(e.target, isMode)
    if (mode) return self.mode = mode.getAttribute('data-mode')
  }, false)

  this.el
    .querySelector('[data-mode="'+this.mode+'"]')
    .classList.add('selected')

  // Prevents a weird quirk in chrome where the sidebar would
  // transition its transform property from translate(0) to
  // translate(-100%) on page load.
  setTimeout(function() {
    self.el.classList.remove('preloading')
  }, 50)

  function isMode(el) {
    return el
      && el.hasAttribute
      && el.hasAttribute('data-mode')
  }
}

Object.defineProperty(GLCompareSidebar.prototype, 'enabled', {
  get: function() { return this._enabled },
  set: function(value) {
    if ((value = !!value) === this._enabled) return
    if (this._enabled = value) {
      this.el.classList.add('enabled')
    } else {
      this.el.classList.remove('enabled')
    }
  }
})

Object.defineProperty(GLCompareSidebar.prototype, 'mode', {
  get: function() { return this.compare.mode },
  set: function(value) {
    this.compare.mode = value

    for (var i = 0; i < this.modeBtns.length; i++) {
      var btn = this.modeBtns[i]
      btn.classList.remove('selected')
      if (btn.getAttribute('data-mode') === value) {
        btn.classList.add('selected')
      }
    }
  }
})

Object.defineProperty(GLCompareSidebar.prototype, 'amount', {
  get: function() { return this.compare.amount },
  set: function(value) {
    this.compare.amount = value
  }
})

Object.defineProperty(GLCompareSidebar.prototype, 'status', {
  get: function() { return this._status },
  set: function(value) {
    this._status = value = value ? String(value) : ''

    if (this.statmsg) {
      var prev = this.statmsg
      this.statmsg.style.top = '-50%'
      this.statmsg.style.opacity = 0
      this.statmsg = null

      setTimeout(function() {
        remove(prev)
      }, 500)
    }

    if (!value) return

    var msg = this.statmsg = document.createElement('div')
    msg.innerHTML = escape(value)
    msg.classList.add('gl-compare-message')
    msg.classList.add('adding')
    this.elStatus.appendChild(msg)

    setTimeout(function() {
      msg.classList.remove('adding')
    })
  }
})

Object.defineProperty(GLCompareSidebar.prototype, 'statusColor', {
  get: function() { return this._statusColor },
  set: function(value) {
    this._statusColor = value = value ? String(value) : null
    this.elStatus.style.backgroundColor = value
  }
})
