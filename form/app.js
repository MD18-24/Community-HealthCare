/*
// Connect to MongoDB
const uri = "mongodb+srv://chcare18:chcare18@communityhealthcare.gsoni.mongodb.net/CommunityHealthCare?retryWrites=true&w=majority&appName=CommunityHealthCare";

// OpenCage Geocoding API key
const OPEN_CAGE_API_KEY = 'f23af657d74045d89777841ec36929be'; 
*/
const https = require('https'); // Built-in https module
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

// OpenCage Geocoding API key
const OPEN_CAGE_API_KEY = '7a10240fdf694caa89e7925f9b642fd2';

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname, 'public'))); // Adjust the path if necessary

// Serve JavaScript files from the scripts directory (for internal usage, not for client-side)
//app.use('/scripts', express.static(path.join(__dirname)));  // Serve static JavaScript files from the scripts folder
//app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
const uri =
	'mongodb+srv://chcare18:chcare18@communityhealthcare.gsoni.mongodb.net/CommunityHealthCare?retryWrites=true&w=majority&appName=CommunityHealthCare';
mongoose
	.connect(uri)
	.then(() => console.log('Connected to MongoDB Atlas'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Define a schema for the symptoms
const symptomSchema = new mongoose.Schema({
	name: String,
	email: String,
	phone: String,
	countryCode: String,
	gender: String,
	address: String,
	pincode: String,
	commonSymptoms: [String],
	detailedSymptoms: String,
	severity: String,
});

// Create a model for the symptoms
const Symptom = mongoose.model('Symptom', symptomSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/1 Icon.html'));
});

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'index.html')); // Serve index.html if needed
});

// Route for the map page
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, '/public', 'map.html')); // Serve map.html from the public folder
});


// API endpoint to submit symptoms
app.post('/api/symptoms', async (req, res) => {
	try {
		const symptomData = req.body;
		const symptom = new Symptom(symptomData);
		await symptom.save();
		res.status(201).send({ message: 'Symptom data saved successfully!' });
	} catch (error) {
		console.error('Error saving symptoms:', error);
		res.status(500).send({ message: 'Error submitting symptoms' });
	}
});

// API endpoint to fetch locations and convert pincodes to lat/lng
app.get('/api/locations', async (req, res) => {
	try {
		// const locations = await Symptom.find({}, 'pincode'); // Fetch only the pincode field
		// const locationData = [];
		const locations = await Symptom.find({}, 'pincode');
		console.log(locations);

		const locationData = [];

		for (const location of locations) {
			const pincode = location.pincode;
			if (pincode) {
				const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}, India&key=${OPEN_CAGE_API_KEY}`;
				//const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${OPEN_CAGE_API_KEY}&countrycode=in`;


				// Use https to make the request
				await new Promise((resolve, reject) => {
					https
						.get(url, (response) => {
							let data = '';
							response.on('data', (chunk) => (data += chunk)); // Accumulate the response data
							response.on('end', () => {
								const parsedData = JSON.parse(data);
								console.log("Pincode:", pincode);
								console.log("Status:", parsedData.status);
								console.log("Results count:", parsedData.results.length);
								if (parsedData.results.length > 0) {
									const { lat, lng } = parsedData.results[0].geometry;
									locationData.push({
										pincode: pincode,
										latitude: lat,
										longitude: lng,
									});
								}
								
								resolve();
							});
						})
						.on('error', (error) => reject(error));
				});
			}
		}
		res.json(locationData); // Return the location data with lat/lng
	} catch (error) {
		console.error('Error fetching location data:', error);
		res.status(500).send({ message: 'Error fetching location data' });
	}
	//console.log("Mongo locations:", locations);

});

// Start the server
app.listen(3000, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
