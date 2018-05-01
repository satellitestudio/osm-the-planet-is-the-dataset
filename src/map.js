// everything here happens in a worker. Logging To your terminal won't work, send an error to the done callback

module.exports = function(data, tile, writeData, done) {

  // 1st argument is for errors!
  done(null, {
    tile: tile,
    features: data.osm.osm.features.filter(function (feature) {
      // return feature.properties.landuse && feature.properties.landuse === 'vineyard'
      // return feature.properties.landuse && feature.properties.landuse === 'orchard'
      // return feature.properties.aeroway && feature.properties.aeroway === 'runway'
      // return feature.properties.leisure && feature.properties.leisure === 'golf_course'
      // return feature.properties.tourism && feature.properties.tourism === 'theme_park'
      // return feature.properties.boundary === 'administrative' && feature.properties.admin_level === '8'
      // return feature.properties.amenity === 'restaurant' && feature.properties.cuisine === 'chinese'
      return feature.properties.shop === 'hairdresser'
    })
  });
  // var x = tile[0]
  // var y = tile[1]
  // var z = tile[2]
  //
  // var geoJson = {
  //   type: 'FeatureCollection',
  //   features: []
  // }


  // const dataset = global.mapOptions.dataset
  // const features = data[dataset][dataset].features
  // geoJson.features = features
  //
  // try {
  //   if (global.mapOptions.config.convertFields) {
  //     geoJson = convertTile(geoJson, z, global.mapOptions.config.convertFields)
  //   }
  //   var tileIndex = geojsonvt(geoJson)
  //   var tileData = tileIndex.getTile(z, x, y)
  //   // var pbfout = zlib.gzipSync(vtpbf.fromGeojsonVt({ 'vessels': tileData }));
  //   var pbfout = vtpbf.fromGeojsonVt({ points: tileData })
  //   fs.writeFileSync(global.mapOptions.dest + '/' + z + ',' + x + ',' + y, pbfout)
  //   done(null, geoJson)
  // } catch(e) {
  //   //   // done(null, {error: e})
  // }
}
