import type { BlogPost } from "./blogData";

/**
 * "Places to visit" guides, published November 2026. They target the broad
 * searches travellers type first ("places to visit in jaipur", "best places
 * to visit in rajasthan", "places to visit in agra") and link on to the
 * tours, itineraries and planner. Merged into `blogPosts` in blogData.ts.
 *
 * Ticket prices and exact opening hours change often, so they are described
 * in general terms rather than quoted.
 */
export const placesPosts: BlogPost[] = [
  {
    id: "10",
    slug: "best-places-to-visit-in-rajasthan",
    title: "12 Best Places to Visit in Rajasthan (and How to Combine Them)",
    excerpt:
      "The 12 best places to visit in Rajasthan, from Jaipur, Udaipur and Jaisalmer to Bundi and Shekhawati: what makes each special, how long to stay, and how to link them into one trip.",
    content: `Rajasthan is India's largest state and, for many travellers, its most beautiful. It is a land of hilltop forts, lake palaces, painted towns, tiger forests and golden sand dunes, and almost every town has a story of maharajas, battles and legends behind it.

The hard part is choosing. This guide covers the 12 best places to visit in Rajasthan, what each one is best for, how long to stay, and how to fit them together without spending your holiday in a car.

## At a glance

| Place | Best for | Stay |
| --- | --- | --- |
| Jaipur | Forts, palaces, bazaars | 2 to 3 nights |
| Udaipur | Lakes, romance, relaxing | 2 to 3 nights |
| Jodhpur | Mehrangarh Fort, the blue city | 2 nights |
| Jaisalmer | Golden fort, desert camps | 2 nights |
| Pushkar | Holy lake, laid-back atmosphere | 1 to 2 nights |
| Ranthambore | Tiger safaris | 2 nights |
| Chittorgarh | India's great fort of legends | Half a day or 1 night |
| Kumbhalgarh and Ranakpur | A great wall and a marble temple | 1 night |
| Bundi | Stepwells, murals, no crowds | 1 to 2 nights |
| Mount Abu | Dilwara temples, cooler air | 1 to 2 nights |
| Bikaner | Junagarh Fort, camels | 1 night |
| Shekhawati | Painted havelis | 1 night |

## 1. Jaipur, the Pink City

Rajasthan's capital is where almost every trip begins, and it is the city we call home. **Amber Fort** rises above a lake on the edge of the city, with mirrored halls and painted gateways. In the old city, painted the colour of terracotta since 1876, you will find the **City Palace**, where the royal family still lives, the honeycomb facade of **Hawa Mahal**, and the giant stone instruments of the **Jantar Mantar** observatory.

Jaipur is also the best place in Rajasthan to shop: gemstones, block-printed cotton, blue pottery and embroidered slippers. Give it at least two full days. Our guide to the [best places to visit in Jaipur](/blog/places-to-visit-in-jaipur) has a full list and a two-day plan.

## 2. Udaipur, the City of Lakes

If you only remember one evening from Rajasthan, it will probably be sunset on **Lake Pichola**, with the white **City Palace** glowing on the shore and the Lake Palace floating in the middle of the water. Udaipur is softer and slower than Jaipur: whitewashed lanes, rooftop cafés, temple bells and boat rides.

Do not miss the **City Palace** museum, a boat trip at sunset, the evening folk dance show at **Bagore ki Haveli**, and the views from the **Monsoon Palace** on its hilltop. Udaipur is the place to slow down, so give it three nights if you can.

## 3. Jodhpur, the Blue City

**Mehrangarh Fort** is perhaps the most impressive fort in India. It rises sheer from a rock above a sea of blue houses, and its palaces hold one of the finest museums in the country. Walk down through the blue lanes of the old city to the **clock tower market**, see the carved **Toorji ka Jhalra** stepwell, and visit **Umaid Bhawan**, one of the world's largest private residences, now part palace, part museum and part hotel.

## 4. Jaisalmer, the Golden City

Deep in the Thar Desert, **Jaisalmer Fort** looks like a sandcastle rising from the dunes. It is one of the few "living forts" in the world: thousands of people still live inside its walls, among temples, shops and guesthouses. The old town around it is full of carved sandstone mansions such as **Patwon ki Haveli**.

The highlight for most visitors is a camel ride into the dunes at sunset, followed by dinner, folk music and a night at a desert camp under the stars. Jaisalmer is far from everywhere, so it suits trips of 12 days or more.

## 5. Pushkar

Pushkar is a small holy town wrapped around a sacred lake, with dozens of temples and bathing ghats, and one of the very few temples in India dedicated to the god Brahma. Evenings on the ghats, with chanting and bells, are magical. It is laid-back, vegetarian and alcohol-free by tradition, and a welcome break between bigger cities.

In October or November, the famous **Pushkar Camel Fair** fills the desert outside town with camels, traders, pilgrims and festivities. Hotels book up months ahead, so plan early if you want to see it.

## 6. Ranthambore National Park

Ranthambore is one of the best places in India to see a wild Bengal tiger, and it sits only a few hours from Jaipur. Safaris run in open jeeps through dry forest, lakes and the ruins of a 10th-century fort. Stay two nights for three safaris. Our [Ranthambore safari guide](/blog/ranthambore-tiger-safari-guide) explains the zones, booking and the best months.

## 7. Chittorgarh Fort

Chittorgarh is one of the largest forts in India, spread across a plateau above the plains, and the setting of Rajasthan's most famous stories of courage and sacrifice, including the legend of Rani Padmini. Inside you will find palaces, temples, water tanks and the carved **Victory Tower** (Vijay Stambh). It fits neatly into the drive between Bundi or Jaipur and Udaipur.

## 8. Kumbhalgarh and Ranakpur

Two remarkable sights in the Aravalli hills between Udaipur and Jodhpur:

- **Kumbhalgarh Fort** is surrounded by a wall around 36 kilometres long, often described as one of the longest continuous walls in the world.
- **Ranakpur Jain Temple** is a 15th-century marble temple with 1,444 carved pillars, no two of them alike. It is one of the most beautiful buildings in India.

Most travellers see Ranakpur on the drive between Udaipur and Jodhpur. Add a night near Kumbhalgarh to see both without rushing.

## 9. Bundi

Bundi is the Rajasthan most travellers miss, and that is its charm. This small town has a palace covered in delicate murals, a hilltop fort, blue lanes and dozens of beautiful stepwells, including the carved **Raniji ki Baori**. There are no tour buses and no crowds. It works well on a route between Ranthambore and Udaipur.

## 10. Mount Abu

Rajasthan's only hill station sits in the green Aravalli hills near the Gujarat border, noticeably cooler than the plains. Its highlight is the **Dilwara Jain temples**, whose marble carving is so fine it looks like lace. Mount Abu is a good choice for a longer trip or a summer visit.

## 11. Bikaner

In the north of the desert, Bikaner has the magnificent **Junagarh Fort**, with richly decorated palace rooms, along with a camel breeding farm and the old merchant havelis of the walled city. Nearby, the **Karni Mata temple** at Deshnok is famous for the thousands of rats that are revered there. It is unforgettable, if not for everyone.

## 12. Shekhawati

The Shekhawati region, between Delhi and Bikaner, is often called an open-air art gallery. Its towns, such as **Mandawa**, **Nawalgarh** and **Fatehpur**, are filled with havelis built by wealthy merchants and painted inside and out with frescoes of gods, legends, trains and even early aeroplanes. It is an easy stop on the way from Delhi into Rajasthan.

## How to combine them

Rajasthan is big and roads are slow, so plan around a loop rather than zigzagging. Some proven combinations:

- **One week:** Jaipur, Jodhpur and Udaipur.
- **10 days:** the Golden Triangle (Delhi, Agra and Jaipur) plus Jodhpur and Udaipur.
- **Two weeks:** add Ranthambore, Pushkar and Jaisalmer.
- **Off the beaten track:** Bundi, Chittorgarh, Kumbhalgarh and Shekhawati.

Our [Rajasthan itineraries for 7, 10 and 14 days](/blog/rajasthan-itinerary-7-10-14-days) set these out day by day, with realistic drive times.

## When to visit Rajasthan

October to March is the best time: warm, dry days and cool nights. December and January are the busiest months, with chilly mornings and evenings in the desert. April to June is very hot, and the monsoon arrives in July. See our [guide to the best time to visit Rajasthan](/blog/best-time-visit-rajasthan-season-weather-guide) for month-by-month details.

## Getting around

Most of these places are not on fast train lines, so the easiest way to explore Rajasthan is with a private car and driver who stays with you for the whole trip. Read our guide to [hiring a car and driver in India](/blog/private-car-and-driver-india-guide) to see how it works.

## See Rajasthan your way

Our [Land of Kings tour](/tour-details/rajasthan-private-tour-land-of-kings-11-days) covers Jaipur, Jodhpur, Jaisalmer and Udaipur in 11 days, and [Colourful Rajasthan with Taj Mahal](/tour-details/colourful-rajasthan-with-taj-mahal) adds Agra. Every one of our [private tours](/luxury-private-tours-india) can be changed to include the places on this list that you most want to see.

**Not sure which places to choose?** Tell us how long you have and what you enjoy in our [trip planner](/plan-my-trip), and a specialist in Jaipur will suggest a route and send a quote within 24 hours.`,
    category: "Travel Guide",
    tags: ["Rajasthan", "Places to Visit", "Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Trip Planning"],
    author: "Orbit Trails Expert",
    publishDate: "2026-11-12",
    readTime: "8 min read",
    featuredImage: "https://images.orbittrails.com/land-of-kings.jpg",
    altText: "Jaisalmer Fort glowing gold at dusk, one of the best places to visit in Rajasthan",
    metaTitle: "12 Best Places to Visit in Rajasthan | Orbit Trails",
    metaDescription:
      "The best places to visit in Rajasthan: Jaipur, Udaipur, Jodhpur, Jaisalmer, Pushkar, Ranthambore and more, with how long to stay and how to combine them.",
    keywords: [
      "places to visit in rajasthan",
      "best places to visit in rajasthan",
      "rajasthan tourist places",
      "rajasthan tourism",
      "rajasthan travel guide",
      "top places in rajasthan",
      "rajasthan cities to visit",
    ],
    featured: true,
  },
  {
    id: "11",
    slug: "places-to-visit-in-jaipur",
    title: "15 Best Places to Visit in Jaipur (Plus a 2-Day Plan)",
    excerpt:
      "The best places to visit in Jaipur, from Amber Fort and Hawa Mahal to stepwells, bazaars and sunset viewpoints, written by a local team, with a simple two-day plan and practical tips.",
    content: `Jaipur is the capital of Rajasthan, one corner of India's Golden Triangle and a UNESCO World Heritage City. It is also our home. This list comes from years of showing the city to guests, so it includes the famous sights, the quieter places locals love, and the order that makes them easiest to see.

## The forts

### 1. Amber Fort (Amer Fort)

Amber Fort is the reason many people come to Jaipur. It sits on a hillside 11 km north of the city, above Maota Lake, and its honey-coloured walls hide courtyards, gardens and royal apartments. Look for the painted **Ganesh Pol** gateway and the **Sheesh Mahal**, a hall whose walls and ceiling are covered in tiny mirrors that sparkle in candlelight.

**Tip:** arrive when it opens in the morning, before the heat and the tour groups. Walk up the old ramp or take a jeep; we do not recommend elephant rides.

### 2. Jaigarh Fort

Above Amber on the same ridge, Jaigarh was built to protect it. It is a military fort rather than a palace, with long ramparts, huge water tanks and **Jaivana**, one of the largest cannons on wheels ever built. The views over Amber and the hills are superb, and it is far quieter than its neighbour.

### 3. Nahargarh Fort

Nahargarh sits on the ridge directly above the old city and is the best place in Jaipur to watch the sun set. Inside, **Madhavendra Bhawan** has nine identical suites built for the king's queens, linked by hidden corridors. Stay for the view as the city lights come on below.

## The old city

### 4. City Palace

In the heart of the Pink City, the City Palace is still home to Jaipur's royal family. Its museum displays royal costumes, weapons and two enormous silver urns, and the **Pritam Niwas Chowk** courtyard has four beautiful painted doorways, each representing a season. The palace is run by the royal family's trust and has its own ticket.

### 5. Hawa Mahal

The Palace of Winds, built in 1799, is Jaipur's most famous image: a pink sandstone facade with 953 small windows, designed so the royal women could watch street life and festivals without being seen. It is only one room deep. **Tip:** the best view is from the rooftop cafés across the road, early in the morning when the sun lights up the facade.

### 6. Jantar Mantar

Next to the City Palace stands an observatory of giant stone instruments, built in the early 18th century by Maharaja Sawai Jai Singh II, the founder of Jaipur. Its huge sundial can tell the time to within a few seconds. It is a UNESCO World Heritage Site, and much more interesting with a guide who can explain how each instrument works.

### 7. The bazaars

The old city was planned as a city of markets, and each still has its speciality:

- **Johari Bazaar:** jewellery, gemstones and silver.
- **Bapu Bazaar:** textiles, block-printed cotton and embroidered leather slippers (mojaris).
- **Tripolia and Chandpol bazaars:** brassware, bangles and everyday local life.

Bargaining is expected in the bazaars, though not in fixed-price shops.

## Beyond the walls

### 8. Albert Hall Museum

Rajasthan's oldest museum is set in a grand Indo-Saracenic building in Ram Niwas Garden. Its collection ranges from miniature paintings and carpets to an Egyptian mummy. The building is beautifully lit at night.

### 9. Jal Mahal

The Water Palace seems to float in the middle of Man Sagar Lake, on the road to Amber. You cannot go inside, but it is lovely from the lakeside promenade, especially at dusk. It makes an easy photo stop on the way to or from Amber Fort.

### 10. Panna Meena ka Kund

This 16th-century stepwell near Amber Fort is a perfect geometric pattern of criss-crossing steps around a pool of water. Visitors are no longer allowed to walk on the steps, but you can photograph them from the edge. Go early for soft light and fewer people.

### 11. Patrika Gate

This vividly painted gateway at Jawahar Circle is one of the most photographed spots in modern Jaipur. Every arch and pillar is covered in colourful murals of Rajasthan. Go first thing in the morning for photos without crowds.

### 12. Galta Ji (the Monkey Temple)

Hidden in a gorge east of the city, Galta Ji is a group of temples built around natural springs and bathing tanks, home to hundreds of monkeys. Walk up to the small Sun Temple on the ridge above for a view over Jaipur at sunset.

### 13. Birla Mandir

A modern white marble temple to Lakshmi and Narayan at the foot of Moti Dungri hill. It is peaceful, beautifully lit in the evening, and a good introduction to a working Hindu temple.

## Experiences

### 14. Block printing in Sanganer or Bagru

Jaipur is famous for hand block-printed textiles. In the nearby towns of Sanganer and Bagru, families have printed fabric by hand for generations, and you can watch them work and try it yourself. The **Anokhi Museum of Hand Printing** near Amber Fort explains the craft beautifully.

### 15. Food and a cultural evening

Try **dal baati churma** (Rajasthan's signature dish), a spicy **pyaaz kachori** for breakfast, and a thick lassi served in a clay cup. For an evening of folk dance, puppetry and a traditional Rajasthani dinner, a village-style cultural venue such as Chokhi Dhani on the edge of the city is popular with families. Our [Rajasthani food guide](/blog/rajasthan-royal-cuisine-food-guide-must-try-dishes) lists more dishes to try.

## A two-day Jaipur plan

| | Morning | Afternoon | Evening |
| --- | --- | --- | --- |
| Day 1 | Amber Fort at opening, Panna Meena ka Kund, photo stop at Jal Mahal | City Palace and Jantar Mantar | Sunset at Nahargarh Fort |
| Day 2 | Hawa Mahal from a rooftop café, Patrika Gate | Block printing in Sanganer or the bazaars | Albert Hall lit up, or a cultural dinner |

With a third day, add Jaigarh Fort, Galta Ji and slower time in the bazaars.

## Practical tips

- **Tickets:** a composite ticket, valid for two days, covers several of the main monuments, including Amber Fort, Nahargarh, Hawa Mahal, Jantar Mantar and Albert Hall. The City Palace is ticketed separately. Prices for foreign visitors are higher than for Indian citizens.
- **Guides:** hire a licensed guide for Amber Fort, City Palace and Jantar Mantar. They bring the history to life and save you time.
- **When to visit:** October to March is the most comfortable. The Jaipur Literature Festival takes place every January.
- **How long:** two full days for the highlights, three to see the city properly.
- **Getting around:** the main sights are spread out, so a private car with a driver, or app-based taxis, will save a lot of time and energy.

## Visit Jaipur with Orbit Trails

Jaipur is part of every one of our classic routes, including the [4-day Golden Triangle tour](/tour-details/4-day-golden-triangle-tour) and [Golden Triangle with Ranthambore](/tour-details/golden-triangle-roaring-ranthambore). Planning a longer trip? See the [best places to visit in Rajasthan](/blog/best-places-to-visit-in-rajasthan) and our [complete Golden Triangle guide](/blog/complete-golden-triangle-travel-guide-2025).

**Want a local to plan your days in Jaipur?** Tell us your dates in our [trip planner](/plan-my-trip), and our Jaipur team will send you a private, tailor-made itinerary within 24 hours.`,
    category: "Travel Guide",
    tags: ["Jaipur", "Places to Visit", "Pink City", "Amber Fort", "Rajasthan", "Golden Triangle"],
    author: "Orbit Trails Expert",
    publishDate: "2026-11-12",
    readTime: "7 min read",
    featuredImage: "https://images.orbittrails.com/golden-triangle-4day.jpg",
    altText: "Amber Fort above Maota Lake, the most famous of the places to visit in Jaipur",
    metaTitle: "15 Best Places to Visit in Jaipur + 2-Day Plan",
    metaDescription:
      "The best places to visit in Jaipur: Amber Fort, City Palace, Hawa Mahal, stepwells, bazaars and sunset spots, with a local's two-day plan and tips.",
    keywords: [
      "places to visit in jaipur",
      "best places to visit in jaipur",
      "jaipur tourist places",
      "things to do in jaipur",
      "jaipur sightseeing",
      "jaipur 2 day itinerary",
      "pink city jaipur",
    ],
    featured: false,
  },
  {
    id: "12",
    slug: "places-to-visit-in-agra",
    title: "10 Best Places to Visit in Agra, Including the Taj Mahal",
    excerpt:
      "The best places to visit in Agra: the Taj Mahal and how to see it well, plus Agra Fort, the Baby Taj, Mehtab Bagh, Fatehpur Sikri and more, with a one-day plan and practical tips.",
    content: `Most people visit Agra for one reason: the Taj Mahal. It deserves every bit of its fame, and seeing it at sunrise is one of the great travel experiences on earth. But Agra was the capital of the Mughal Empire, and the emperors left far more behind than one tomb.

Here are the 10 best places to visit in Agra, how to see the Taj Mahal at its best, and how to plan your time.

## 1. The Taj Mahal

The Taj Mahal was built by the Mughal emperor Shah Jahan as a tomb for his wife Mumtaz Mahal, who died in 1631. Thousands of craftsmen worked on it for around twenty years. Its white marble changes colour through the day, from soft pink at dawn to dazzling white at noon and gold at sunset, and close up you can see the flowers of inlaid semi-precious stone that cover its walls.

**How to see it well:**

- **Go at sunrise.** The light is beautiful, the marble is cool underfoot, and the crowds are thinner.
- **It is closed on Fridays** for prayers at its mosque. Plan your Agra days around this.
- **Pack light.** Only small bags are allowed; food, tripods, drones and many other items are not. Lockers are available at the gates.
- **Vehicles cannot go near it.** You will walk or take an electric shuttle for the last stretch from the parking area.
- **Entry to the main mausoleum** needs an add-on to the standard ticket.
- **Hire a licensed guide.** The stories behind the building, the calligraphy and the optical tricks of its design are half the experience.

Planning photos? Our [Taj Mahal photography guide](/blog/taj-mahal-photography-guide-best-shots-tips) covers the best angles and times.

## 2. Agra Fort

A short drive along the river, this huge red sandstone fort was the seat of the Mughal emperors. Akbar began it in the 16th century, and his grandson Shah Jahan added white marble palaces. Shah Jahan later spent his final years imprisoned here by his son Aurangzeb, in the **Musamman Burj**, a marble tower with a view of the Taj Mahal. Like the Taj, the fort is a UNESCO World Heritage Site, and you need at least two hours.

## 3. Mehtab Bagh

Across the Yamuna river from the Taj Mahal, this Mughal garden lines up perfectly with the monument. It is the best place in Agra to watch the sun set behind the Taj, with the river in front and none of the crowds.

## 4. Itimad-ud-Daulah (the "Baby Taj")

Built in the 1620s by the empress Nur Jahan for her father, this small, exquisite tomb was the first Mughal building to be covered in white marble and inlaid with semi-precious stones, and it is often called a draft for the Taj Mahal. It is calm, rarely crowded and one of Agra's most beautiful buildings.

## 5. Akbar's Tomb, Sikandra

On the edge of the city, the tomb of the great emperor Akbar stands in a vast walled garden where deer and monkeys roam. Its grand gateway, decorated with inlaid stone patterns, is a masterpiece in itself. It is a peaceful stop on the road between Agra and Delhi.

## 6. Fatehpur Sikri

About 40 km from Agra, Fatehpur Sikri is a whole royal city of red sandstone, built by Akbar as his capital and abandoned only a few years later. Its palaces, courtyards and audience halls are remarkably well preserved. Next door, the **Jama Masjid** is entered through the towering **Buland Darwaza**, and holds the white marble tomb of the Sufi saint Salim Chishti, where visitors tie threads to the screens to make a wish.

Fatehpur Sikri lies on the road to Jaipur and Ranthambore, so it fits easily into the drive.

## 7. Chini ka Rauza

This small tomb on the riverbank was once covered in brightly glazed Persian-style tiles, which give it its name. Much of the tilework has faded, but it is a rare example of this style in India and a quiet stop near the Baby Taj.

## 8. Jama Masjid and Kinari Bazaar

In the old city, Agra's great mosque was built by Shah Jahan's daughter, Jahanara. Around it, the lanes of **Kinari Bazaar** sell everything from wedding finery to spices. This is the place to try Agra's famous sweet, **petha**, made from ash gourd, and a breakfast of **bedai** with hot jalebi.

## 9. A marble inlay workshop

The craft used to decorate the Taj Mahal, called pietra dura in Europe and parchin kari in India, is still practised by families of artisans in Agra. Watching them cut and fit tiny pieces of stone into marble is fascinating. You are never obliged to buy, and a good guide will make that clear.

## 10. Agra Bear Rescue Facility

Run by the wildlife charity Wildlife SOS, this sanctuary near Agra cares for sloth bears rescued from the cruel "dancing bear" trade. Visits must be booked in advance, and they are a moving, ethical alternative to the animal attractions you may see elsewhere.

## A one-day Agra plan

| Time | Plan |
| --- | --- |
| Sunrise | The Taj Mahal, with a guide |
| Late morning | Breakfast, then Agra Fort |
| Afternoon | Itimad-ud-Daulah (the Baby Taj) and Chini ka Rauza |
| Sunset | Mehtab Bagh, for the Taj across the river |

If you continue to Jaipur the next morning, stop at Fatehpur Sikri on the way.

## How long to stay

One night is the minimum, so you can see the Taj Mahal at sunrise. Two nights let you add Fatehpur Sikri and the quieter sights without rushing. A day trip from Delhi is possible on a fast morning train or by car on the expressway, but it makes for a very long day.

## When to visit

October to March is the most pleasant time. December and January mornings can be foggy, which sometimes hides the Taj at sunrise, so allow a second chance if photos matter to you. April to June is very hot, and July to September brings the monsoon.

## See Agra on a private tour

Agra is the heart of the Golden Triangle. Our [4-day Golden Triangle tour](/tour-details/4-day-golden-triangle-tour) includes the Taj Mahal at sunrise, and [Golden Triangle with Ranthambore](/tour-details/golden-triangle-roaring-ranthambore) continues from Agra to the tiger reserve via Fatehpur Sikri. Read our [complete Golden Triangle guide](/blog/complete-golden-triangle-travel-guide-2025) to plan the whole route.

**Want the Taj Mahal at sunrise without the stress?** Tell us your dates in our [trip planner](/plan-my-trip), and we'll arrange your guide, tickets and timing as part of a private itinerary.`,
    category: "Travel Guide",
    tags: ["Agra", "Taj Mahal", "Places to Visit", "Golden Triangle", "Fatehpur Sikri"],
    author: "Orbit Trails Expert",
    publishDate: "2026-11-12",
    readTime: "7 min read",
    featuredImage:
      "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    altText: "The Taj Mahal in Agra seen across its gardens and reflecting pool",
    metaTitle: "10 Best Places to Visit in Agra + 1-Day Plan",
    metaDescription:
      "The best places to visit in Agra: the Taj Mahal and how to see it at sunrise, Agra Fort, the Baby Taj, Mehtab Bagh and Fatehpur Sikri, with a day plan.",
    keywords: [
      "places to visit in agra",
      "best places to visit in agra",
      "agra tourist places",
      "things to do in agra",
      "agra sightseeing",
      "taj mahal visit tips",
      "agra one day itinerary",
    ],
    featured: false,
  },
];
