// everything here happens in a separate thread. Logging to your terminal won't work,
// send an error/debug via the done callback
// map.js
module.exports = function(data, tile, writeData, done) {
  const pistes = data.osm.osm.features.filter(feature => {
    // grab any piste that has difficulty information
    return feature.properties['piste:difficulty'] !== undefined
      // we're not interested in points and polygons
      && (feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString')
  }).map(feature => {
    // pistes colors differ depending on where we are on the planet: see
    // https://wiki.openstreetmap.org/wiki/Key:piste:difficulty?uselang=en-US
    // precompute piste color to avoid having to put too complicated rules in
    // a styling tool such as Mapbox Studio.
    // To determine rules, we use simple lat/lon comparisons
    const coordinates = feature.geometry.coordinates
    const difficulty = feature.properties['piste:difficulty']
    // deal with LineString and MultiLineString to sample a point
    const samplePoint = (coordinates[0][0][0]) ? coordinates[0][0] : coordinates[0]
    const samplePointLng = samplePoint[0]
    const samplePointLat = samplePoint[1]

    if (samplePointLng > -30 && samplePointLng < 60) {
      // We're in Europe
      feature.properties.pisteColor = {
        novice: 'green',
        easy: 'blue',
        intermediate: 'red',
        advanced: 'black',
        // Scandinavia/Alps
        expert: (samplePointLat > 54) ? 'double-black' : 'orange',
        freeride: 'yellow',
        extreme: 'extreme'
      }[difficulty]
    } else {
      // We're in Asia or Americas
      feature.properties.pisteColor = {
        novice: 'bunny-hill',
        easy: 'green',
        // Japan/Americas
        intermediate:  (samplePointLng > 0) ? 'red' : 'blue',
        advanced: 'black',
        expert: 'double-black',
        freeride: 'orange',
        extreme: 'extreme'
      }[difficulty]
    }
    return feature
  })

  // 1st argument is for errors!
  done(null, {
    tile: tile,
    features: pistes
  })
}

