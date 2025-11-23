import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { expect, fn, within } from "storybook/test";

import { AddGuestForm } from "@/components/guest-list/AddGuestForm";

const meta = {
  title: "Engaged/AddGuestForm",
  component: AddGuestForm,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AddGuestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
};

export const MaxGuestsReached: Story = {
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "Click Add Another Guest 7 times to reach 8 guests",
      async () => {
        const addButton = canvas.getByRole("button", {
          name: "Add Another Guest",
        });

        for (let i = 0; i < 7; i++) {
          await expect(addButton).toBeEnabled();
          addButton.click();
        }
      }
    );

    await step("Verify maximum guests message appears", async () => {
      const message = canvas.getByText(
        "Maximum of 8 guests per invitation reached"
      );
      await expect(message).toBeInTheDocument();
    });

    await step("Verify Add Another Guest button is disabled", async () => {
      const addButton = canvas.getByRole("button", {
        name: "Add Another Guest",
      });
      await expect(addButton).toBeDisabled();
    });
  },
};

export const RemoveGuestsExceptFirst: Story = {
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Add 7 more guests to reach 8 total", async () => {
      const addButton = canvas.getByRole("button", {
        name: "Add Another Guest",
      });
      for (let i = 0; i < 7; i++) {
        addButton.click();
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    });

    await step("Verify 8 guest inputs exist", async () => {
      const allInputs = canvas.getAllByRole("textbox");
      await expect(allInputs.length).toBe(8);
    });

    await step("Verify first guest cannot be removed", async () => {
      const firstGuestContainer = canvas
        .getByLabelText("Guest 1 Name")
        .closest("div");
      const removeButtons = firstGuestContainer?.querySelectorAll("button");
      await expect(removeButtons?.length || 0).toBe(0);
    });

    await step("Remove 7 guests (guests 2-8)", async () => {
      for (let i = 0; i < 7; i++) {
        const removeButtons = canvas
          .getAllByRole("button")
          .filter((btn) => btn.querySelector("svg"));
        if (removeButtons.length > 0) {
          removeButtons[0].click();
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
    });

    await step("Verify only first guest remains", async () => {
      const firstGuestInput = canvas.getByLabelText("Guest 1 Name");
      await expect(firstGuestInput).toBeInTheDocument();

      const allInputs = canvas.getAllByRole("textbox");
      await expect(allInputs.length).toBe(1);
    });
  },
};

export const PlusOneCheckboxVisibility: Story = {
  args: {
    onSubmit: fn(),
    isSubmitting: false,
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("Verify Plus One checkbox is visible with 1 guest", async () => {
      const plusOneCheckbox = canvas.getByLabelText("Add a Plus One");
      await expect(plusOneCheckbox).toBeInTheDocument();
    });

    await step("Check Plus One checkbox", async () => {
      const plusOneCheckbox = canvas.getByLabelText("Add a Plus One");
      plusOneCheckbox.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await expect(plusOneCheckbox).toHaveAttribute("aria-checked", "true");
    });

    await step("Add a second guest", async () => {
      const addButton = canvas.getByRole("button", {
        name: "Add Another Guest",
      });
      addButton.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await step("Verify Plus One checkbox is hidden with 2 guests", async () => {
      const plusOneCheckbox = canvas.queryByLabelText("Add a Plus One");
      await expect(plusOneCheckbox).not.toBeInTheDocument();
    });

    await step("Remove second guest", async () => {
      const removeButtons = canvas
        .getAllByRole("button")
        .filter((btn) => btn.querySelector("svg"));
      if (removeButtons.length > 0) {
        removeButtons[0].click();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });

    await step("Verify Plus One checkbox reappears with 1 guest", async () => {
      const plusOneCheckbox = canvas.getByLabelText("Add a Plus One");
      await expect(plusOneCheckbox).toBeInTheDocument();
    });
  },
};
