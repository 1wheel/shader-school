module.exports = sidenote

function sidenote(list, opts) {
  opts = opts || {}
  opts.distance  = opts.distance || 1
  opts.character = opts.character || ' '

  var mleft  = 0
  var mright = 0

  for (var i = 0; i < list.length; i++) {
    var left  = String(list[i][0])
    var right = String(list[i][1])

    if (left.length > mleft) mleft = left.length
    if (right.length > mright) mright = right.length
  }

  mleft += Math.floor(opts.distance / 2)
  mright += Math.ceil(opts.distance / 2)

  var output = []
  for (var i = 0; i < list.length; i++) {
    var left  = String(list[i][0])
    var right = String(list[i][1])

    while (left.length < mleft) left += opts.character
    while (right.length < mright) right = opts.character + right
    output[i] = left + right
  }

  return output
}
