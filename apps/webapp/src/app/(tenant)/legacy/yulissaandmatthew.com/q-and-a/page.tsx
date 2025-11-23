import Link from "next/link";
import { getWeddingByDomain } from "@/lib/tenant/getWeddingByDomain";
import { QA } from "@/lib/tenant/weddingData.types";

const defaultFaqs = [
  {
    question: "When and where is the wedding?",
    answer:
      "Our wedding will be held on April 23, 2026, in Temecula, California. The ceremony and reception will both take place at the same venue.",
  },
  {
    question: "What time should I arrive?",
    answer:
      "Please arrive 30 minutes before the ceremony start time to allow for seating. The ceremony will begin promptly at 5:00 PM.",
  },
  {
    question: "What is the dress code?",
    answer:
      "We're asking for semi-formal to formal attire. Think cocktail dresses, dress pants with nice shirts, or suits.",
  },
  {
    question: "Will the ceremony be indoors or outdoors?",
    answer:
      "Our ceremony and reception will both be held outdoors in a beautiful garden setting. We'll have a backup indoor plan in case of bad weather.",
  },
  {
    question: "Are children welcome?",
    answer:
      "While we love your little ones, we've decided to have an adults-only celebration to allow everyone to relax and enjoy the evening.",
  },
  {
    question: "Will there be an open bar?",
    answer:
      "Yes! We'll have a full open bar with beer, wine, and signature cocktails throughout the cocktail hour and reception.",
  },
  {
    question: "What's on the menu?",
    answer: "Check back soon for the menu!",
  },
  {
    question: "When is the RSVP deadline?",
    answer:
      "Please RSVP by February 1st, 2026. This gives us time to finalize catering and seating arrangements.",
  },
  {
    question: "How do I RSVP?",
    html: 'Kindly RSVP by clicking <a href="/#rsvp" class="underline cursor-pointer">here</a> or by reaching out to the bride and groom directly.',
  },
  {
    question: "Can I bring a plus one?",
    answer:
      "Plus ones are indicated on your invitation. If you have any questions about your invitation, please reach out to us directly.",
  },
  {
    question: "What time will the reception end?",
    answer:
      "The reception will go until 10:00 PM. We want everyone to dance the night away with us!",
  },
  {
    question: "Can I take photos during the ceremony?",
    answer:
      "We're having an unplugged ceremony, so please put away cameras and phones during the ceremony. Our photographer will capture everything!",
  },
  {
    question: "Will the venue be wheelchair accessible?",
    answer:
      "Yes, the venue is fully wheelchair accessible. If you have any specific accessibility needs, please let us know.",
  },
  {
    question: "What's the weather like in Temecula in April?",
    answer:
      "April in Temecula is usually beautiful with mild temperatures in the 70s-80s°F. It can get cooler in the evening, so consider bringing a light jacket.",
  },
];

export default async function QAndA() {
  const weddingData = await getWeddingByDomain("yulissaandmatthew");

  if (!weddingData) {
    return null;
  }

  const faqs = (weddingData.fieldQuestionsAndAnswers as QA[]) || [];

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          Q + A
        </h1>

        <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-2xl mx-auto">
            Got questions? We've got answers! Here are some frequently asked
            questions about our wedding day. If you don't see your question
            here, feel free to reach out to us.
          </p>
        </div>

        <div className="space-y-8 mb-20">
          {faqs &&
            faqs.length > 0 &&
            faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-300 pb-6">
                <h3 className="text-2xl font-semibold mb-4">{faq.question}</h3>

                {faq.answer && (
                  <p className="text-lg leading-relaxed text-gray-700">
                    {faq.answer}
                  </p>
                )}

                {faq?.html && (
                  <p
                    className="text-lg leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.html }}
                  />
                )}
              </div>
            ))}
        </div>

        <div className="text-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
