import { OnboardingFlow, type OnboardingFlowProps } from "./onboarding-flow";
import { StoreProvider } from "./store-provider";
import type { OnboardingFormData, Step3FormData } from "./step-3-venue-info";

export type { Step3FormData };

export type OnboardingPageProps = {
  link: OnboardingFlowProps["link"];
  onSubmit?: OnboardingFlowProps["onSubmit"];
  onSkip?: OnboardingFlowProps["onSkip"];
  onComplete?: OnboardingFlowProps["onComplete"];
  onSubdomainBlur?: OnboardingFlowProps["onSubdomainBlur"];
};

export { type OnboardingFormData };

export default function OnboardingPage({
  link,
  onSubmit,
  onSkip,
  onComplete,
  onSubdomainBlur,
}: OnboardingPageProps) {
  return (
    <StoreProvider>
      <OnboardingFlow
        link={link}
        onSubmit={onSubmit}
        onSkip={onSkip}
        onComplete={onComplete}
        onSubdomainBlur={onSubdomainBlur}
      />
    </StoreProvider>
  );
}
