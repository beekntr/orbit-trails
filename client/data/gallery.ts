/**
 * Photos for the guest gallery (/gallery) and the homepage photo strip.
 * Files live on the image host under /gallery. To add a photo, upload it
 * there and add an entry below. Keep each file under about 500 kB.
 *
 * Only publish guest photos that the guests have agreed to share.
 */
const BASE = "https://images.orbittrails.com/gallery/";

export interface GalleryPhoto {
  /** File name exactly as uploaded (spaces are fine). */
  file: string;
  caption: string;
  /** What the photo shows, for screen readers and image search. */
  alt: string;
  orientation: "portrait" | "landscape";
}

export const photoUrl = (photo: GalleryPhoto) => BASE + encodeURIComponent(photo.file);

export const guestPhotos: GalleryPhoto[] = [
  {
    file: "2.jpeg",
    caption: "A quiet moment at Amber Fort's painted gateway",
    alt: "Smiling guest sitting cross-legged in front of the painted Ganesh Pol gateway at Amber Fort, Jaipur",
    orientation: "portrait",
  },
  {
    file: "6.jpeg",
    caption: "Turbans and garlands on day one",
    alt: "Smiling couple wearing Rajasthani turbans and marigold garlands at the start of their tour",
    orientation: "landscape",
  },
  {
    file: "12.jpeg",
    caption: "A street-food stop on tour",
    alt: "Three guests tasting local drinks at a street shop",
    orientation: "landscape",
  },
  {
    file: "11.jpeg",
    caption: "All aboard for the next stop",
    alt: "Group of guests in colourful turbans and marigold garlands beside their private van",
    orientation: "landscape",
  },
  {
    file: "1.jpeg",
    caption: "Exploring the arched halls of Amber Fort",
    alt: "Guest in a pink dress walking through the arched marble halls of Amber Fort, Jaipur",
    orientation: "portrait",
  },
  {
    file: "5.jpeg",
    caption: "Settling in after a garland welcome",
    alt: "Couple wearing marigold garlands relaxing in a hotel lounge",
    orientation: "landscape",
  },
  {
    file: "WhatsApp Image 2025-12-06 at 19.44.32.jpeg",
    caption: "Guests on a palace visit",
    alt: "Four guests posing in front of a historic palace building in Rajasthan",
    orientation: "portrait",
  },
  {
    file: "8.jpeg",
    caption: "A group welcome, Rajasthani style",
    alt: "Group of guests wearing colourful turbans and marigold garlands",
    orientation: "landscape",
  },
  {
    file: "4.jpeg",
    caption: "Welcomed with a marigold garland",
    alt: "Guest wearing a marigold garland and a pink scarf in a hotel lobby on arrival",
    orientation: "portrait",
  },
  {
    file: "7.jpeg",
    caption: "Family time between sightseeing",
    alt: "Family group of guests relaxing together in a hotel lobby",
    orientation: "landscape",
  },
];

export const placePhotos: GalleryPhoto[] = [
  {
    file: "9.jpg",
    caption: "Hawa Mahal, Jaipur",
    alt: "The pink sandstone facade of Hawa Mahal, the Palace of Winds, in Jaipur",
    orientation: "landscape",
  },
  {
    file: "jal-mahal-jaipur-tour.jpg",
    caption: "Jal Mahal at dusk",
    alt: "Jal Mahal, the water palace in Jaipur, lit up at dusk",
    orientation: "landscape",
  },
  {
    file: "city-palace-jaipur-rajasthan-1.jpg",
    caption: "City Palace, Jaipur",
    alt: "The cream and pink facade of the City Palace in Jaipur",
    orientation: "landscape",
  },
  {
    file: "10.jpeg",
    caption: "Inside Amber Fort",
    alt: "Carved sandstone pillars and arches inside Amber Fort",
    orientation: "portrait",
  },
  {
    file: "Screenshot 2025-12-18 210043.png",
    caption: "An ancient stepwell near Amber Fort",
    alt: "Criss-crossing stone steps of an ancient stepwell near Jaipur",
    orientation: "landscape",
  },
  {
    file: "jantar-mantar1.jpg",
    caption: "Jantar Mantar observatory, Jaipur",
    alt: "Giant stone astronomical instruments at the Jantar Mantar observatory in Jaipur",
    orientation: "landscape",
  },
  {
    file: "hand-block-printing.jpg",
    caption: "Hand block printing, a Jaipur craft",
    alt: "Artisan pressing a carved wooden block onto fabric during hand block printing",
    orientation: "landscape",
  },
  {
    file: "WhatsApp Image 2025-12-06 at 19.50.377.jpg",
    caption: "A Rajasthani thali",
    alt: "A traditional Rajasthani thali with curries, rice, bread and chutneys",
    orientation: "landscape",
  },
  {
    file: "pkd8q18d663e1.jpeg",
    caption: "Royal cenotaphs, Jaipur",
    alt: "Domed sandstone royal cenotaphs in Jaipur",
    orientation: "landscape",
  },
];
