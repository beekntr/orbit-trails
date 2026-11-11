import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  Car,
  Check,
  Download,
  HandHeart,
  HeartPulse,
  Luggage,
  ShieldCheck,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/FaqList";
import Seo from "@/components/seo/Seo";
import SmartImage from "@/components/SmartImage";
import TrustBanner from "@/components/trust/TrustBanner";
import { openLeadMagnet } from "@/components/lead/leadMagnet";
import { firstTimeGuideFaqs } from "@/data/faqs";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";

const PATH = "/india-travel-guide-first-time-visitors";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=70";
/** Update both whenever the guide is reviewed. Visa and health rules change. */
const LAST_REVIEWED = { iso: "2026-11-10", label: "November 2026" };
const OFFICIAL_EVISA_URL = "https://indianvisaonline.gov.in/evisa/";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "First-Time India Travel Guide", path: PATH },
];

const quickFacts = [
  { label: "Best time to visit", value: "October to March (North India)" },
  { label: "Visa", value: "e-Visa for most nationalities, applied for online before travel" },
  { label: "Currency", value: "Indian rupee (INR). Cards in hotels, cash for small purchases" },
  { label: "Language", value: "English is widely spoken in tourist areas" },
  { label: "Time zone", value: "India Standard Time, UTC+5:30, no daylight saving" },
  { label: "Electricity", value: "230V. Plug types C, D and M: bring a universal adaptor" },
  { label: "Drinking water", value: "Bottled or filtered only, never from the tap" },
  { label: "Emergency number", value: "112. Tourist helpline: 1363" },
];

interface GuideSection {
  id: string;
  nav: string;
  title: string;
  icon: LucideIcon;
  /** The direct answer, shown first. This is the text search engines tend to quote. */
  answer: string;
  body: ReactNode;
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3 text-gray-700">
          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mt-8 text-xl font-semibold text-secondary">{children}</h3>;
}

