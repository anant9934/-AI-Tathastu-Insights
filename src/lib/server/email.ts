import nodemailer from 'nodemailer';

let host = process.env.SMTP_HOST || 'smtp.gmail.com';
let port = parseInt(process.env.SMTP_PORT || '465', 10);
let secure = process.env.SMTP_SECURE === 'true' || port === 465;
let user = process.env.SMTP_USER;
let pass = process.env.SMTP_PASS;
let defaultFrom = process.env.EMAIL_FROM || '"AI Tathastu Insights" <info.aitathastu@gmail.com>';

try {
	const { env } = await import('$env/dynamic/private');
	if (env) {
		if (env.SMTP_HOST) host = env.SMTP_HOST;
		if (env.SMTP_PORT) port = parseInt(env.SMTP_PORT, 10);
		if (env.SMTP_SECURE) secure = env.SMTP_SECURE === 'true' || port === 465;
		if (env.SMTP_USER) user = env.SMTP_USER;
		if (env.SMTP_PASS) pass = env.SMTP_PASS;
		if (env.EMAIL_FROM) defaultFrom = env.EMAIL_FROM;
	}
} catch (e) {
	// Standalone script fallback
}

function getTransporter() {
	if (!user || !pass) {
		console.warn('[Email] SMTP credentials not fully configured');
	}

	return nodemailer.createTransport({
		host,
		port,
		secure,
		auth: {
			user,
			pass
		}
	});
}

export async function sendMagicLinkEmail({
	to,
	magicLinkUrl,
	userName
}: {
	to: string;
	magicLinkUrl: string;
	userName?: string;
}) {
	const transporter = getTransporter();

	const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Magic Sign-in Link</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { background-color: #ffffff; max-width: 540px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .brand { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; font-size: 15px; }
    .footer { font-size: 13px; color: #64748b; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; line-height: 1.5; }
    .note { font-size: 13px; color: #64748b; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">AI Tathastu Insights — Admin</div>
    <h2 style="font-size: 18px; margin-top: 0;">Sign in to your account</h2>
    <p>Hello ${userName || 'there'},</p>
    <p>Click the secure link below to sign in to the editorial dashboard. This link is single-use and will expire in <strong>15 minutes</strong>.</p>
    <p style="text-align: center;">
      <a href="${magicLinkUrl}" class="btn" target="_blank">Sign in to Admin Dashboard</a>
    </p>
    <p class="note">If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${magicLinkUrl}" style="color: #2563eb; word-break: break-all;">${magicLinkUrl}</a>
    </p>
    <div class="footer">
      If you did not request this sign-in link, you can safely ignore this email. No password was used, and your account remains secure.
    </div>
  </div>
</body>
</html>
`;

	return transporter.sendMail({
		from: defaultFrom,
		to,
		subject: 'Your Magic Sign-in Link — AI Tathastu Insights',
		text: `Sign in to AI Tathastu Insights: ${magicLinkUrl}\n\nThis link expires in 15 minutes and is single-use.`,
		html
	});
}

export async function sendSubscriberConfirmationEmail({
	to,
	confirmUrl
}: {
	to: string;
	confirmUrl: string;
}) {
	const transporter = getTransporter();

	const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirm Your Subscription</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { background-color: #ffffff; max-width: 540px; margin: 0 auto; border-radius: 12px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .brand { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 24px; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; font-size: 15px; }
    .footer { font-size: 13px; color: #64748b; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">AI Tathastu Insights</div>
    <h2 style="font-size: 18px; margin-top: 0;">Please confirm your newsletter subscription</h2>
    <p>Thank you for your interest in AI Tathastu Insights. To ensure you intended to subscribe, please click the button below to confirm your email address:</p>
    <p style="text-align: center;">
      <a href="${confirmUrl}" class="btn" target="_blank">Confirm Subscription</a>
    </p>
    <p style="font-size: 13px; color: #64748b;">This link will expire in 7 days. If you did not sign up for this newsletter, no further action is required and you will not receive any emails.</p>
    <div class="footer">
      AI Tathastu Insights • aitathastu.info
    </div>
  </div>
</body>
</html>
`;

	return transporter.sendMail({
		from: defaultFrom,
		to,
		subject: 'Please confirm your subscription — AI Tathastu Insights',
		text: `Confirm your subscription to AI Tathastu Insights: ${confirmUrl}\n\nIf you did not request this, you can ignore this email.`,
		html
	});
}

export async function sendSubscriberUnsubscribeEmail({
	to,
	resubscribeUrl
}: {
	to: string;
	resubscribeUrl: string;
}) {
	const transporter = getTransporter();

	return transporter.sendMail({
		from: defaultFrom,
		to,
		subject: 'You have been unsubscribed — AI Tathastu Insights',
		text: `You have successfully unsubscribed from AI Tathastu Insights. If this was a mistake, you can resubscribe anytime at ${resubscribeUrl}.`,
		html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2>You are now unsubscribed</h2>
        <p>You will no longer receive newsletter issues from AI Tathastu Insights.</p>
        <p>If you changed your mind, you can <a href="${resubscribeUrl}">resubscribe here</a>.</p>
      </div>
    `
	});
}
