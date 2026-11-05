/**
 * Homepage FAQ — shared between the visible <Faq> section and the FAQPage
 * JSON-LD in app/page.tsx so the structured data always matches what users see
 * (a Google requirement for FAQ rich results). Answers are plain text and
 * naturally weave in primary keywords: cheap flights from the UK, best airline
 * fares, UK departures and 24/7 support.
 *
 * Every answer must match the booking model in lib/legal.ts
 * (BOOKING_DISCLOSURE): Wicket Travel Limited books on the customer's behalf
 * as a travel agent. No ATOL wording — the company holds no ATOL licence — and
 * no price-match promise, which has no terms behind it (website audit,
 * 5 November 2026).
 */
export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does Wicket Travel find cheap flights from the UK?",
    answer:
      "We look for the best available fares across leading airlines — British Airways, Emirates, Qatar Airways, Virgin Atlantic and more — on departures from Heathrow, Manchester, Birmingham, Gatwick, Luton and Edinburgh. A consultant then quotes you one total price with the fare rules, and once you agree and pay, Wicket Travel Limited books the flight with the airline on your behalf as your travel agent.",
  },
  {
    question: "Can I book flights from the UK to India or Dubai?",
    answer:
      "Yes. Routes to India (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kochi) and Dubai are among our most-booked, with carriers like Air India, IndiGo and Emirates flying direct and one-stop from major UK cities. Enter your route and dates, or message us on WhatsApp, and we'll quote the best fares available for your dates.",
  },
  {
    question: "Are my flight bookings financially protected?",
    answer:
      "Wicket Travel Limited does not hold an ATOL licence, and flight-only bookings are not ATOL protected. Your ticket is issued by the airline, and the airline's conditions of carriage apply. If you pay by credit card, you may be covered under Section 75 of the Consumer Credit Act for bookings over £100; debit card payments may be covered by your bank's chargeback scheme. Our website uses a secure, encrypted (HTTPS) connection.",
  },
  {
    question: "Do you charge hidden booking or card fees?",
    answer:
      "No. The total price we quote includes any service fee we charge, and you agree it before you pay. Nothing is added at checkout, and we don't add card surcharges (UK law doesn't allow them on consumer card payments). If an airline charges a fee for a later change or cancellation, we tell you the amount before we act.",
  },
  {
    question: "How do I book by phone or get support?",
    answer:
      "Call or message us on WhatsApp at +44 7417 564704, 24 hours a day, 7 days a week. You can also email info@wickettravel.com. WhatsApp chats are carried by WhatsApp (Meta) under its own terms.",
  },
  {
    question: "Do you also book hotels and car rentals?",
    answer:
      "Flights are our focus. Hotels, resorts, holiday packages and car rentals are booked with and sold by our sister company, Wicket Travel Holidays, under its own terms.",
  },
];
