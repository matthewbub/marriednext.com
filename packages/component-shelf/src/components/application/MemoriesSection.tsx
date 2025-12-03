import { Camera, Upload, Share2 } from "lucide-react"

export function ApplicationMemoriesSection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/marketing/asdrubal-luna-gcJLa12Mb-c-unsplash.jpg" alt="Wedding celebration" className="w-full h-auto" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/marketing/jeferson-santu-5hEJVatOYVo-unsplash.jpg" alt="First dance" className="w-full h-auto" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/marketing/leonardo-miranda-ynfRit2XT4c-unsplash.jpg" alt="Wedding ceremony" className="w-full h-auto" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/marketing/pedro-pulido-G6Yu0BWnggE-unsplash.jpg" alt="Cake cutting" className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-card rounded-xl shadow-xl p-3 border border-border">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">247 photos shared</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">After the Big Day</span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl font-medium text-foreground text-balance">
              Collect memories from everyone
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Your guests captured moments you'll never see — until now. Let everyone upload their photos to one
              beautiful gallery. No app downloads, no sign-ups, just memories.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                <Upload className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Easy Uploads</p>
                  <p className="text-xs text-muted-foreground">QR code or link sharing</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary">
                <Share2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Share Gallery</p>
                  <p className="text-xs text-muted-foreground">Download or share anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
