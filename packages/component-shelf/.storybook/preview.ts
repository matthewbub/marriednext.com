import type { Preview } from "@storybook/react-vite";
import "style-shelf/styles";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";

const preview: Preview = {
  parameters: {
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
    controls: {
      disableSaveFromUI: true,
    },
  },
  initialGlobals: {
    viewport: { value: "desktop" },
  },
};

export default preview;
