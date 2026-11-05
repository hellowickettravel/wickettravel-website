/**
 * Route pages (/flights/[slug]). One entry here makes the page, its card in
 * the /flights "Popular routes" index and the link from the homepage city
 * cards. The sitemap and llms.txt list these slugs too (kept in sync by hand).
 *
 * Rules for every entry (MEMORY.md):
 * - Every route has its own real content. Never copy a route and swap the city
 *   names: the climate, airport, airlines and tips differ, and so must the page.
 * - No prices. Wicket Travel has no live fare feed, so a published fare would
 *   be invented. Pages say "ask us for today's fare" instead.
 * - Airlines are named as flying a route non-stop only where that is well
 *   established. Where it is not certain, the page says so and points to the
 *   one-stop options, and every page says we confirm carriers when we quote.
 * - Flight times are scheduled times, rounded. Entry rules are general and
 *   always link to GOV.UK, which is the source that stays current.
 *
 * Last reviewed: 5 November 2026 (ROUTES_REVIEWED). Update the date whenever
 * an entry's facts are rechecked.
 */

import { DEST_ROUTE_SLUG } from "@/lib/routeLinks";

export const ROUTES_REVIEWED = "5 November 2026";

export type RouteFaq = { question: string; answer: string };

export type FlightRoute = {
  slug: string;
  fromCity: string;
  /** UK departure airports this page is about (first is the main one). */
  fromAirports: { code: string; name: string }[];
  toCity: string;
  toCountry: string;
  toAirport: { code: string; name: string };
  img: string;
  /** Rounded scheduled time for a non-stop flight, or a one-stop journey. */
  flightTime: string;
  /** "Non-stop" or "Usually one stop" — shown on cards. */
  stopsLabel: string;
  /** Airlines that fly the route non-stop (empty when none is certain). */
  nonstopAirlines: string[];
  /** Plain sentence about non-stop service, shown beside the airline list. */
  nonstopNote: string;
  /** One-stop options, as a sentence. */
  oneStop: string;
  timeDifference: string;
  bestTime: string;
  /** Short line for cards: the best months. */
  bestMonths: string;
  /** Two short paragraphs that open the page. */
  intro: [string, string];
  /** Route-specific practical tips. */
  tips: string[];
  /** Entry requirements: a general line + the GOV.UK page for the country. */
  entry: { text: string; govUkUrl: string; visaLink?: boolean };
  faq: RouteFaq[];
};

const GOV_UK_INDIA = "https://www.gov.uk/foreign-travel-advice/india/entry-requirements";
const GOV_UK_UAE =
  "https://www.gov.uk/foreign-travel-advice/united-arab-emirates/entry-requirements";

const INDIA_ENTRY =
  "British passport holders need a valid Indian visa, an e-Visa or an OCI card to enter India. Apply for an e-Visa only through the Government of India's official website, never a lookalike, and check the current rules on GOV.UK before you book.";

const UAE_ENTRY =
  "British citizens can usually get a visit visa on arrival in the UAE. Other passports may need to apply before travelling, and passport validity rules apply, so check GOV.UK for your nationality before you book. Our UAE visa service can apply for you if you need one.";

const PRICE_ANSWER = (from: string, to: string) =>
  `Fares from ${from} to ${to} change every day with the season, the day of the week and how full the flight is, so we don't publish a price we can't stand behind. Send us your dates and a consultant will quote you today's total fare, including any service fee, before you pay anything.`;

