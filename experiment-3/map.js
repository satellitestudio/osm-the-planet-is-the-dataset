// everything here happens in a worker. Logging To your terminal won't work, send an error to the done callback

module.exports = (data, tile, writeData, done) => {
  const features = data.osm.osm.features.filter(feature => 
    feature.properties.shop === 'hairdresser'
  )

  const names = features.map(feature => feature.properties.name || '[unknown]')

  // 1st argument is for errors!
  done(null, {
    names
  })
}