const sections: GuideSection[] = [
  {
    id: "visa",
    nav: "Visa & entry",
    title: "Do I need a visa for India?",
    icon: Stamp,
    answer:
      "Almost every foreign visitor needs a visa to enter India. Travellers from the US, UK, Canada, Australia and most of Europe can usually apply online for an e-Visa before they fly, without visiting an embassy.",
    body: (
      <>
        <SubHeading>How the India e-Visa works</SubHeading>
        <Bullets
          items={[
            <>
              Apply only on the official government website,{" "}
              <a href={OFFICIAL_EVISA_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline">
                indianvisaonline.gov.in
              </a>
              . Many lookalike sites charge a large fee to submit the same form for you.
            </>,
            "Apply at least four days before you arrive. A week or two ahead is more comfortable.",
            "The e-Tourist Visa is offered for 30 days, one year or five years. A 30-day visa suits most first trips.",
            "Your passport should be valid for at least six months from your arrival date and have two blank pages.",
            "You will upload a passport-style photo and a scan of your passport's photo page, and pay online.",
            "Print the approval (the Electronic Travel Authorisation) and carry it with your passport. The visa itself is stamped on arrival.",
          ]}
        />
        <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-gray-700">
          Visa rules, fees and eligible nationalities change. Always confirm the current
          requirements for your passport on the official website before you book flights.
        </p>
      </>
    ),
  },
  {
    id: "safety",
    nav: "Safety",
    title: "Is India safe for tourists?",
    icon: ShieldCheck,
    answer:
      "Yes, India is safe for tourists who take sensible precautions. Violent crime against visitors is rare. The problems travellers actually meet are petty theft, persistent touts, tourist scams and chaotic road traffic.",
    body: (
      <>
        <SubHeading>Everyday precautions</SubHeading>
        <Bullets
          items={[
            "Use pre-arranged cars or app-based taxis rather than hailing a vehicle on the street, especially at night.",
            "Keep your passport, spare cards and most of your cash in the hotel safe. Carry a photocopy of your passport.",
            "In crowds and at railway stations, wear your bag across your body and keep your phone out of back pockets.",
            "Traffic does not stop for pedestrians. Cross with a group of locals and keep a steady pace.",
          ]}
        />
        <SubHeading>Common scams to recognise</SubHeading>
        <Bullets
          items={[
            "A driver insists your hotel has closed, burned down or is overbooked, and offers to take you to another. It has not. Call the hotel.",
            "A helpful stranger directs you to an “official tourist office” that is really a private travel agency.",
            "A gem dealer, often in Jaipur, invites you to carry stones home to resell at a profit. There is no profit.",
            "Unofficial “guides” at monuments attach themselves to you and demand payment at the end. Licensed guides carry government ID.",
          ]}
        />
        <SubHeading>Advice for solo and female travellers</SubHeading>
        <Bullets
          items={[
            "Dress conservatively, with shoulders and knees covered. It noticeably reduces unwanted attention.",
            "Avoid walking alone in quiet areas after dark, and arrive in a new city during daylight where you can.",
            "The Delhi Metro reserves a carriage for women on every train.",
            "A private car with a vetted driver removes most of the situations solo travellers worry about. It is the main reason first-time visitors choose a private tour.",
          ]}
        />
      </>
    ),
  },
  {
    id: "health",
    nav: "Health & water",
    title: "How do I stay healthy in India?",
    icon: HeartPulse,
    answer:
      "Drink only sealed bottled or filtered water, eat freshly cooked food served hot, and wash or sanitise your hands before every meal. Those three habits prevent most stomach upsets, which are by far the most common illness among visitors.",
    body: (
      <>
        <SubHeading>Water and food</SubHeading>
        <Bullets
          items={[
            "Never drink tap water, and use bottled or filtered water to brush your teeth. Check that the seal on a bottle is intact.",
            "Skip ice and cut fruit from street stalls. Fruit you peel yourself is fine.",
            "Choose busy restaurants where food is cooked to order. A fast turnover is the best sign of freshness.",
            "Go gently for the first two days: your stomach needs time to adjust to richer, spicier food.",
            "Pack oral rehydration salts and a remedy for an upset stomach, and ask your doctor what else to carry.",
          ]}
        />
        <SubHeading>Before you travel</SubHeading>
        <Bullets
          items={[
            "See your doctor or a travel clinic six to eight weeks before departure for advice on vaccinations. Hepatitis A and typhoid are commonly discussed, alongside routine boosters.",
            "Ask whether malaria tablets are advised for the regions and season you are visiting, and bring insect repellent either way.",
            "Carry prescription medicines in their original packaging with a copy of the prescription.",
            "Take out travel insurance that covers medical treatment and evacuation. Private hospitals in major cities are good, but expect to pay up front.",
          ]}
        />
        <SubHeading>Heat and air quality</SubHeading>
        <Bullets
          items={[
            "From April to June, temperatures in North India often pass 40°C (104°F). Sightsee early, rest at midday and drink more water than you think you need.",
            "Air quality in Delhi is at its worst from November to January. If you have asthma or a heart condition, bring a well-fitting mask and keep your Delhi stay short.",
          ]}
        />
      </>
    ),
  },
  {
    id: "money",
    nav: "Money & tipping",
    title: "How does money work in India?",
    icon: Banknote,
    answer:
      "India's currency is the rupee (INR). Hotels, larger restaurants and established shops accept international cards, but you will need cash for markets, small shops, tips and entry tickets at smaller sights.",
    body: (
      <>
        <Bullets
          items={[
            "Withdraw rupees from an ATM at the airport or in any city. Bank ATMs are widespread, though each withdrawal is capped, so expect to use them more than once.",
            "Tell your bank you are travelling, and bring two cards from different networks in case one is declined.",
            "Keep a supply of small notes. Change for large notes is often hard to find.",
            "Tipping is customary. Around 10% is usual in restaurants when no service charge has been added, and drivers, guides and hotel porters expect a tip for good service. Ask us for current guideline amounts.",
            "Bargaining is expected in markets and with street vendors, but not in shops with fixed prices. Keep it friendly.",
          ]}
        />
      </>
    ),
  },
  {
    id: "etiquette",
    nav: "Culture & etiquette",
    title: "What cultural etiquette should I know in India?",
    icon: HandHeart,
    answer:
      "Dress modestly, remove your shoes before entering temples, mosques and homes, and use your right hand to eat, pay and pass things to other people. Indians are warm hosts, and a little effort is noticed and appreciated.",
    body: (
      <>
        <SubHeading>At religious sites</SubHeading>
        <Bullets
          items={[
            "Cover your shoulders and knees. Carry a light scarf: you must cover your head in Sikh gurdwaras and in some mosques and shrines.",
            "Leave your shoes at the entrance. Slip-on shoes and a pair of socks for hot stone floors make this easier.",
            "Leather items such as belts and wallets are not allowed inside Jain temples.",
            "Ask before photographing worshippers or ceremonies, and follow any signs that prohibit cameras.",
          ]}
        />
        <SubHeading>With people</SubHeading>
        <Bullets
          items={[
            "Greet people with “Namaste”, palms pressed together. Handshakes are common in business and between men.",
            "The left hand is considered unclean. Eat and hand over money with your right.",
            "Avoid pointing the soles of your feet at people or at religious images.",
            "Keep public displays of affection minimal. Holding hands is fine; kissing in public is frowned upon.",
            "Always ask before taking someone's photograph. Most people will happily agree.",
            "The side-to-side head wobble usually means “yes”, “okay” or “I understand”.",
          ]}
        />
      </>
    ),
  },
  {
    id: "getting-around",
    nav: "Getting around",
    title: "What is the best way to get around India?",
    icon: Car,
    answer:
      "For a first visit, a private car with a driver is the most comfortable and flexible way to travel between cities in North India. Use domestic flights for long distances and trains for a few scenic or high-speed routes.",
    body: (
      <>
        <Bullets
          items={[
            "Distances are larger than they look, and average road speeds are low. Delhi to Agra takes about three and a half hours, and Jaipur to Jodhpur close to six.",
            "A private driver stays with you for the whole route, handles luggage and parking, and can stop wherever you like. Self-drive is not recommended for visitors.",
            "Fast daytime trains link Delhi with Agra and Jaipur. Book well ahead: popular trains sell out weeks in advance.",
            "Domestic flights save a full day on long legs such as Udaipur to Delhi or Delhi to Varanasi.",
            "Plan two to three nights in each place. Changing hotels every night is the most common mistake in a first India itinerary.",
          ]}
        />
      </>
    ),
  },
  {
    id: "when-to-go",
    nav: "When to go",
    title: "When is the best time to visit India?",
    icon: CalendarDays,
    answer:
      "October to March is the best time to visit North India, including Delhi, Agra and Rajasthan. Days are warm, dry and sunny, and nights are cool.",
    body: (
      <>
        <Bullets
          items={[
            <><strong>October and November:</strong> warm days after the monsoon, green landscapes and the festival of Diwali.</>,
            <><strong>December to February:</strong> the most comfortable sightseeing weather and the busiest season. Book hotels early, and expect morning fog in Delhi and Agra.</>,
            <><strong>March:</strong> warming up, with the festival of Holi. A good month for tiger sightings.</>,
            <><strong>April to June:</strong> very hot. Hotel rates fall sharply, and wildlife is easier to see around water.</>,
            <><strong>July to September:</strong> monsoon. Expect heavy showers, high humidity and some national park closures.</>,
            "The Taj Mahal is closed every Friday, all year. Plan your day in Agra around it.",
          ]}
        />
      </>
    ),
  },
  {
    id: "packing",
    nav: "What to pack",
    title: "What should I pack for India?",
    icon: Luggage,
    answer:
      "Pack light, loose clothing that covers your shoulders and knees, comfortable walking shoes that slip off easily, sun protection and a warm layer for winter mornings and evenings.",
    body: (
      <>
        <Bullets
          items={[
            "Breathable cotton or linen clothing, and a scarf or shawl for temples and air-conditioned cars",
            "A fleece or light jacket from November to February, when mornings can be cold",
            "Slip-on shoes or sandals, plus socks for temple floors",
            "Sunscreen, sunglasses, a hat and insect repellent",
            "Hand sanitiser, tissues and any personal medication",
            "A universal travel adaptor and a power bank",
            "Printed copies of your e-Visa approval, passport, insurance and flight details",
          ]}
        />
      </>
    ),
  },
];

export default function FirstTimeIndiaGuide() {
  return (
    <>
      <Seo
        title="India Travel Guide for First-Time Visitors | Orbit Trails"
        description="A practical first-time India travel guide: visas, safety, health and water, money, etiquette, when to go and what to pack, from a Jaipur tour operator."
        path={PATH}
        image={HERO_IMAGE}
        type="article"
        article={{ modifiedTime: LAST_REVIEWED.iso }}
        jsonLd={[
          articleSchema({
            title: "India Travel Guide for First-Time Visitors",
            description:
              "Visas, safety, health and water, money, cultural etiquette, transport, seasons and packing advice for a first trip to India.",
            path: PATH,
            image: HERO_IMAGE,
            dateModified: LAST_REVIEWED.iso,
          }),
          breadcrumbSchema(crumbs),
          faqSchema(firstTimeGuideFaqs),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-secondary">
        <SmartImage
          src={HERO_IMAGE}
          alt="The Taj Mahal at sunrise, the highlight of most first trips to India"
          priority
          sizes="100vw"
          fallbackSrc={null}
          className="absolute inset-0 -z-10 h-full w-full bg-secondary object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-secondary/80" />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 md:py-24 lg:px-8">
          <Breadcrumbs crumbs={crumbs} inverted className="mb-6 flex justify-center" />
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            India Travel Guide for First-Time Visitors
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-200">
            Visas, safety, health, money and etiquette, explained plainly by the team that
            welcomes travellers from around the world to India every week.
          </p>
          <p className="mt-4 text-sm text-gray-300">
            By the Orbit Trails travel team, Jaipur · Last reviewed{" "}
            <time dateTime={LAST_REVIEWED.iso}>{LAST_REVIEWED.label}</time>
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section className="bg-white py-14" aria-labelledby="at-a-glance">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="at-a-glance" className="text-2xl font-bold text-secondary md:text-3xl">
            India at a glance
          </h2>
          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex flex-col border-b border-gray-200 py-3">
                <dt className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-gray-800">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Guide body */}
      <div className="bg-gray-50 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {/* Table of contents */}
          <aside className="lg:col-span-1">
            <nav
              aria-label="In this guide"
              className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                In this guide
              </h2>
              <ol className="mt-3 space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary"
                    >
                      {section.nav}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#faq" className="block rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary">
                    FAQs
                  </a>
                </li>
              </ol>
              <Button
                type="button"
                onClick={() => openLeadMagnet("guide-sidebar")}
                className="mt-5 w-full bg-accent hover:bg-accent/90"
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Free route planner
              </Button>
            </nav>
          </aside>

          <article className="space-y-8 lg:col-span-3">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-xl bg-white p-6 shadow-sm md:p-10"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <section.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="text-2xl font-bold text-secondary md:text-3xl">{section.title}</h2>
                </div>
                <p className="mt-5 border-l-4 border-primary bg-primary/5 p-4 text-lg leading-relaxed text-gray-800">
                  {section.answer}
                </p>
                {section.body}

                {/* Mid-article offer after the health section */}
                {index === 2 && (
                  <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl bg-secondary p-6 text-white md:flex-row md:items-center">
                    <div>
                      <p className="text-lg font-semibold">
                        Planning your route? Take our 14-day North India planner.
                      </p>
                      <p className="mt-1 text-sm text-gray-300">
                        Delhi, Agra, Ranthambore, Jaipur, Jodhpur and Udaipur, day by day. Free PDF.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => openLeadMagnet("guide-inline")}
                      className="shrink-0 bg-accent hover:bg-accent/90"
                    >
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      Download the planner
                    </Button>
                  </div>
                )}
              </section>
            ))}

            {/* FAQ */}
            <section id="faq" className="scroll-mt-24">
              <h2 className="mb-6 text-2xl font-bold text-secondary md:text-3xl">
                First trip to India: frequently asked questions
              </h2>
              <FaqList items={firstTimeGuideFaqs} />
            </section>

            {/* Next step */}
            <section className="rounded-xl bg-white p-6 shadow-sm md:p-10">
              <h2 className="text-2xl font-bold text-secondary md:text-3xl">
                The easiest way to see India for the first time
              </h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                Most of the worries in this guide (transport, touts, where to eat, which hotel
                to trust) disappear when someone on the ground has arranged the trip for you.
                That is what a private tour is for. Browse our{" "}
                <Link to="/luxury-private-tours-india" className="font-medium text-primary hover:underline">
                  luxury private tours of India
                </Link>
                , see the{" "}
                <Link to="/tours" className="font-medium text-primary hover:underline">
                  Golden Triangle and Rajasthan itineraries
                </Link>{" "}
                first-time visitors choose most, or tell us what you have in mind.
              </p>
              <Button asChild size="lg" className="mt-6 bg-accent hover:bg-accent/90">
                <Link to="/plan-my-trip">
                  Plan my first trip to India
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </section>
          </article>
        </div>
      </div>

      <TrustBanner />
    </>
  );
}
