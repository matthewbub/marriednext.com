import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import RoseSvg from "./RoseSvg";

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

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "MarriedNext.com Marketing/Hero",
  component: Hero,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {};
