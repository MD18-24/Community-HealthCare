// scripts/map.js

console.log("map.js loaded");

// Ensure the code runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
	// Initialize the map centered on India (or your desired region)
	const map = L.map('map').setView([20.5937, 78.9629], 5); // Default center for India

	// Add OpenStreetMap tile layer to the map
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: '© OpenStreetMap contributors',
	}).addTo(map);

	// L.tileLayer(
	// 	"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
	// 	{
	// 		attribution: "© OpenStreetMap © CartoDB",
	// 		maxZoom: 19,
	// 	}
	// ).addTo(map);


	// fetch('/api/locations')
	// 	.then((response) => response.json())
	// 	.then((locations) => {
	// 		locations.forEach((location) => {
	// 			// Log the coordinates for debugging
	// 			console.log(
	// 				`Pincode: ${location.pincode}, Latitude: ${location.latitude}, Longitude: ${location.longitude}`
	// 			);

	// 			// Ensure that latitude and longitude are valid before adding markers
	// 			if (location.latitude && location.longitude) {
	// 				L.marker([location.latitude, location.longitude])
	// 					.addTo(map)
	// 					.bindPopup(`<b>Pincode:</b> ${location.pincode}`);
	// 			}
	// 		});
	// 	})
		fetch('/api/locations')
	.then(response => response.json())
	.then(locations => {

		console.log("Locations:", locations);

		locations.forEach(location => {

		const lat = Number(location.latitude);
		const lng = Number(location.longitude);

		console.log("Adding marker:", lat, lng);

		const marker = L.marker([lat, lng]).addTo(map);

		marker.bindPopup(location.pincode);
		});

	})
	.catch(err => console.error(err));

});