const socket = io();

navigator.permissions
  .query({
    name: "geolocation",
  })
  .then(function (result) {
    if (result.state == "denied") {
      alert("Please allow geolocation access to use this feature");
    } 
    
  });

document.getElementById('send').addEventListener('click', (e) => {
    username = document.getElementById('name').value
    socket.emit('send-username', username)
    
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude, username });
    },
    (error) => {
      console.error(error);
    }
  ),
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
} else {
  alert("Geolocation is not supported by your browser");
}
})


const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {}
socket.on('receive-location', (data) => {
    console.log(data)
    const {id, latitude, longitude, username} = data
    map.setView([latitude, longitude])
    if(markers[id]) {
        markers[id]
          .setLatLng([latitude, longitude])
          .bindPopup(username)
          .openPopup();
    } else {
        markers[id] = L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(username)
          .openPopup();
    }
})


socket.on('user-disconnected', (id) => {
    map.removeLayer(markers[id])
    delete markers[id]
})


