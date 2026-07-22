import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;

  const firstName = name?.split(" ")[0] || "there";

  await resend.emails.send({
    from: "Aditya from BuildrStudio <aditya@buildrstudio.in>",
    to,
    subject: "Welcome to BuildrStudio 👋",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0a0a0a;padding:24px 32px;text-align:center;">
            <span style="display:inline-block;width:40px;height:40px;background:#ffffff;border-radius:10px;font-weight:800;font-size:18px;line-height:40px;color:#0a0a0a;text-align:center;">B</span>
            <span style="color:#ffffff;font-size:18px;font-weight:700;margin-left:10px;vertical-align:middle;">BuildrStudio</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0a0a0a;">Hey ${firstName} 👋</p>
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
              Welcome to BuildrStudio — I'm Aditya, the person who built this.
              You now have access to all the tools to create polished App Store screenshots,
              social graphics, and changelog cards — all in the browser, no Figma needed.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#f9f9f9;border-radius:8px;padding:16px 20px;border-left:3px solid #0a0a0a;">
                  <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#0a0a0a;">Start here →</p>
                  <p style="margin:0;font-size:13px;color:#666;line-height:1.5;">
                    Open Screenshot Builder, paste your App Store URL or upload a screenshot,
                    and you'll have a ready-to-submit mockup in under 2 minutes.
                  </p>
                </td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#0a0a0a;border-radius:8px;padding:12px 24px;">
                  <a href="https://buildrstudio.in/screenshot-builder" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                    Open Screenshot Builder →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 4px;font-size:13px;color:#888;">
              Hit reply if you have any questions or feedback — I read every email.
            </p>
            <p style="margin:0;font-size:13px;color:#888;">— Aditya</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f0f0f0;text-align:center;">
            <p style="margin:0;font-size:11px;color:#bbb;">
              BuildrStudio · <a href="https://buildrstudio.in/privacy" style="color:#bbb;">Privacy</a> · <a href="https://buildrstudio.in/terms" style="color:#bbb;">Terms</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
