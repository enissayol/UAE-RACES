const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Path to the JSON file
const jsonFilePath = path.join(__dirname, '..', 'data', 'uae_running_events.json');

// Function to scrape event data from various sources
async function fetchEventsData() {
  const events = [];
  
  try {
    // Example: Scrape from Premier Online
    console.log('Scraping Premier Online events...');
    const premierOnlineResponse = await axios.get('https://www.premieronline.com/calendar', {
      timeout: 10000
    });
    const $ = cheerio.load(premierOnlineResponse.data);
    
    // Extract events from Premier Online (example selector)
    $('.event-item, .race-item, .event-list-item').each((index, element) => {
      try {
        const name = $(element).find('.event-name, .race-title, h3').first().text().trim();
        const date = $(element).find('.event-date, .race-date, .date').first().text().trim();
        const location = $(element).find('.event-location, .race-location, .location').first().text().trim();
        
        if (name && date && name.length > 5 && date.length > 5) {
          events.push({
            name,
            date,
            distances: "Various",
            location: location || "UAE",
            category: "community",
            price: "TBA",
            earlyBird: "Not specified",
            registrationLink: "https://www.premieronline.com/calendar",
            source: "Premier Online"
          });
        }
      } catch (e) {
        console.log('Error parsing event element:', e.message);
      }
    });
    
    console.log(`Found ${events.length} events from Premier Online`);
    
  } catch (error) {
    console.error('Error scraping Premier Online events:', error.message);
  }
  
  // Add Umm Al Quwain Half Marathon 2026:cite[2]:cite[5]
  events.push({
    name: "Umm Al Quwain Half Marathon 2026",
    date: "11/01/2026",
    distances: "Half Marathon (21.1km), 10km, 5km, 1 Mile",
    location: "Vida Beach Resort, Umm Al Quwain",
    category: "elite",
    price: "From 50 (1M) to 145 (HM)",
    earlyBird: "Yes (Until 15/04/2026)",
    registrationLink: "https://www.hopasports.com/en/event/umm-al-quwain-half-marathon-2026",
    source: "Hopasports"
  });
  
  // Add fallback events if scraping fails
  if (events.length === 0) {
    console.log('Using fallback events data');
    events.push(
      {
        name: "NBF Fujairah Run",
        date: "22/11/2025",
        distances: "11km Trail, 10km, 5km, 3km Road",
        location: "Fujairah",
        category: "trail",
        price: "TBA",
        earlyBird: "Not specified",
        registrationLink: "https://www.premieronline.com/event/nbf-fujairah-run",
        source: "Premier Online"
      },
      {
        name: "Community Run @ The Ripe Market | 2",
        date: "14/12/2025",
        distances: "15km, 10km, 5km, 2.5km",
        location: "The Ripe Market, Dubai Police Academy",
        category: "community",
        price: "156 (15km), 137 (10km), 126 (5km), 116 (2.5km)",
        earlyBird: "No",
        registrationLink: "https://www.hopasports.com/en/event/community-run-the-ripe-market-2",
        source: "Hopasports"
      }
    );
  }
  
  return events;
}

// Main function to update the JSON file
async function updateEventsData() {
  try {
    console.log('Fetching latest events data...');
    const events = await fetchEventsData();
    
    // Add timestamp
    const dataWithTimestamp = {
      lastUpdated: new Date().toISOString(),
      events: events
    };
    
    // Ensure data directory exists
    const dataDir = path.dirname(jsonFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write to JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(dataWithTimestamp, null, 2));
    console.log(`Successfully updated ${events.length} events in ${jsonFilePath}`);
    
  } catch (error) {
    console.error('Error updating events data:', error);
    process.exit(1);
  }
}

// Run the update
updateEventsData();
