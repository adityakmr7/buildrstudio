import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getPaddleCustomerByEmail,
  getPaddleSubscriptionsForCustomer,
  hasActiveAccess,
} from "@/app/lib/paddleDb";
import AppHeader from "../components/AppHeader";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  paused: "Paused",
  past_due: "Past due",
  canceled: "Canceled",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ portal?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const { portal } = await searchParams;

  const customer = await getPaddleCustomerByEmail(session.user.email);
  const subscriptions = customer
    ? await getPaddleSubscriptionsForCustomer(customer.customerId)
    : [];
  const access = customer ? await hasActiveAccess(customer.customerId) : false;

  return (
    <>
      <style>{`
        .acct-page {
          max-width: 640px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          font-family: var(--font);
          color: var(--text-1);
        }
        .acct-header {
          margin-bottom: 28px;
        }
        .acct-header h1 {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.9px;
          margin-bottom: 8px;
        }
        .acct-header p {
          font-size: 14px;
          color: var(--text-2);
        }
        .acct-notice {
          margin-bottom: 20px;
          padding: 12px 16px;
          border-radius: var(--r-md, 12px);
          border: 1px solid var(--border);
          background: var(--fill-subtle);
          color: var(--text-2);
          font-size: 13px;
        }
        .acct-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .acct-plan-id {
          font-size: 12px;
          color: var(--text-3);
          font-family: monospace;
          margin-top: 4px;
        }
        .acct-actions {
          margin-top: 24px;
          display: flex;
          gap: 12px;
        }
      `}</style>

      <AppHeader />

      <div className="acct-page">
        <div className="acct-header">
          <h1>Account</h1>
          <p>{session.user.email}</p>
        </div>

        {portal === "no_customer" && (
          <div className="acct-notice">
            No billing account found yet for this email — subscribe on the pricing page first.
          </div>
        )}
        {portal === "error" && (
          <div className="acct-notice">
            Couldn&apos;t open the billing portal just now. Please try again in a moment.
          </div>
        )}

        <div className="card-default">
          <div className="acct-row">
            <span className="ink-body" style={{ fontWeight: 600, color: "var(--text-1)" }}>
              Plan status
            </span>
            <span className={access ? "chip-filled" : "chip-subtle"}>
              {access ? "Active access" : "No active plan"}
            </span>
          </div>

          {subscriptions.length > 0 && (
            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {subscriptions.map((sub) => (
                <div key={sub.subscriptionId}>
                  <div className="acct-row">
                    <span className="ink-body">{sub.productId}</span>
                    <span className="chip-subtle">{STATUS_LABEL[sub.status] ?? sub.status}</span>
                  </div>
                  {sub.scheduledChangeAction && (
                    <div className="acct-plan-id">
                      Scheduled: {sub.scheduledChangeAction}
                      {sub.scheduledChangeAt ? ` on ${new Date(sub.scheduledChangeAt).toLocaleDateString()}` : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="acct-actions">
            <a href="/api/portal" className="btn-fill">
              Manage billing
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
