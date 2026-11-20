import bcrypt from 'bcryptjs';
import { repository } from '../server/db/repository';

/**
 * Production Super Admin Provisioning Script
 * Usage:
 *   npx tsx scripts/provision-admin.ts --email=admin@tathastu-insights.org --password=YourStrongPassword123! --name="Principal Admin"
 */
async function provisionAdmin() {
  const args = process.argv.slice(2);
  const getArg = (key: string): string | undefined => {
    const match = args.find((a) => a.startsWith(`--${key}=`));
    return match ? match.split('=')[1] : undefined;
  };

  const email = getArg('email') || process.env.ADMIN_EMAIL || 'admin@tathastu-insights.org';
  const password = getArg('password') || process.env.ADMIN_PASSWORD || 'TathastuFrontierAdmin2026!';
  const name = getArg('name') || process.env.ADMIN_NAME || 'Dr. Aravind Nair';
  const affiliation = getArg('affiliation') || process.env.ADMIN_AFFILIATION || 'Frontier Systems & Alignment, AI Tathastu';

  // 1. Password complexity verification
  if (password.length < 12) {
    console.error('ERROR: Super Admin password must be at least 12 characters long.');
    process.exit(1);
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    console.error('ERROR: Password must contain uppercase, lowercase, and numeric characters.');
    process.exit(1);
  }

  // 2. Hash with 12 rounds of bcrypt
  console.log(`[Provisioning] Hashing credentials with 12 bcrypt salt rounds...`);
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(password, salt);

  // 3. Upsert into repository
  const existing = Array.from(repository.users.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  const now = new Date().toISOString();
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    existing.roleId = 'super_admin';
    existing.affiliation = affiliation;
    existing.isActive = true;
    repository.users.set(existing.id, existing);
    console.log(`[Provisioning] Updated existing user ${email} to Super Admin.`);
  } else {
    const id = `usr-admin-${Date.now()}`;
    const newUser = {
      id,
      email,
      name,
      passwordHash,
      roleId: 'super_admin' as const,
      affiliation,
      isActive: true,
      createdAt: now,
    };
    repository.users.set(id, newUser);
    console.log(`[Provisioning] Provisioned new Super Admin account: ${email} (${id}).`);
  }

  repository.persistToDisk();
  console.log('[Provisioning] Successfully persisted Super Admin credentials.');
}

provisionAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[Provisioning Error]', err);
    process.exit(1);
  });
