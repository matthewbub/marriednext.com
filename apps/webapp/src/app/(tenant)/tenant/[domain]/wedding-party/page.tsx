import ComingSoon from "@/components/tenant/ComingSoon";

export default function WeddingParty() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          Wedding Party
        </h1>

        <ComingSoon />

        {/* <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            We are so grateful to have these amazing people standing by our side
            on our special day. Each one holds a special place in our hearts and
            has been part of our journey in their own unique way.
          </p>
        </div>

        <div className="mb-20">
          <h2 className="text-5xl mb-12 text-center abramo-script">
            Bridesmaids
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Maid of Honor",
                relationship: "Sister",
              },
              {
                name: "Emily Rodriguez",
                role: "Bridesmaid",
                relationship: "Best Friend",
              },
              {
                name: "Jessica Chen",
                role: "Bridesmaid",
                relationship: "College Roommate",
              },
            ].map((person, i) => (
              <div key={i} className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{person.name}</h3>
                <p className="text-lg text-gray-700 mb-1">{person.role}</p>
                <p className="text-md text-gray-600">{person.relationship}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-5xl mb-12 text-center abramo-script">
            Groomsmen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "David Thompson",
                role: "Best Man",
                relationship: "Brother",
              },
              {
                name: "Michael Brown",
                role: "Groomsman",
                relationship: "Best Friend",
              },
              {
                name: "James Wilson",
                role: "Groomsman",
                relationship: "College Friend",
              },
            ].map((person, i) => (
              <div key={i} className="text-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{person.name}</h3>
                <p className="text-lg text-gray-700 mb-1">{person.role}</p>
                <p className="text-md text-gray-600">{person.relationship}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-5xl mb-12 text-center abramo-script">
            Special Roles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Emma Thompson",
                role: "Flower Girl",
                relationship: "Niece",
              },
              {
                name: "Lucas Garcia",
                role: "Ring Bearer",
                relationship: "Nephew",
              },
              {
                name: "Grace Johnson",
                role: "Junior Bridesmaid",
                relationship: "Cousin",
              },
              {
                name: "Oliver Brown",
                role: "Usher",
                relationship: "Family Friend",
              },
            ].map((person, i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Photo</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                <p className="text-md text-gray-700 mb-1">{person.role}</p>
                <p className="text-sm text-gray-600">{person.relationship}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-4xl mb-8 abramo-script">Thank You</h2>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            To our wedding party: Thank you for your love, support, and
            friendship. We couldn't imagine this day without each and every one
            of you by our side. Your presence means the world to us!
          </p>
        </div> 

        <div className="text-center">
          <a
            href="/"
            className="btn-primary"
          >
            {t.common.backToHome}
          </a>
        </div>
        */}
      </div>
    </div>
  );
}
