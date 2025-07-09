// Quick test to check Font Awesome TripAdvisor icon name
import * as brands from "@fortawesome/free-brands-svg-icons";

// Log all available brand icons that contain "trip" or "advisor"
const tripIcons = Object.keys(brands).filter(key => 
  key.toLowerCase().includes('trip') || key.toLowerCase().includes('advisor')
);

console.log('TripAdvisor related icons:', tripIcons);

// Also check for common variations
const possibleNames = [
  'faTripadvisor',
  'faTripAdvisor', 
  'faTrip',
  'faAdvisor'
];

possibleNames.forEach(name => {
  if (brands[name]) {
    console.log(`Found: ${name}`);
  }
});
