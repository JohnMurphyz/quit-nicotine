interface PaywallGateProps {
  children: React.ReactNode;
}

// TODO: Re-enable paywall gating when RevenueCat/Stripe is configured
export function PaywallGate({ children }: PaywallGateProps) {
  return <>{children}</>;
}
