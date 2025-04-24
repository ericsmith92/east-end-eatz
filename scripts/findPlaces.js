const { Client } = require('@googlemaps/google-maps-services-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const client = new Client({});

async function seedDatabase() {
    try {
        const places = await findPlaces();
        
        if (places && places.length > 0) {
            console.log(`Found ${places.length} places to insert into DB`);
            //connect and insert into DB
        } else {
            console.log('No places found to insert into DB');
        }
    } catch (error) {
        console.error('Error in seedDatabase:', error);
    }
}

async function findPlaces() {
    // Define coordinates for St. Lawrence neighborhood
    const stLawrenceLocation = "43.651067,-79.370661"; // Center of St. Lawrence
    
    // Define multiple cuisine queries to get around the 20 result limit
    const cuisineQueries = [
        'Restaurants in St. Lawrence Toronto',
        'Italian restaurants in St. Lawrence Toronto',
        'Mexican restaurants in St. Lawrence Toronto',
        'Cafes in St. Lawrence Toronto',
        'Pubs in St. Lawrence Toronto'
    ];
    
    let allPlaces = [];
    const seenPlaceIds = new Set();
    
    // Run multiple queries to build our database
    for (const query of cuisineQueries) {
        try {
            console.log(`Fetching results for query: "${query}"`);
            
            const response = await client.textSearch({
                params: {
                    query: query,
                    location: stLawrenceLocation,
                    radius: 1000, // meters
                    type: 'restaurant',
                    language: 'en-CA',
                    key: process.env.GOOGLE_MAPS_API_KEY
                }
            });


            console.log(response);
            
            if (response.data.results && response.data.results.length > 0) {
                // Filter out places we've already seen (by place_id)
                const newPlaces = response.data.results.filter(place => {
                    console.log('*****************************************************');
                    console.log(place);
                    console.log('*****************************************************');
                    if (!seenPlaceIds.has(place.place_id)) {
                        seenPlaceIds.add(place.place_id);
                        return true;
                    }
                    return false;
                });
                
                allPlaces = [...allPlaces, ...newPlaces];
                console.log(`Added ${newPlaces.length} new places from this query`);
            } else {
                console.log('No results for this query');
            }
            
            // Add a delay to avoid hitting rate limits
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } catch (error) {
            console.error(`Error fetching places for query "${query}":`, error);
        }
    }
    
    return allPlaces;
}

seedDatabase()
    .then(() => console.log('Database seeding process completed'))
    .catch(err => console.error('Failed to seed database:', err));