# sidenote [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Given a list of string pairs, align each pair to the left and to the right.

## Usage

[![NPM](https://nodei.co/npm/sidenote.png)](https://nodei.co/npm/sidenote/)

### rows = sidenote(list, [opts])

Accepts a `list` of string pairs in the following format:

``` javascript
var list = [
  ['left hand side', '{right hand side}'],
  ['another', 'piece of text']
]
```

And returns properly aligned `rows` like so:

``` javascript
return [
  'left hand side {right hand side}',
  'another            piece of text'
]
```

Optionally, you can pass in the following options:

* `opts.character`: the character with which to pad the gaps between strings. Defaults to ` `.
* `opts.distance`: add additional space between each column. Defaults to 1.

## License

MIT. See [LICENSE.md](http://github.com/hughsk/sidenote/blob/master/LICENSE.md) for details.
