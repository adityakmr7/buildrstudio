import { astrellMetadata } from "../metadata";
import { policyHtml } from "./policy";

export const metadata = astrellMetadata("/privacy", "Astrell Privacy Policy", "How Astrell handles local focus history, Screen Time permissions, optional Firebase accounts, and support requests.");

export default function AstrellPrivacyPage() {
  return <main id="astrell-main" className="astrell-document astrell-wrap" dangerouslySetInnerHTML={{ __html: policyHtml }} />;
}
