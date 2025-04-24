"use strict";

async function seedDatabase() {
    const places = await findPlaces();

    if(places){
        const placesList = document.getElementById('places');

        //connect and insert into DB
    }
}

async function findPlaces() {
    const { Place } = await google.maps.importLibrary("places");

    const stLawrenceBounds = {
        "north": 43.6571,   // Queen St E
        "south": 43.6456,   // Front St E
        "east":  -79.3570,  // Parliament St side
        "west":  -79.3795   // Yonge St side
      }

    const request = {
        textQuery: 'Restaurants in St. Lawrence',
        fields: ['displayName', 'location', 'rating', 'photos', 'websiteURI', 'userRatingCount'],
        includedType: 'restaurant',
        locationRestriction: stLawrenceBounds,
        language: 'en-CA',
        maxResultCount: 20,
        minRating: 4,
        region: 'ca',
        useStrictTypeFiltering: false
    };

    const { places } = await Place.searchByText(request);
    
    if (places.length) {
        console.log(places);
        return places;
    }
    else {
        console.log('No results');
        return false;
    }
}

seedDatabase();