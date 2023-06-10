mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/light-v11",
  center: [...camp.geometry.coordinates], // starting position [lng, lat]
  zoom: 8,
}).addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({ color: "black", rotation: 0 })
  .setLngLat([...camp.geometry.coordinates])
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${camp.title}</h3><p>${camp.location}</p>`
    )
  )
  .addTo(map);
