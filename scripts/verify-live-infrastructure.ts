import * as dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

async function verifyAll() {
  console.log('================================================================');
  console.log('AI TATHASTU INSIGHTS — LIVE INFRASTRUCTURE VERIFICATION');
  console.log('================================================================\n');

  // 1. NEON POSTGRESQL VERIFICATION
  console.log('--- [1/3] Verifying Neon PostgreSQL Instance ---');
  const dbUrl = process.env.DATABASE_URL;
  console.log('Database URL Target:', dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'NOT SET');

  if (!dbUrl) {
    console.error('FAIL: DATABASE_URL not set in environment.');
  } else {
    const pool = new pg.Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    try {
      const client = await pool.connect();
      const res = await client.query('SELECT version(), current_database(), current_user, NOW() as current_time;');
      console.log('✓ Connected to Neon PostgreSQL successfully!');
      console.log('  Database:', res.rows[0].current_database);
      console.log('  User:', res.rows[0].current_user);
      console.log('  Server Version:', res.rows[0].version.split(' ')[0], res.rows[0].version.split(' ')[1]);
      console.log('  Server Time:', res.rows[0].current_time);

      // Create a test table, write, read, update, delete
      console.log('  Executing CRUD & Transaction Test on Neon...');
      await client.query('BEGIN');
      await client.query(`
        CREATE TABLE IF NOT EXISTS _infra_verification_test (
          id VARCHAR(64) PRIMARY KEY,
          label VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);
      const testId = `test-${Date.now()}`;
      await client.query('INSERT INTO _infra_verification_test (id, label) VALUES ($1, $2)', [testId, 'Phase 6 Live Verification']);
      const readRes = await client.query('SELECT * FROM _infra_verification_test WHERE id = $1', [testId]);
      if (readRes.rows.length === 1 && readRes.rows[0].label === 'Phase 6 Live Verification') {
        console.log('✓ Neon CRUD Test PASSED (INSERT, SELECT verified).');
      }
      await client.query('DELETE FROM _infra_verification_test WHERE id = $1', [testId]);
      await client.query('DROP TABLE IF EXISTS _infra_verification_test');
      await client.query('COMMIT');
      console.log('✓ Neon Transaction & Cleanup PASSED.\n');
      client.release();
    } catch (err: any) {
      console.error('FAIL: Neon DB Connection Error:', err.message);
    } finally {
      await pool.end();
    }
  }

  // 2. CLOUDINARY MEDIA STORAGE VERIFICATION
  console.log('--- [2/3] Verifying Cloudinary Storage Environment ---');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  console.log('Cloud Name:', cloudName);
  console.log('API Key:', apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'NOT SET');

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('FAIL: Cloudinary environment variables missing.');
  } else {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const publicId = `tathastu/verification/live-ping-${Date.now()}`;
      const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      // 1x1 transparent PNG buffer
      const pngBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64'
      );

      const formData = new FormData();
      formData.append('file', `data:image/png;base64,${pngBuffer.toString('base64')}`);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('public_id', publicId);
      formData.append('signature', signature);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        console.log('✓ Cloudinary Upload Verified!');
        console.log('  Public ID:', uploadData.public_id);
        console.log('  Secure Delivery URL:', uploadData.secure_url);
        console.log('  Dimensions:', `${uploadData.width}x${uploadData.height}`);
        console.log('  Format:', uploadData.format);
        console.log('✓ Cloudinary storage environment is fully authenticated & active.\n');
      } else {
        const errText = await uploadRes.text();
        console.error('FAIL: Cloudinary API returned status', uploadRes.status, errText);
      }
    } catch (err: any) {
      console.error('FAIL: Cloudinary upload error:', err.message);
    }
  }

  // 3. TRANSACTIONAL EMAIL (GMAIL SMTP) VERIFICATION
  console.log('--- [3/3] Verifying Transactional Email via Gmail SMTP ---');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log(`SMTP Relay: ${smtpHost}:${smtpPort} (Secure: ${process.env.SMTP_SECURE})`);
  console.log(`SMTP User: ${smtpUser}`);

  if (!smtpUser || !smtpPass) {
    console.error('FAIL: SMTP User or App Password not configured.');
  } else {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      console.log('  Verifying SMTP credentials against Gmail...');
      const verified = await transporter.verify();
      if (verified) {
        console.log('✓ Gmail SMTP Authentication PASSED! Mail server is ready to deliver.');
      }

      console.log('  Sending test transactional notification email to yourself...');
      const sendResult = await transporter.sendMail({
        from: `"AI Tathastu Insights" <${smtpUser}>`,
        to: smtpUser,
        subject: '✓ Live Integration Verified — AI Tathastu Insights Infrastructure',
        text: 'Live SMTP delivery verified successfully.\n\nAll services (Neon PostgreSQL, Cloudinary Media Storage, Gmail SMTP) are connected and verified.',
        html: `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #0f172a; margin: 0 0 12px;">AI TATHASTU INSIGHTS</h2>
            <p style="color: #15803d; font-weight: 600;">✓ Live Transactional Email Pipeline Verified</p>
            <p style="color: #4b5563;">This confirms that the Gmail SMTP transport is active, authenticated, and capable of delivering password reset and editorial notification emails.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">AI Tathastu Insights &bull; Automated Infrastructure Verification</p>
          </div>
        `,
      });

      console.log('✓ Test Email Sent Successfully!');
      console.log('  Message ID:', sendResult.messageId);
      console.log('  Accepted Recipients:', sendResult.accepted);
      console.log('✓ Transactional email pipeline is 100% operational.\n');
    } catch (err: any) {
      console.error('FAIL: Gmail SMTP error:', err.message);
    }
  }

  console.log('================================================================');
  console.log('INFRASTRUCTURE VERIFICATION RUN COMPLETE');
  console.log('================================================================');
}

verifyAll();
