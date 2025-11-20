import type { Preview } from "@storybook/react-vite";
import "../src/styles/defaults.css";
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from "storybook/viewport";

const preview: Preview = {
  parameters: {
    // theme: {
    //   description: "Global theme for components",
    //   toolbar: {
    //     // The label to show for this toolbar item
    //     title: "Theme",
    //     icon: "circlehollow",
    //     // Array of plain string values or MenuItem shape (see below)
    //     items: ["light", "dark"],
    //     // Change title based on selected value
    //     dynamicTitle: true,
    //   },
    // },
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
