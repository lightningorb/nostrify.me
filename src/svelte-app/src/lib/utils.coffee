export print = (x) -> console.log x

export toBinString = (arr) ->
  uarr = new Uint8Array(arr)
  strings = []
  chunksize = 0xffff
  i = 0
  while i * chunksize < uarr.length
    strings.push String.fromCharCode.apply(null, uarr.subarray(i * chunksize, (i + 1) * chunksize))
    i++
  strings.join ''

export toBinArray = (str) ->
  l = str.length
  arr = new Uint8Array(l)
  i = 0
  while i < l
    arr[i] = str.charCodeAt(i)
    i++
  arr

export getRandomInt = (min, max) ->
  min = Math.ceil(min)
  max = Math.floor(max)
  Math.floor Math.random() * (max - min) + min