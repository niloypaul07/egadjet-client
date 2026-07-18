export default function AboutPage() {
  const team = [
    { name: 'Arif Hassan', role: 'CEO & Founder', bio: '15 years in consumer electronics retail across South Asia.' },
    { name: 'Nusrat Jahan', role: 'Head of AI', bio: 'Former ML engineer specializing in conversational commerce systems.' },
    { name: 'Imran Chowdhury', role: 'Head of Operations', bio: 'Expert in supply chain logistics and warehouse management.' },
    { name: 'Farhana Akter', role: 'Customer Experience Lead', bio: 'Passionate about delivering exceptional post-purchase support.' },
  ];

  const milestones = [
    { year: '2021', event: 'eGadjet founded in Dhaka with a vision to democratize premium tech access.' },
    { year: '2022', event: 'Expanded to nationwide delivery with 3 warehouse hubs across Bangladesh.' },
    { year: '2023', event: 'Launched AI Shopping Assistant, serving 5,000+ personalized recommendations monthly.' },
    { year: '2024', event: 'Reached 12,500+ happy customers and 12+ premium brand partnerships.' },
    { year: '2025', event: 'Introduced seller marketplace allowing verified users to list authentic gadgets.' },
  ];

  return (
    <div>
      <section className="bg-slate py-20 text-white">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">About eGadjet</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Bangladesh&apos;s first AI-powered gadget marketplace, connecting tech enthusiasts with premium
            devices through intelligent recommendations and trusted service.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-main grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-slate-muted">
              At eGadjet, we believe everyone deserves access to premium technology without the confusion of
              endless product comparisons. Our mission is to simplify gadget shopping through AI-powered
              personalization, verified authenticity, and exceptional customer service.
            </p>
            <p className="mt-4 leading-relaxed text-slate-muted">
              Founded in Dhaka, we serve customers across Bangladesh with same-day delivery in major cities and
              express nationwide shipping. Every product in our catalog is sourced from authorized distributors
              with full manufacturer warranty.
            </p>
          </div>
          <div className="card-base p-8">
            <h3 className="text-xl font-bold text-slate">Why We Built eGadjet</h3>
            <ul className="mt-6 space-y-4">
              {[
                'Eliminate fake products from the Bangladeshi gadget market',
                'Make tech specs understandable for everyday consumers',
                'Provide AI-driven recommendations instead of generic search results',
                'Build a community of verified sellers and trusted buyers',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-muted">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-main">
          <h2 className="section-title text-center">Our Journey</h2>
          <div className="mx-auto mt-12 max-w-2xl">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative flex gap-6 pb-10 last:pb-0">
                {i < milestones.length - 1 && (
                  <div className="absolute left-[27px] top-10 h-full w-0.5 bg-slate/10" />
                )}
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {m.year}
                </div>
                <div className="pt-3">
                  <p className="text-sm leading-relaxed text-slate-muted">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-main">
          <h2 className="section-title text-center">Meet the Team</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="card-base p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-semibold text-slate">{member.name}</h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-2 text-xs text-slate-muted">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
