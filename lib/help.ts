/**
 * Help centre content (app/help). One source for the visible answers and the
 * FAQPage JSON-LD, so the structured data always matches what people read.
 *
 * An answer is a list of segments: plain text, or a link. The page renders
 * links; the JSON-LD flattens every answer to plain text (helpAnswerText).
 *
 * Everything here describes Wicket Travel's own model — Wicket Travel Limited
 * books flights on the customer's behalf as a travel agent (lib/legal.ts
 * BOOKING_DISCLOSURE). It states only the positions agreed for the legal
 * pages: no fee amounts and no timeframes beyond those. Keep it in step with
 * /terms, /refunds, /complaints, /visa-terms and /parent-travel-assist-terms.
 */
import { PORTAL_LOGIN_URL, PORTAL_BOOKING_URL } from "@/lib/links";
import { BUSINESS } from "@/lib/seo";

export type HelpSegment = string | { text: string; href: string };

export type HelpItem = {
  /** Anchor id, unique across the page. */
  id: string;
  question: string;
  answer: HelpSegment[];
};

export type HelpTopic = {
  id: string;
  title: string;
  summary: string;
  items: HelpItem[];
};

const WA = `WhatsApp ${BUSINESS.phoneDisplay}`;

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "booking",
    title: "Booking with us",
    summary: "How a booking works, from request to ticket.",
    items: [
      {
        id: "how-booking-works",
        question: "How does booking a flight with Wicket Travel work?",
        answer: [
          "Send us your route, dates and travellers through our ",
          { text: "booking portal", href: PORTAL_BOOKING_URL },
          `, on ${WA} or by phone. A consultant finds the options and quotes you a total price with the main fare rules (baggage, changes and refunds). We book only once you agree and pay. Wicket Travel Limited makes the booking with the airline on your behalf as a travel agent; the airline issues your e-ticket and operates the flight. The full details are in our `,
          { text: "terms and conditions", href: "/terms" },
          ".",
        ],
      },
      {
        id: "who-contract",
        question: "Who is my booking with?",
        answer: [
          "You book with Wicket Travel Limited, which arranges the ticket with the airline for you. The airline carries you under its own conditions of carriage and fare rules, and those apply to your flight. Hotels, car hire and holidays are sold by our sister company, Wicket Travel Holidays, under its own terms.",
        ],
      },
      {
        id: "need-account",
        question: "Do I need an account?",
        answer: [
          "You can ask for a quote by WhatsApp or phone without one. If you book through the portal, your account keeps your quote, messages, payment status and travel documents in one place. Already have one? ",
          { text: "Sign in to the portal", href: PORTAL_LOGIN_URL },
          ".",
        ],
      },
      {
        id: "names-documents",
        question: "What do I need to check before I book?",
        answer: [
          "Every traveller's name must match their passport exactly, and each traveller needs a valid passport plus any visa or entry permission the trip requires. We check the details you give us, but you remain responsible for your travel documents. Please read the quote and fare rules before you agree.",
        ],
      },
      {
        id: "atol",
        question: "Is my flight ATOL protected?",
        answer: [
          "No. Wicket Travel Limited does not hold an ATOL licence and does not sell package holidays, so flight-only bookings made with us are not ATOL protected. If you pay by credit card and the cost is over £100 and up to £30,000, you may have extra protection from your card provider under section 75 of the Consumer Credit Act; debit card payments may be covered by your bank's chargeback scheme.",
        ],
      },
    ],
  },
  {
    id: "payment",
    title: "Prices and payment",
    summary: "What the price includes and how to pay.",
    items: [
      {
        id: "price-includes",
        question: "Does the price you quote include everything?",
        answer: [
          "Yes. The total we quote includes the airline fare, taxes and any service fee we charge. We tell you the total before you pay, and we don't add card surcharges or other fees at the end.",
        ],
      },
      {
        id: "price-change",
        question: "Can the price change after you quote it?",
        answer: [
          "Airline fares change as seats sell, so a quote can change until the booking is made. If the fare goes up before we book, we tell you the new total and only go ahead if you agree. Once your booking is paid and ticketed, the price is fixed.",
        ],
      },
      {
        id: "how-to-pay",
        question: "How can I pay?",
        answer: [
          "By card or by bank transfer. For some bookings we can take a deposit first; your consultant will tell you if that's possible and when the balance is due. We confirm how to pay with your quote, and your payment status shows in the portal.",
        ],
      },
      {
        id: "card-safety",
        question: "Is it safe to pay by card?",
        answer: [
          "Card payments are taken by our payment provider. We never ask for your full card number by WhatsApp, email or phone. If anyone asks you for card details claiming to be from Wicket Travel, contact us before you pay.",
        ],
      },
    ],
  },
  {
    id: "tickets",
    title: "Tickets and documents",
    summary: "When your ticket is issued and where to find it.",
    items: [
      {
        id: "when-ticket",
        question: "When will I get my e-ticket?",
        answer: [
          "We usually issue your e-ticket the same day your payment clears. You'll receive it by email, and it is posted to your portal thread if you booked there.",
        ],
      },
      {
        id: "confirmed",
        question: "When is my booking confirmed?",
        answer: [
          "When you have an e-ticket number. A quote, a reservation or a payment receipt on its own is not a confirmed booking, because the seat and fare aren't guaranteed until the airline issues the ticket.",
        ],
      },
      {
        id: "no-email",
        question: "I haven't received my e-ticket email",
        answer: [
          "Check your spam or junk folder first, then sign in to the ",
          { text: "portal", href: PORTAL_LOGIN_URL },
          ` to see your documents. Still nothing? Message us on ${WA} or email ${BUSINESS.email} with your name and route.`,
        ],
      },
      {
        id: "check-booking",
        question: "How do I check my booking with the airline?",
        answer: [
          "Use the booking reference (PNR) on your e-ticket with the airline's \"manage booking\" page. Online check-in, seat selection and paid extras are usually done there.",
        ],
      },
    ],
  },
  {
    id: "changes",
    title: "Changes, cancellations and refunds",
    summary: "Changing or cancelling, and how refunds are paid.",
    items: [
      {
        id: "change-cancel",
        question: "How do I change or cancel my booking?",
        answer: [
          "Contact us with your booking reference. We ask the airline for you, and what's possible depends on your fare rules. If the airline charges a fee or a fare difference, or if we charge an admin fee, we tell you the amount before we do anything, and only go ahead if you agree.",
        ],
      },
      {
        id: "refund-time",
        question: "How long does a refund take?",
        answer: [
          "Airlines decide refunds under their fare rules and can take several weeks or more to pay them. We pay you back within 14 days of receiving the money from the airline, to your original payment method. See our ",
          { text: "refund policy", href: "/refunds" },
          ".",
        ],
      },
      {
        id: "airline-cancelled",
        question: "The airline cancelled or changed my flight. What now?",
        answer: [
          "Tell us straight away. We'll help you choose between the options the airline offers, such as a new flight or a refund. For some flights you may also be entitled to care or compensation from the airline under UK or EU air passenger rights; that claim is made against the airline.",
        ],
      },
      {
        id: "non-refundable",
        question: "What if my ticket is non-refundable?",
        answer: [
          "You may still be able to get back unused government taxes and airport charges. Ask us and we'll check your fare rules.",
        ],
      },
      {
        id: "complaint",
        question: "How do I make a complaint?",
        answer: [
          "Email us or message us with what went wrong and your booking reference. We acknowledge complaints within 2 working days and send a full reply within 14 days. Our ",
          { text: "complaints procedure", href: "/complaints" },
          " explains each step and how to escalate if you're not happy with our answer.",
        ],
      },
    ],
  },
  {
    id: "baggage",
    title: "Baggage, check-in and special assistance",
    summary: "Bags, check-in and help at the airport.",
    items: [
      {
        id: "baggage-allowance",
        question: "How much baggage can I take?",
        answer: [
          "It depends on the airline and the fare. We show the allowance with your quote, and it's printed on your e-ticket. Extra bags are usually cheaper added before you fly; ask us or use the airline's manage booking page.",
        ],
      },
      {
        id: "check-in",
        question: "How do I check in?",
        answer: [
          "Most airlines open online check-in 24 to 48 hours before departure, using your booking reference and surname. Airport check-in and bag-drop deadlines are set by each airline, so check them before you travel.",
        ],
      },
      {
        id: "assistance",
        question: "Can you arrange wheelchair or special assistance?",
        answer: [
          "Yes. Tell us when you book, or as soon as you can before you fly (ideally at least 48 hours before), and we'll ask the airline to add it to the booking. Airport assistance in the UK is provided free by the airport.",
        ],
      },
      {
        id: "parent-companion",
        question: "My parent is flying alone. Can someone travel with them?",
        answer: [
          "Our ",
          { text: "Parent Travel Assist", href: "/parents-tickets" },
          " service introduces families to travellers flying the same route who are willing to help. It works alongside airline assistance, not instead of it.",
        ],
      },
    ],
  },
  {
    id: "visa",
    title: "Dubai visa service",
    summary: "How our UAE visa help works.",
    items: [
      {
        id: "visa-what",
        question: "What does your visa service do?",
        answer: [
          "We help you apply for a UAE tourist or visit visa: we check your eligibility, tell you which documents you need, review them and submit the application for you. We are not part of the UAE government, and the UAE authorities decide every application.",
        ],
      },
      {
        id: "visa-guarantee",
        question: "Can you guarantee my visa will be approved?",
        answer: [
          "No one can. The decision belongs to the UAE authorities. We check eligibility before you pay so you know where you stand before you commit.",
        ],
      },
      {
        id: "visa-fees",
        question: "What does it cost, and what if my visa is refused?",
        answer: [
          "We tell you the full cost in writing before you pay: the government fee and our service fee. What happens to each if a visa is refused is set out in our ",
          { text: "visa service terms", href: "/visa-terms" },
          ".",
        ],
      },
      {
        id: "visa-documents",
        question: "How do you handle my passport and documents?",
        answer: [
          "We use them only for your application, keep them securely and delete them once they're no longer needed. Our ",
          { text: "privacy policy", href: "/privacy" },
          " explains how long we keep them.",
        ],
      },
    ],
  },
  {
    id: "parent-travel-assist",
    title: "Parent Travel Assist",
    summary: "Introductions between families and travellers.",
    items: [
      {
        id: "pta-what",
        question: "What is Parent Travel Assist?",
        answer: [
          "A free service that introduces families whose relatives are flying alone to travellers on the same route who are willing to help. We make introductions only: we don't employ the helpers, and the arrangement is between the family and the traveller. See the ",
          { text: "Parent Travel Assist terms", href: "/parent-travel-assist-terms" },
          ".",
        ],
      },
      {
        id: "pta-checks",
        question: "Are helpers background-checked?",
        answer: [
          "No. A coordinator reviews every post and confirms the traveller is booked on the route, but this is not a criminal-records or DBS check. Families always make the final decision, and we can arrange a call between both sides first.",
        ],
      },
      {
        id: "pta-payment",
        question: "Who handles any payment between us?",
        answer: [
          "You do, directly. Wicket Travel doesn't hold, process or take a share of any amount you agree, and there is no fee to post or be introduced.",
        ],
      },
      {
        id: "pta-concern",
        question: "How do I report a safety concern?",
        answer: [
          `If anyone is in immediate danger, call 999 (or the local emergency number). Otherwise message us on ${WA} or email ${BUSINESS.email} as soon as you can, and we'll act on it, including removing a post or a person from the service.`,
        ],
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy, cookies and contact",
    summary: "Your data, cookie choices and how to reach us.",
    items: [
      {
        id: "data-use",
        question: "What do you do with my personal data?",
        answer: [
          "We use it to answer your enquiries and to make and manage your bookings, and we share traveller details with the airline that issues your ticket. We don't sell your data. Our ",
          { text: "privacy policy", href: "/privacy" },
          " has the full details, including how to see, correct or delete your data.",
        ],
      },
      {
        id: "cookies",
        question: "How do I change my cookie choices?",
        answer: [
          "Use \"Cookie settings\" at the bottom of any page. Our ",
          { text: "cookie policy", href: "/cookie-policy" },
          " lists what we use.",
        ],
      },
      {
        id: "whatsapp",
        question: "Is WhatsApp private?",
        answer: [
          "Chats with us are carried by WhatsApp (Meta) under WhatsApp's own terms and privacy policy. Please don't send card numbers by WhatsApp.",
        ],
      },
      {
        id: "contact",
        question: "How can I contact you?",
        answer: [
          `Message or call us on ${WA}, email ${BUSINESS.email}, or use our `,
          { text: "contact form", href: "/contact" },
          ".",
        ],
      },
    ],
  },
];

/** An answer as plain text, for search and the FAQPage JSON-LD. */
export function helpAnswerText(answer: HelpSegment[]): string {
  return answer.map((s) => (typeof s === "string" ? s : s.text)).join("");
}
