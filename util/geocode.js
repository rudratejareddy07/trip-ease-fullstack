const nodeGeocoder = require("node-geocoder");
const geocoder = nodeGeocoder({ provider: "openstreetmap" });

module.exports = async function geocode(location) {
  try {
    const res = await geocoder.geocode(location);
    if (res.length) {
      return {
        type: "Point",
        coordinates: [res[0].longitude, res[0].latitude], // GeoJSON expects [lng, lat]
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
};
