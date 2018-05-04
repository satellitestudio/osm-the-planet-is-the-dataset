const fs = require('fs')
// everything here happens in a worker. Logging To your terminal won't work, send an error to the done callback

module.exports = function(data, tile, writeData, done) {
  const features = data.osm.osm.features.filter(function (feature) {
    return feature.properties.tourism === 'theme_park'
  })
  
  // features.forEach(themePark => {
  //   fs.writeFileSync(JSON.stringify(themePark))
  // })
  
  // 1st argument is for errors!
  done(null, {
    features
  })
}
  