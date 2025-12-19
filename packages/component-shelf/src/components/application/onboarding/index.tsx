import { OnboardingFlow, type OnboardingFlowProps } from "./onboarding-flow";
import { StoreProvider } from "./store-provider";
import type { OnboardingFormData, Step3FormData } from "./step-3-venue-info";

export type { Step3FormData };

export type OnboardingPageProps = {
  onHandleGoToDashboard: OnboardingFlowProps["onHandleGoToDashboard"];
  link: OnboardingFlowProps["link"];
  onSubmit?: OnboardingFlowProps["onSubmit"];
  onSkip?: OnboardingFlowProps["onSkip"];
  validateSubdomain: OnboardingFlowProps["validateSubdomain"];
};

export { type OnboardingFormData };

export default function OnboardingPage({
  onHandleGoToDashboard,
  link,
  onSubmit,
  onSkip,
  validateSubdomain,
}: OnboardingPageProps) {
  return (
    <StoreProvider>
      <OnboardingFlow
        onHandleGoToDashboard={onHandleGoToDashboard}
        link={link}
        onSubmit={onSubmit}
        onSkip={onSkip}
        validateSubdomain={validateSubdomain}
      />
    </StoreProvider>
  );
}
