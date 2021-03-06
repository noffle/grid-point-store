var GeoStore = require('../')
var test = require('tape')
var memdb = require('memdb')

test('remove', function (t) {
  t.plan(8)

  var kdb = GeoStore({
    store: memdb(),
    types: ['f32', 'f32', 'uint32']
  })

  kdb.insert([ 1, 2 ], 333, function (err) {
    t.ifError(err)
    kdb.insert([ 1, 2 ], 444, function (err) {
      t.ifError(err)
      kdb.insert([ -1, 0 ], 555, function (err) {
        t.ifError(err)
        kdb.query([[-5,5],[-5,5]], function (err, pts) {
          t.ifError(err)
          t.deepEqual(pts, [
            { point: [ 1, 2], value: 333 },
            { point: [ 1, 2], value: 444 },
            { point: [-1, 0], value: 555 }
          ])
          remove()
        })
      })
    })
  })

  function remove () {
    kdb.remove([ 1, 2 ], function (err) {
      t.ifError(err)
      kdb.query([[-5,5],[-5,5]], function (err, pts) {
        t.ifError(err)
        t.deepEqual(pts, [
          { point: [-1, 0], value: 555 }
        ])
      })
    })
  }
})
