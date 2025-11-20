import type { Meta, StoryObj } from "@storybook/react-vite";

export const Hero = () => {
  return (
    <div className="mn-shell mn-hero">
      <div className="mn-heroshell">
        <div className="mn-hero-leftside">
          <div className="mn-hero-leftsideshell">
            <h2 className="mn-hero-bigtext">
              {"Getting Married Has Never Been So Simple."}
            </h2>
            <span className="mn-hero-subtext">
              {
                "You’re going to love what we’ve put together for your special day."
              }
            </span>

            <div className="mn-hero-buttonsgroup">
              <a className="mn-large-button mn-primary-button">Get Started</a>
              <a className="mn-large-button mn-outline-button">
                Explore Templates
              </a>
            </div>
          </div>
        </div>

        <div className="mn-hero-rightside">
          <div className="mn-hero-imageshell">
            <img
              className="mn-hero-image"
              src="https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/marketing/rose.png"
              alt="Hero Image"
            />
          </div>
          <div className="mn-hero-fancytextgroup">
            <span className="mn-hero-fancytext1">
              Handcrafted Wedding Websites
            </span>
            <span className="mn-hero-fancytext2">
              Open Source{" "}
              <span className="mn-hero-fancytext3">(Community)</span>
            </span>
            <span className="mn-hero-fancytext4">Version 0.0.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "MarriedNext.com Marketing/Hero",
  component: Hero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
