import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do DIY trips work?",
    answer:
      "With DIY trips, you create or join a trip with friends or like-minded travelers. You'll coordinate everything in a shared group chat, log expenses as you go, and split costs transparently. Everyone can see what's been paid and who owes what — then settle up easily via QR payment.",
  },
  {
    question: "How do guided trips work?",
    answer:
      "Guided trips are hosted by verified trip organizers who curate the itinerary, handle logistics, and lead the experience. You pay a deposit to secure your spot, then complete payments based on milestones. Everything — payments, chat, documents — is managed in one place.",
  },
  {
    question: "How do flexible deposits work?",
    answer:
      "For guided trips, you only need to pay a small deposit upfront to reserve your spot. The remaining balance is split into payment milestones leading up to the trip. This makes it easier to budget and commit without paying everything at once.",
  },
  {
    question: "Can I join if I'm traveling solo?",
    answer:
      "Absolutely! Ketravelan is built for solo travelers looking to connect. Whether you join a DIY trip to meet new travel buddies or book a guided trip with a group, you'll always have people to travel with.",
  },
  {
    question: "Does Ketravelan hold my money?",
    answer:
      "For DIY trips, money flows directly between members — Ketravelan just helps you track and split expenses. For guided trips, payments go to the verified host through our secure payment system, with clear records of every transaction.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-border/50 rounded-lg px-4 data-[state=open]:bg-muted/30"
          >
            <AccordionTrigger className="text-sm sm:text-base font-medium text-foreground hover:no-underline py-3 sm:py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs sm:text-sm text-muted-foreground pb-3 sm:pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
