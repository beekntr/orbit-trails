/**
 * Content for the "14-Day North India Route Planner" lead magnet.
 * The PDF in public/downloads is generated from this file:
 *   npm run build:pdf
 * so the download and anything shown on the site never drift apart.
 */
export interface RouteStop {
  place: string;
  nights: number;
  days: string;
  why: string;
}

export interface RouteDay {
  day: number;
  title: string;
  /** Travel between cities on this day, if any. */
  travel?: string;
  plan: string;
  tip?: string;
}

export const routePlanner = {
  title: "The Ultimate 14-Day North India Route Planner",
  shortTitle: "14-Day North India Route Planner",
  file: "/downloads/orbit-trails-14-day-north-india-route-planner.pdf",
  route: "Delhi · Agra · Ranthambore · Jaipur · Jodhpur · Udaipur",
  intro:
    "Two weeks is the sweet spot for a first journey through North India: long enough to see the Taj Mahal, track tigers and cross Rajasthan from the Pink City to the lakes of Udaipur, without spending the trip in a car. This is the route we plan most often for first-time visitors, with realistic travel times and the small decisions that make the days run smoothly.",
  bullets: [
    "Day-by-day route with realistic drive times",
    "How many nights each stop really needs",
    "Taj Mahal, safari and fort timing tips",
    "Best months to go and what to book early",
  ],
  stops: [
    { place: "Delhi", nights: 2, days: "Days 1–2", why: "Recover from the flight, then see Mughal and colonial Delhi in one unhurried day." },
    { place: "Agra", nights: 1, days: "Day 3", why: "One night is enough for the Taj Mahal at sunrise and Agra Fort." },
    { place: "Ranthambore", nights: 2, days: "Days 4–5", why: "Two nights gives you three game drives and a fair chance of seeing a tiger." },
    { place: "Jaipur", nights: 3, days: "Days 6–8", why: "Forts, palaces, bazaars and crafts: the fullest city on the route." },
    { place: "Jodhpur", nights: 2, days: "Days 9–10", why: "Mehrangarh Fort and the blue lanes of the old city." },
    { place: "Udaipur", nights: 3, days: "Days 11–13", why: "End slowly on the lakes. Fly out from here on day 14." },
  ] as RouteStop[],
  days: [
    {
      day: 1,
      title: "Arrive in Delhi",
      plan: "Airport meet-and-greet and a private transfer to your hotel. Keep the day free: most long-haul flights land late at night or early in the morning. If you have energy, take a gentle evening walk in Lodhi Garden.",
      tip: "Book your hotel from the night before if you land before 6 am, so the room is ready when you arrive.",
    },
    {
      day: 2,
      title: "Old and New Delhi",
      plan: "Start in Old Delhi at Jama Masjid and ride a cycle rickshaw through the lanes of Chandni Chowk. After lunch, see Humayun's Tomb (the model for the Taj Mahal), the Qutub Minar, and drive past India Gate and the government buildings of Lutyens' Delhi.",
      tip: "The Red Fort is closed on Mondays.",
    },
    {
      day: 3,
      title: "Delhi to Agra",
      travel: "About 3.5 hours by road on the Yamuna Expressway, or under 2 hours on the Gatimaan Express train.",
      plan: "Visit Agra Fort in the afternoon, then watch the sun set on the Taj Mahal from Mehtab Bagh, the garden across the river. It is the quietest view of the Taj you will get.",
    },
    {
      day: 4,
      title: "Taj Mahal at sunrise, then on to Ranthambore",
      travel: "About 6 hours by road including a stop at Fatehpur Sikri.",
      plan: "Be at the gate before sunrise for the softest light and the smallest crowds. After breakfast, drive to Ranthambore, stopping at the abandoned Mughal capital of Fatehpur Sikri on the way.",
      tip: "The Taj Mahal is closed every Friday. Plan your Agra night so that sunrise does not fall on one.",
    },
    {
      day: 5,
      title: "Tiger safaris in Ranthambore",
      plan: "Morning and afternoon game drives in Ranthambore National Park with a naturalist. Between drives, rest at the lodge. Besides tigers, look for leopards, sloth bears, crocodiles and the 10th-century fort inside the park.",
      tip: "Safari seats are released months ahead and sell out in peak season: book them as soon as your dates are fixed. The main zones close during the monsoon, from July to September.",
    },
    {
      day: 6,
      title: "Ranthambore to Jaipur",
      travel: "About 3.5 to 4 hours by road.",
      plan: "Fit in one more sunrise game drive if you would like a third chance at a sighting, then drive to Jaipur. Spend the evening settling in to your hotel; many of the best are converted palaces and havelis.",
    },
    {
      day: 7,
      title: "Jaipur: forts and palaces",
      plan: "Go early to Amber Fort, before the heat and the tour buses. Stop for a photo of Jal Mahal on the way back, then see the City Palace, the Jantar Mantar observatory and the facade of Hawa Mahal in the old city.",
      tip: "Skip the elephant ride up to Amber Fort: walk, or take a jeep. It is kinder to the animals and faster.",
    },
    {
      day: 8,
      title: "Jaipur: crafts, bazaars and food",
      plan: "A slower day. Try block printing with artisans in Sanganer or Bagru, browse Johari Bazaar for jewellery and Bapu Bazaar for textiles, and join a home cooking class. Finish at Nahargarh Fort for sunset over the city.",
    },
    {
      day: 9,
      title: "Jaipur to Jodhpur",
      travel: "About 5.5 to 6 hours by road.",
      plan: "The longest drive of the trip. Break it with a stop in Pushkar to see the lake and the Brahma temple, and arrive in Jodhpur in time for dinner on a rooftop below the fort.",
    },
    {
      day: 10,
      title: "Jodhpur, the Blue City",
      plan: "Mehrangarh is the most impressive fort in Rajasthan: allow a full morning with the audio guide. Visit the marble memorial of Jaswant Thada, then walk down through the blue-painted lanes to the clock tower market.",
      tip: "For a different afternoon, take a jeep out to the Bishnoi villages to meet potters and weavers.",
    },
    {
      day: 11,
      title: "Jodhpur to Udaipur via Ranakpur",
      travel: "About 5 to 6 hours by road including the temple visit.",
      plan: "Stop at the Ranakpur Jain temple, where 1,444 marble pillars are each carved differently. Continue through the Aravalli hills to Udaipur and your first evening on Lake Pichola.",
      tip: "Ranakpur opens to visitors at midday, so there is no need to leave Jodhpur at dawn.",
    },
    {
      day: 12,
      title: "Udaipur: the City of Lakes",
      plan: "Explore the City Palace and its museum, the Jagdish Temple and the lanes around it. In the late afternoon, take a boat on Lake Pichola and watch the palaces turn gold at sunset.",
    },
    {
      day: 13,
      title: "Udaipur at your own pace",
      plan: "Keep the last full day loose. Options include the gardens of Saheliyon-ki-Bari, sunset from the Monsoon Palace, a day trip to Kumbhalgarh Fort, a spa afternoon or simply a long lunch by the water.",
    },
    {
      day: 14,
      title: "Fly home",
      travel: "About 1 hour 20 minutes by air from Udaipur to Delhi.",
      plan: "Fly from Udaipur to Delhi (or Mumbai) to connect with your international flight.",
      tip: "Leave at least four hours between a domestic arrival and an international departure.",
    },
  ] as RouteDay[],
  tips: [
    { title: "Best time to go", body: "October to March. Days are warm and dry, and nights are cool. December and January mornings can be foggy in Delhi and Agra." },
    { title: "Book early", body: "Ranthambore safaris, palace hotels in Udaipur and Jodhpur, and Christmas or New Year dates." },
    { title: "Getting around", body: "A private car with one driver for the whole route is the comfortable way to do this trip, and lets you stop wherever you like." },
    { title: "Make it yours", body: "Short on time? Drop Ranthambore and Jodhpur for a 9-day route. Have longer? Add Varanasi before Delhi or Jaisalmer after Jodhpur." },
  ],
} as const;