export const ROUTES: FlightRoute[] = [
  {
    slug: "london-to-delhi",
    fromCity: "London",
    fromAirports: [{ code: "LHR", name: "London Heathrow" }],
    toCity: "Delhi",
    toCountry: "India",
    toAirport: { code: "DEL", name: "Indira Gandhi International Airport" },
    img: "/cities/delhi.jpg",
    flightTime: "About 8½–9 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["Air India", "British Airways", "Virgin Atlantic"],
    nonstopNote:
      "Several airlines fly non-stop from Heathrow, most of them daily. The flight back to London usually takes about an hour longer because of headwinds.",
    oneStop:
      "One-stop journeys via Dubai (Emirates), Doha (Qatar Airways) or Abu Dhabi (Etihad) are a good option from Manchester, Birmingham or Edinburgh, and sometimes from London when non-stop seats are full.",
    timeDifference:
      "India is 5½ hours ahead of the UK in winter and 4½ hours ahead during British Summer Time.",
    bestTime:
      "October to March is cooler and dry, and the busiest time to visit. From mid-December to January, dense morning fog in Delhi can delay early arrivals and departures, so leave slack in any onward connection. April to June is very hot, and the monsoon runs from about July to September.",
    bestMonths: "October – March",
    intro: [
      "London to Delhi is one of the busiest routes between the UK and India, and one of the few with a choice of non-stop airlines every day. Most flights leave Heathrow in the morning or evening and land at Indira Gandhi International Airport the same night or the next morning.",
      "Delhi is also the main gateway to north India. If you are going on to Amritsar, Jaipur, Lucknow or the hills, we can book the connecting flight on the same ticket, so a delay on the first flight is the airline's problem to fix, not yours.",
    ],
    tips: [
      "International flights use Terminal 3 at Delhi. If your onward domestic flight is on a separate ticket, you'll clear immigration, collect your bags and check in again, so allow at least three to four hours.",
      "Winter fog delays tend to hit early-morning flights hardest. If you have a choice, a later arrival is often more reliable from December to January.",
      "Families often travel around the school holidays and the autumn festival season, when seats on this route fill early. Booking several months ahead gives you the most choice.",
    ],
    entry: { text: INDIA_ENTRY, govUkUrl: GOV_UK_INDIA },
    faq: [
      {
        question: "How long is the flight from London to Delhi?",
        answer:
          "Non-stop flights from Heathrow take about 8½ to 9 hours. The flight back to London usually takes a little longer, around 9½ to 10 hours, because of headwinds. A one-stop journey via the Gulf takes longer overall, depending on the connection.",
      },
      {
        question: "Which airlines fly non-stop from London to Delhi?",
        answer:
          "Air India, British Airways and Virgin Atlantic fly non-stop between Heathrow and Delhi. Schedules change by season, so we confirm which airlines are flying on your dates when we quote.",
      },
      {
        question: "Do I need a visa to fly from the UK to Delhi?",
        answer:
          "Yes. British passport holders need a visa, an e-Visa or an OCI card to enter India. Apply only through the Government of India's official website and check the latest rules on GOV.UK before you book.",
      },
      {
        question: "How much is a flight from London to Delhi?",
        answer: PRICE_ANSWER("London", "Delhi"),
      },
    ],
  },
  {
    slug: "london-to-mumbai",
    fromCity: "London",
    fromAirports: [{ code: "LHR", name: "London Heathrow" }],
    toCity: "Mumbai",
    toCountry: "India",
    toAirport: { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
    img: "/cities/mumbai.jpg",
    flightTime: "About 9–9½ hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["Air India", "British Airways", "Virgin Atlantic"],
    nonstopNote:
      "There is a choice of non-stop flights from Heathrow most days. The return to London is usually around 10 hours.",
    oneStop:
      "One-stop journeys via Dubai, Doha or Abu Dhabi are widely available from other UK airports. Ask us whether a non-stop is running from your nearest airport on your dates.",
    timeDifference:
      "India is 5½ hours ahead of the UK in winter and 4½ hours ahead during British Summer Time.",
    bestTime:
      "November to February is the driest and least humid time in Mumbai. The monsoon, from about June to September, brings very heavy rain that can occasionally disrupt flights and road travel. April and May are hot and sticky.",
    bestMonths: "November – February",
    intro: [
      "London to Mumbai links two financial capitals, and the route is busy all year with business travellers as well as families. Non-stop flights from Heathrow land at Chhatrapati Shivaji Maharaj International Airport, close to the city's northern suburbs.",
      "Mumbai is a natural starting point for Goa, Pune and the rest of western India. We can add a domestic connection to the same booking so your bags are checked through.",
    ],
    tips: [
      "International flights use Terminal 2 in Mumbai. Road traffic into south Mumbai can be slow at peak times, so plan your onward journey before you land.",
      "If you are travelling in the monsoon, choose a fare that allows changes. Heavy rain can occasionally close the runway for short periods.",
      "Business travel fills Monday morning and Friday evening flights, so mid-week dates often have more seats.",
    ],
    entry: { text: INDIA_ENTRY, govUkUrl: GOV_UK_INDIA },
    faq: [
      {
        question: "How long is the flight from London to Mumbai?",
        answer:
          "A non-stop flight from Heathrow to Mumbai takes about 9 to 9½ hours, and the return is around 10 hours. One-stop journeys through the Gulf take longer, depending on the connection.",
      },
      {
        question: "Which airlines fly non-stop from London to Mumbai?",
        answer:
          "Air India, British Airways and Virgin Atlantic fly non-stop between Heathrow and Mumbai. We confirm the airlines flying on your dates when we quote.",
      },
      {
        question: "When is the monsoon in Mumbai?",
        answer:
          "The monsoon usually arrives in June and lasts until about September, with the heaviest rain in July. Flights keep running, but delays are more likely, so a flexible fare is worth considering.",
      },
      {
        question: "How much is a flight from London to Mumbai?",
        answer: PRICE_ANSWER("London", "Mumbai"),
      },
    ],
  },
  {
    slug: "london-to-bengaluru",
    fromCity: "London",
    fromAirports: [{ code: "LHR", name: "London Heathrow" }],
    toCity: "Bengaluru",
    toCountry: "India",
    toAirport: { code: "BLR", name: "Kempegowda International Airport" },
    img: "/cities/bangalore.jpg",
    flightTime: "About 10 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["British Airways"],
    nonstopNote:
      "British Airways flies non-stop from Heathrow, and other airlines have added non-stop services in recent seasons. We tell you every non-stop option running on your dates when we quote.",
    oneStop:
      "One-stop journeys via Dubai (Emirates), Doha (Qatar Airways) or Abu Dhabi (Etihad) are popular, especially from Manchester and Birmingham.",
    timeDifference:
      "India is 5½ hours ahead of the UK in winter and 4½ hours ahead during British Summer Time.",
    bestTime:
      "Bengaluru sits about 900 metres above sea level, so it is milder than most Indian cities all year. October to February is the most pleasant. The monsoon, from about June to September, brings rain but rarely the extremes of the coast.",
    bestMonths: "October – February",
    intro: [
      "Bengaluru is India's technology capital, and London to Bengaluru is a working route as much as a holiday one: many travellers are visiting family, others are flying for work. Flights land at Kempegowda International Airport, which lies well north of the city centre.",
      "Because so many trips here are for work, flexible fares and good connection times matter. Tell us what you need and we'll quote fares whose rules fit.",
    ],
    tips: [
      "The airport is a long way north of the city, and the drive in can take well over an hour at busy times. Book your transfer before you land.",
      "Business demand fills flights around the start and end of the working week, so mid-week dates can be easier to book.",
      "Bengaluru is a good base for Mysuru and Coorg by road, and for the rest of south India by domestic flight.",
    ],
    entry: { text: INDIA_ENTRY, govUkUrl: GOV_UK_INDIA },
    faq: [
      {
        question: "How long is the flight from London to Bengaluru?",
        answer:
          "A non-stop flight from Heathrow to Bengaluru takes about 10 hours. A one-stop journey via Dubai, Doha or Abu Dhabi takes longer, depending on the connection.",
      },
      {
        question: "Is there a direct flight from London to Bengaluru?",
        answer:
          "Yes. British Airways flies non-stop from Heathrow, and other airlines have added non-stop services in recent seasons. We confirm every non-stop option on your dates when we quote.",
      },
      {
        question: "Is Bengaluru the same as Bangalore?",
        answer:
          "Yes. Bengaluru is the city's official name and Bangalore is the older English one. Both mean the same city and the same airport, code BLR.",
      },
      {
        question: "How much is a flight from London to Bengaluru?",
        answer: PRICE_ANSWER("London", "Bengaluru"),
      },
    ],
  },
  {
    slug: "london-to-hyderabad",
    fromCity: "London",
    fromAirports: [{ code: "LHR", name: "London Heathrow" }],
    toCity: "Hyderabad",
    toCountry: "India",
    toAirport: { code: "HYD", name: "Rajiv Gandhi International Airport" },
    img: "/cities/hyderabad.jpg",
    flightTime: "About 10 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["British Airways"],
    nonstopNote:
      "British Airways flies non-stop between Heathrow and Hyderabad. Seats on the non-stop sell early in the busy months, so it pays to book ahead.",
    oneStop:
      "One-stop journeys via Dubai (Emirates), Doha (Qatar Airways) or Abu Dhabi (Etihad) are the usual choice from Manchester, Birmingham and Scotland, and a useful fallback from London.",
    timeDifference:
      "India is 5½ hours ahead of the UK in winter and 4½ hours ahead during British Summer Time.",
    bestTime:
      "October to February is the most comfortable time. April and May are very hot, often above 40°C, and the monsoon runs from about June to September.",
    bestMonths: "October – February",
    intro: [
      "London to Hyderabad is busy with families visiting relatives, and with business travel for the city's technology and pharmaceutical industries. Flights land at Rajiv Gandhi International Airport at Shamshabad, south of the city.",
      "Many of our Hyderabad travellers are parents flying to and from the UK on their own. If that's your family, our Parent Travel Assist board can help you find another traveller on the same flight.",
    ],
    tips: [
      "The airport is at Shamshabad, south of the city. The expressway makes the drive quicker than it looks on a map, but allow extra time at rush hour.",
      "If your parents are flying alone, book wheelchair or meet-and-assist help with the airline in advance. We can request it for you when we book.",
      "Summer school holidays are the busiest time on this route. Booking several months ahead gives you the most choice of flights.",
    ],
    entry: { text: INDIA_ENTRY, govUkUrl: GOV_UK_INDIA },
    faq: [
      {
        question: "How long is the flight from London to Hyderabad?",
        answer:
          "A non-stop flight from Heathrow to Hyderabad takes about 10 hours. One-stop journeys through the Gulf take longer overall, depending on the connection.",
      },
      {
        question: "Is there a direct flight from London to Hyderabad?",
        answer:
          "Yes. British Airways flies non-stop between Heathrow and Hyderabad. We confirm the schedule for your dates when we quote, along with one-stop options if the non-stop is full.",
      },
      {
        question: "Can someone help my parents on the flight to Hyderabad?",
        answer:
          "Airlines offer wheelchair and meet-and-assist services that must be requested before travel, and we can add the request when we book. Our Parent Travel Assist board can also introduce your parents to another traveller on the same flight.",
      },
      {
        question: "How much is a flight from London to Hyderabad?",
        answer: PRICE_ANSWER("London", "Hyderabad"),
      },
    ],
  },
  {
    slug: "london-to-chennai",
    fromCity: "London",
    fromAirports: [{ code: "LHR", name: "London Heathrow" }],
    toCity: "Chennai",
    toCountry: "India",
    toAirport: { code: "MAA", name: "Chennai International Airport" },
    img: "/cities/chennai.jpg",
    flightTime: "About 10–10½ hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["British Airways"],
    nonstopNote:
      "British Airways flies non-stop between Heathrow and Chennai. Many travellers also fly one-stop through the Gulf, which can offer more departure times.",
    oneStop:
      "One-stop journeys via Dubai (Emirates), Doha (Qatar Airways) or Abu Dhabi (Etihad) are widely used, as are connections through Delhi or Mumbai with Air India.",
    timeDifference:
      "India is 5½ hours ahead of the UK in winter and 4½ hours ahead during British Summer Time.",
    bestTime:
      "Chennai is warm and humid most of the year. Unlike much of India, it gets most of its rain from the northeast monsoon, from about October to December. January to March is usually the most comfortable time to visit, and May and June are the hottest.",
    bestMonths: "January – March",
    intro: [
      "Chennai is the gateway to Tamil Nadu and much of south-east India, and London to Chennai is a long-standing family route. Flights land at Chennai International Airport, in the city's south-west.",
      "Chennai's weather runs on a different calendar from north India, so the best time to fly here is not the same as for Delhi. Read the timing notes below before you pick your dates.",
    ],
    tips: [
      "Heavy rain from October to December can bring flooding in the city. If you're travelling then, a fare that allows changes is worth considering.",
      "The airport is close to the city by Indian standards, and the metro links it to the centre.",
      "For Puducherry, Madurai or Tiruchirappalli, you can continue by road or domestic flight. We can add a domestic flight to the same booking.",
    ],
    entry: { text: INDIA_ENTRY, govUkUrl: GOV_UK_INDIA },
    faq: [
      {
        question: "How long is the flight from London to Chennai?",
        answer:
          "A non-stop flight from Heathrow to Chennai takes about 10 to 10½ hours. A one-stop journey via the Gulf, Delhi or Mumbai takes longer, depending on the connection.",
      },
      {
        question: "Which airline flies non-stop from London to Chennai?",
        answer:
          "British Airways flies non-stop between Heathrow and Chennai. We'll confirm the schedule on your dates when we quote, along with the best one-stop alternatives.",
      },
      {
        question: "When is the rainy season in Chennai?",
        answer:
          "Chennai gets most of its rain from the northeast monsoon, roughly October to December, rather than in the summer like much of India. January to March is usually the most comfortable time to travel.",
      },
      {
        question: "How much is a flight from London to Chennai?",
        answer: PRICE_ANSWER("London", "Chennai"),
      },
    ],
  },
  {
    slug: "london-to-kochi",
    fromCity: "London",
    fromAirports: [
      { code: "LHR", name: "London Heathrow" },
      { code: "LGW", name: "London Gatwick" },
    ],
    toCity: "Kochi",
    toCountry: "India",
    toAirport: { code: "COK", name: "Cochin International Airport" },
    img: "/cities/kochi.jpg",
    flightTime: "Usually 13 hours or more with one stop",
    stopsLabel: "Usually one stop",
    nonstopAirlines: [],
    nonstopNote:
      "Non-stop flights between London and Kochi have only run at times, so most travellers fly with one stop. If a non-stop is running on your dates, we'll tell you when we quote.",
    oneStop:
      "The usual routes are via Dubai (Emirates), Doha (Qatar Airways) or Abu Dhabi (Etihad), or via Delhi or Mumbai with Air India. A Gulf connection also works well from Manchester, Birmingham and Scotland.",
    timeDifference:
      "India is 5½ hours ahead of the UK in winter and 4½ hours ahead during British Summer Time.",
    bestTime:
      "Kerala is at its best from about November to March, when it is dry and warm. The southwest monsoon arrives around June and brings the heaviest rain from June to August.",
    bestMonths: "November – March",
    intro: [
      "Kochi is the main international gateway to Kerala, for families from the state and for travellers heading to the backwaters, beaches and hill country. Flights land at Cochin International Airport, about an hour's drive from the old town.",
      "Because most journeys connect, the choice of stop matters. A shorter connection gets you there faster, while a longer one can mean an easier trip with children or older parents. We'll explain the trade-off when we quote.",
    ],
    tips: [
      "On a one-stop booking, keep both flights on the same ticket, so a delay on the first leg is the airline's responsibility to fix.",
      "The airport is north-east of Kochi. Allow about an hour by road to Fort Kochi or Ernakulam, more in the monsoon.",
      "Alappuzha (Alleppey) and the backwaters, Munnar and the beaches further south are all reachable by road from Kochi.",
    ],
    entry: { text: INDIA_ENTRY, govUkUrl: GOV_UK_INDIA },
    faq: [
      {
        question: "Is there a direct flight from London to Kochi?",
        answer:
          "Non-stop flights between London and Kochi have only run at times, so most journeys have one stop, via the Gulf or via Delhi or Mumbai. If a non-stop is running on your dates, we'll include it in your quote.",
      },
      {
        question: "How long does it take to fly from London to Kochi?",
        answer:
          "With one stop, the journey usually takes 13 hours or more in total. The exact time depends on how long the connection is.",
      },
      {
        question: "Which stopover is best for Kochi?",
        answer:
          "Dubai, Doha and Abu Dhabi all have frequent connections to Kochi. The best one depends on your departure airport, your dates and how long you're happy to wait between flights. We compare them when we quote.",
      },
      {
        question: "How much is a flight from London to Kochi?",
        answer: PRICE_ANSWER("London", "Kochi"),
      },
    ],
  },
  {
    slug: "london-to-dubai",
    fromCity: "London",
    fromAirports: [
      { code: "LHR", name: "London Heathrow" },
      { code: "LGW", name: "London Gatwick" },
    ],
    toCity: "Dubai",
    toCountry: "United Arab Emirates",
    toAirport: { code: "DXB", name: "Dubai International Airport" },
    img: "/cities/dubai.jpg",
    flightTime: "About 7 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["Emirates", "British Airways", "Virgin Atlantic"],
    nonstopNote:
      "London to Dubai has many non-stop flights every day. Emirates flies from both Heathrow and Gatwick, and British Airways and Virgin Atlantic fly from Heathrow.",
    oneStop:
      "With so many non-stop flights, you rarely need a connection to Dubai itself. Dubai is also a major hub, so it often works as the stop on the way to India, Asia or Australia.",
    timeDifference:
      "The UAE is 4 hours ahead of the UK in winter and 3 hours ahead during British Summer Time.",
    bestTime:
      "November to March is warm and dry, with comfortable days, and is the busiest season. June to September is extremely hot, often above 40°C, which is why summer fares and hotel rates are often lower.",
    bestMonths: "November – March",
    intro: [
      "London to Dubai is one of the busiest long-haul routes from the UK, with flights from Heathrow and Gatwick throughout the day. Most flights land at Dubai International Airport, about 15 minutes from the city centre.",
      "Dubai works as a holiday, a family visit or a stopover. If you're travelling on to somewhere else, we can build a stopover of a few days into the same ticket.",
    ],
    tips: [
      "If your passport isn't British, check whether you need a UAE visa before you book. Our UAE visa service can apply for you.",
      "The winter school holidays and February half-term are peak times on this route, so book early if your dates are fixed.",
      "Dubai International is close to the city, and the metro runs from two of its terminals.",
    ],
    entry: { text: UAE_ENTRY, govUkUrl: GOV_UK_UAE, visaLink: true },
    faq: [
      {
        question: "How long is the flight from London to Dubai?",
        answer:
          "A non-stop flight from London to Dubai takes about 7 hours, and the flight back is usually a little longer, about 7½ hours.",
      },
      {
        question: "Which airlines fly non-stop from London to Dubai?",
        answer:
          "Emirates flies from Heathrow and Gatwick, and British Airways and Virgin Atlantic fly from Heathrow. We confirm the airlines and times running on your dates when we quote.",
      },
      {
        question: "Do I need a visa for Dubai?",
        answer:
          "British citizens can usually get a visit visa on arrival. Other nationalities may need to apply before they travel. Check GOV.UK for your passport, and use our UAE visa service if you need one.",
      },
      {
        question: "How much is a flight from London to Dubai?",
        answer: PRICE_ANSWER("London", "Dubai"),
      },
    ],
  },
  {
    slug: "manchester-to-dubai",
    fromCity: "Manchester",
    fromAirports: [{ code: "MAN", name: "Manchester Airport" }],
    toCity: "Dubai",
    toCountry: "United Arab Emirates",
    toAirport: { code: "DXB", name: "Dubai International Airport" },
    img: "/cities/manchester.jpg",
    flightTime: "About 7 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["Emirates"],
    nonstopNote:
      "Emirates flies non-stop from Manchester, usually more than once a day, so you can choose a departure time that suits you without travelling to London.",
    oneStop:
      "From Manchester, Dubai is also one of the easiest places to connect for India, Pakistan, Bangladesh, Asia and Australia, with your bags checked through on one ticket.",
    timeDifference:
      "The UAE is 4 hours ahead of the UK in winter and 3 hours ahead during British Summer Time.",
    bestTime:
      "November to March brings warm, dry weather and is the peak season. June to September is extremely hot. Spring and autumn are a good compromise between weather and price.",
    bestMonths: "November – March",
    intro: [
      "For the North West, Yorkshire, the Midlands and North Wales, Manchester to Dubai saves a trip to London. Emirates flies the route non-stop, with a choice of departure times most days.",
      "Many of our Manchester travellers use Dubai as a stop on the way somewhere else. A connection through Dubai on one ticket is often quicker than going via London.",
    ],
    tips: [
      "Connecting to India or Pakistan? A single Emirates ticket via Dubai checks your bags through to your final destination.",
      "Manchester's summer holiday peak starts as soon as the schools break up. Book early for July and August.",
      "If your passport isn't British, check whether you need a UAE visa, including for a stopover outside the airport.",
    ],
    entry: { text: UAE_ENTRY, govUkUrl: GOV_UK_UAE, visaLink: true },
    faq: [
      {
        question: "How long is the flight from Manchester to Dubai?",
        answer:
          "A non-stop flight from Manchester to Dubai takes about 7 hours, and the return is usually around 7½ hours.",
      },
      {
        question: "Which airline flies from Manchester to Dubai?",
        answer:
          "Emirates flies non-stop between Manchester and Dubai, usually more than once a day. We confirm the times running on your dates when we quote.",
      },
      {
        question: "Can I fly from Manchester to India via Dubai?",
        answer:
          "Yes. Emirates connects from Manchester through Dubai to many cities in India. On one ticket, your bags go through to your final destination and the airline looks after you if a delay makes you miss the connection.",
      },
      {
        question: "How much is a flight from Manchester to Dubai?",
        answer: PRICE_ANSWER("Manchester", "Dubai"),
      },
    ],
  },
  {
    slug: "birmingham-to-dubai",
    fromCity: "Birmingham",
    fromAirports: [{ code: "BHX", name: "Birmingham Airport" }],
    toCity: "Dubai",
    toCountry: "United Arab Emirates",
    toAirport: { code: "DXB", name: "Dubai International Airport" },
    img: "/cities/birmingham.jpg",
    flightTime: "About 7 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["Emirates"],
    nonstopNote:
      "Emirates flies non-stop from Birmingham, so travellers from the Midlands can reach Dubai, and connect beyond it, without going to London or Manchester.",
    oneStop:
      "Through Dubai, a single Emirates ticket from Birmingham reaches much of India, Pakistan, the Far East and Australia with one change.",
    timeDifference:
      "The UAE is 4 hours ahead of the UK in winter and 3 hours ahead during British Summer Time.",
    bestTime:
      "November to March is the most comfortable time for a holiday in Dubai. June to September is very hot, though it can be a good time for a short stopover or a visit to family.",
    bestMonths: "November – March",
    intro: [
      "Birmingham to Dubai is the Midlands' direct link to the Gulf. The airport is quick to reach from Coventry, Wolverhampton, Leicester and much of the region, which makes the non-stop Emirates flight a real alternative to driving to London.",
      "Many travellers from Birmingham use Dubai as a stop on the way to visit family in south Asia. We can quote both the Dubai trip and the connection on one ticket.",
    ],
    tips: [
      "Birmingham Airport has its own railway station, Birmingham International, with direct trains from much of the West Midlands.",
      "Fewer daily flights than London means the best times sell first. Book early for school holidays.",
      "If your passport isn't British, check whether you need a UAE visa before you travel. Our UAE visa service can help.",
    ],
    entry: { text: UAE_ENTRY, govUkUrl: GOV_UK_UAE, visaLink: true },
    faq: [
      {
        question: "How long is the flight from Birmingham to Dubai?",
        answer:
          "A non-stop flight from Birmingham to Dubai takes about 7 hours, and the return is usually around 7½ hours.",
      },
      {
        question: "Is there a direct flight from Birmingham to Dubai?",
        answer:
          "Yes. Emirates flies non-stop between Birmingham and Dubai. We confirm the schedule for your dates when we quote.",
      },
      {
        question: "Can I connect in Dubai to India or Pakistan from Birmingham?",
        answer:
          "Yes. One Emirates ticket from Birmingham via Dubai reaches many cities in India and Pakistan, with your bags checked through to your final airport.",
      },
      {
        question: "How much is a flight from Birmingham to Dubai?",
        answer: PRICE_ANSWER("Birmingham", "Dubai"),
      },
    ],
  },
  {
    slug: "london-to-abu-dhabi",
    fromCity: "London",
    fromAirports: [{ code: "LHR", name: "London Heathrow" }],
    toCity: "Abu Dhabi",
    toCountry: "United Arab Emirates",
    toAirport: { code: "AUH", name: "Zayed International Airport" },
    img: "/cities/abu-dhabi.jpg",
    flightTime: "About 7 hours non-stop",
    stopsLabel: "Non-stop",
    nonstopAirlines: ["Etihad Airways", "British Airways"],
    nonstopNote:
      "Etihad, which is based in Abu Dhabi, and British Airways both fly non-stop from Heathrow. Etihad also flies to Abu Dhabi from Manchester.",
    oneStop:
      "Abu Dhabi is Etihad's hub, so it is also a common connecting point on the way to India, Asia and Australia.",
    timeDifference:
      "The UAE is 4 hours ahead of the UK in winter and 3 hours ahead during British Summer Time.",
    bestTime:
      "November to March is warm, dry and the most popular time. June to September is extremely hot and humid on the coast.",
    bestMonths: "November – March",
    intro: [
      "Abu Dhabi is the UAE's capital, quieter than Dubai, with its own beaches, museums and Yas Island's theme parks. Flights land at Zayed International Airport, the city's airport, which was renamed from Abu Dhabi International.",
      "It also makes a good alternative to Dubai. Dubai is about 90 minutes away by road, so when Dubai flights are full or expensive, flying into Abu Dhabi is worth comparing.",
    ],
    tips: [
      "Zayed International is the same airport you may know as Abu Dhabi International. The code is still AUH.",
      "Dubai is roughly 90 minutes by road, so if Dubai flights are full, Abu Dhabi is worth comparing.",
      "On an Etihad connection to India, keep both flights on one ticket so your bags go through and missed connections are covered.",
    ],
    entry: { text: UAE_ENTRY, govUkUrl: GOV_UK_UAE, visaLink: true },
    faq: [
      {
        question: "How long is the flight from London to Abu Dhabi?",
        answer:
          "A non-stop flight from Heathrow to Abu Dhabi takes about 7 hours, and the return is usually a little longer.",
      },
      {
        question: "Which airlines fly non-stop from London to Abu Dhabi?",
        answer:
          "Etihad Airways and British Airways both fly non-stop from Heathrow. We confirm the schedule for your dates when we quote.",
      },
      {
        question: "Is Zayed International the same as Abu Dhabi airport?",
        answer:
          "Yes. Abu Dhabi International Airport was renamed Zayed International Airport. The airport code is still AUH.",
      },
      {
        question: "How much is a flight from London to Abu Dhabi?",
        answer: PRICE_ANSWER("London", "Abu Dhabi"),
      },
    ],
  },
];

export function getRoute(slug: string): FlightRoute | undefined {
  return ROUTES.find((r) => r.slug === slug);
}

export { portalRouteUrl } from "@/lib/routeLinks";

/* Every slug lib/routeLinks.ts links to must be a real route page. Throws at
   build time (this module is evaluated by generateStaticParams) if not. */
for (const slug of Object.values(DEST_ROUTE_SLUG)) {
  if (!ROUTES.some((r) => r.slug === slug)) {
    throw new Error(`lib/routeLinks.ts links to a missing route page: ${slug}`);
  }
}
