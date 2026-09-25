"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isDevAuthBypassEnabled, DEV_BYPASS_PROVIDER_ID } from "../lib/devAuth";

// Sends the visitor to the dashboard with ?trial=<slug>; the dashboard
// creates the trial key (POST /api/trials) and shows the embed code. Signed-
// out visitors go through Google sign-in first and land in the same place.
export default function StartTrialButton({
  agentSlug,
  label,
  className,
  style,
}: {
  agentSlug: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { status } = useSession();
  const router = useRouter();
  const target = `/dashboard/integrations?trial=${encodeURIComponent(agentSlug)}`;

  const handleClick = () => {
    if (status === "authenticated") {
      router.push(target);
      return;
    }
    signIn(isDevAuthBypassEnabled() ? DEV_BYPASS_PROVIDER_ID : "google", { callbackUrl: target });
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={{ cursor: "pointer", ...style }}>
      {label}
    </button>
  );
}
