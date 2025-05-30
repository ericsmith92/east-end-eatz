import { Client } from '@googlemaps/google-maps-services-js'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const client = new Client({})
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
const ST_LAWRENCE_LOCATION = '43.651067,-79.370661' // Center of St. Lawrence

async function seedDatabase() {
  try {
    const places = await findPlaces()

    if (places && places.length > 0) {
      console.log(`Found ${places.length} places to insert into DB`)

      const cleanPlaces = cleanPlacesData(places)
      const insertedData = await savePlaces(cleanPlaces)
    } else {
      console.log('No places found to insert into DB')
    }
  } catch (error) {
    console.error('Error in seedDatabase:', error)
  }
}

async function findPlaces() {
  // Define multiple cuisine queries to get around the 20 result limit
  const cuisineQueries = [
    'Restaurants in St. Lawrence Toronto',
    'Italian restaurants in St. Lawrence Toronto',
    'Mexican restaurants in St. Lawrence Toronto',
    'Cafes in St. Lawrence Toronto',
    'Pubs in St. Lawrence Toronto',
  ]

  let allPlaces = []
  const seenPlaceIds = new Set()

  const params = {
    location: ST_LAWRENCE_LOCATION,
    radius: 1000, // meters
    type: 'restaurant',
    language: 'en-CA',
    key: process.env.GOOGLE_MAPS_API_KEY,
  }

  // Run multiple queries to build our database
  for (const query of cuisineQueries) {
    params.query = query

    try {
      console.log(`Fetching results for query: "${query}"`)
      let allPages = []
      const firstPage = await getPlaces(params)
      allPages.push(firstPage)

      let nextPageToken = firstPage.nextPageToken

      while (nextPageToken) {
        await new Promise(r => setTimeout(r, 2000))
        const nextPage = await getPlaces({
          pagetoken: nextPageToken,
          key: process.env.GOOGLE_MAPS_API_KEY,
        })
        allPages = [...allPages, nextPage]
        nextPageToken = nextPage.nextPageToken
      }

      for (const page of allPages) {
        if (page.places && page.places.length > 0) {
          // Filter out places we've already seen (by place_id)
          const newPlaces = page.places.filter(place => {
            if (!seenPlaceIds.has(place.place_id)) {
              seenPlaceIds.add(place.place_id)
              return true
            }

            return false
          })

          allPlaces = [...allPlaces, ...newPlaces]
        } else {
          console.log('No results for this query')
        }
      }

      // Add a delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.error(`Error fetching places for query "${query}":`, error)
    }
  }

  return allPlaces
}

async function getPlaces(params) {
  const textSearchResponse = await client.textSearch({
    params,
  })

  //wrap in a Promise.all so that all promises kicked off by the map settle
  const augmentedPlaceData = await Promise.all(
    textSearchResponse.data.results.map(async place => {
      const placeDetails = await getDetails(place.place_id)

      return {
        ...place,
        ...placeDetails,
      }
    })
  )

  return {
    places: augmentedPlaceData,
    nextPageToken: textSearchResponse.data.next_page_token,
  }
}

async function getDetails(placeId) {
  const { data } = await client.placeDetails({
    params: {
      place_id: placeId,
      fields: ['website', 'formatted_phone_number', 'opening_hours'],
      language: 'en-CA',
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
    timeout: 2000,
  })

  return data.result
}

async function savePlaces(placesArray) {
  const { data, error } = await supabase
    .from('places')
    .upsert(placesArray, {
      onConflict: 'place_id',
    })
    .select()

  if (error) console.error(error)

  return data
}

function cleanPlacesData(places) {
  const cleanPlaces = places.map(place => {
    const {
      place_id,
      name,
      formatted_address,
      geometry,
      rating,
      price_level,
      user_ratings_total,
      opening_hours,
      photos,
      website,
      formatted_phone_number,
    } = place

    return {
      place_id,
      name,
      address: formatted_address,
      lat: geometry.location.lat,
      lng: geometry.location.lng,
      rating,
      price_level,
      user_ratings_total,
      weekday_hours: opening_hours?.weekday_text,
      photo_ref: photos?.[0]?.photo_reference,
      photos,
      website,
      phone_number: formatted_phone_number,
    }
  })

  return cleanPlaces
}

seedDatabase()
  .then(() => console.log('Database seeding process completed'))
  .catch(err => console.error('Failed to seed database:', err))
