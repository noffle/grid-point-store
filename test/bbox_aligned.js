var GeoStore = require('..')
var test = require('tape')
var memdb = require('memdb')

test('zoom 14 aligned bbox', function (t) {
  var store = GeoStore({ store: memdb({valueEncoding: 'binary'}), zoomLevel: 14 })

  var bbox = [
    [ -1.252341676699629, -1.2303741774326145 ],
    [ -77.29980468749999, -77.27783203125 ]
  ]

  store.insert([-1.24, -77.28], 1, function (err) {
    t.error(err)
    store.insert([-1.252341676699630, -77.28], 2, function (err) {
      t.error(err)
      store.insert([-1.252341676699629, -77.27783203124], 3, function (err) {
        t.error(err)
        check()
      })
    })
  })

  function check () {
    var q = store.queryStream(bbox)
    var num = 0
    q.on('data', function (pt) {
      t.equal(pt.point[0], -1.24)
      t.equal(pt.point[1], -77.28)
      t.equal(pt.value, 1)
      num++
    })
    q.on('end', function () {
      t.equal(num, 1)
      t.end()
    })
  }
})
