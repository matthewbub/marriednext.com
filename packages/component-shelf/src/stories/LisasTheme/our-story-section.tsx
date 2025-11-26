export function OurStorySection() {
  const milestones = [
    {
      date: "June 2018",
      title: "First Meeting",
      description:
        "A chance encounter at a mutual friend's gathering changed everything. We talked for hours and knew something special had begun.",
    },
    {
      date: "December 2019",
      title: "First Trip Together",
      description: "Our adventure to Big Sur solidified what we already knew—we were meant to explore life together.",
    },
    {
      date: "August 2024",
      title: "The Proposal",
      description: "Under the stars at Joshua Tree, Matthew asked the question that would change our lives forever.",
    },
    {
      date: "April 2026",
      title: "Forever Begins",
      description: "Surrounded by our loved ones, we'll say 'I do' and begin our greatest adventure yet.",
    },
  ]

  return (
    <section id="story" className="py-32 bg-[#f5f3eb]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">How It All Began</p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic">Our Story</h2>
        </div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="aspect-[4/5] overflow-hidden">
            <img src="/romantic-couple-engagement-photo-in-nature-golden-.jpg" alt="Yulissa and Matthew" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-[#2c2c2c]/80 font-light leading-relaxed">
              Some love stories are written in the stars. Ours was written in stolen glances, late-night conversations,
              and the quiet certainty that we had found our person.
            </p>
            <p className="text-lg text-[#2c2c2c]/70 leading-relaxed">
              From that first meeting, we knew there was something different—something worth holding onto. Six years
              later, we're ready to make it official, surrounded by the people who matter most to us.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#745656]/20 hidden md:block" />

          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.title}
                className={`relative grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? "" : "md:direction-rtl"}`}
              >
                <div
                  className={`${index % 2 === 0 ? "md:text-right md:pr-16" : "md:text-left md:pl-16 md:col-start-2"}`}
                >
                  <span className="text-[#745656] tracking-[0.2em] uppercase text-sm">{milestone.date}</span>
                  <h3 className="font-serif text-3xl text-[#2c2c2c] mt-2 mb-3 font-light italic">{milestone.title}</h3>
                  <p className="text-[#2c2c2c]/70 leading-relaxed">{milestone.description}</p>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#745656] hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
