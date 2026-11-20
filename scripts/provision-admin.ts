import bcrypt from 'bcryptjs';
import readline from 'readline';
import { repository } from '../server/db/repository';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Production Super Admin Provisioning Script (Hardened Security)
 * 
 * SECURITY COMPLIANCE RULE:
 * Passwords MUST NEVER be passed as plaintext command-line flags (--password=...),
 * as this leaks secrets into `ps aux`, system process tables, shell history files (.zsh_history),
 * and centralized monitoring daemons.
 * 
 * Acceptable input vectors:
 * 1. Environment variable: ADMIN_PASSWORD="YourStrongSecretPassword123!"
 * 2. Secure interactive masked prompt on TTY stdin.
 * 
 * Usage:
 *   ADMIN_PASSWORD="YourSecurePassword123!" npx tsx scripts/provision-admin.ts --email=admin@tathastu-insights.org --name="Principal Admin"
 */

async function promptPasswordHidden(promptText: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const stdin = process.stdin;
    let password = '';

    process.stdout.write(promptText);

    // Enter raw mode to capture characters without echoing
    if (stdin.isTTY) {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      const onData = (char: string) => {
        // Return / Enter
        if (char === '\n' || char === '\r' || char === '\u0004') {
          stdin.setRawMode(false);
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
          return;
        }

        // Ctrl+C
        if (char === '\u0003') {
          stdin.setRawMode(false);
          process.exit(1);
        }

        // Backspace
        if (char === '\u0008' || char === '\x7f') {
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          return;
        }

        // Normal characters
        password += char;
        process.stdout.write('*');
      };

      stdin.on('data', onData);
    } else {
      rl.question('', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

async function provisionAdmin() {
  const args = process.argv.slice(2);

  // 1. HARD SECURITY CHECK: Plaintext CLI Flag Prohibition
  const hasPlaintextPasswordArg = args.some(
    (a) => a.startsWith('--password') || a.startsWith('-p=') || a === '-p'
  );

  if (hasPlaintextPasswordArg) {
    console.error('\n================================================================================');
    console.error('CRITICAL SECURITY VIOLATION: PLAINTEXT CLI PASSWORD DETECTED');
    console.error('================================================================================');
    console.error('Passing passwords via command-line arguments (--password=...) is strictly');
    console.error('prohibited. It exposes high-privilege credentials in:');
    console.error('  1. Process status listings (ps -ef / ps aux)');
    console.error('  2. Shell command history files (~/.zsh_history, ~/.bash_history)');
    console.error('  3. Container / Host OS process audit telemetry');
    console.error('\nCORRECT USAGE:');
    console.error('  Pass the credential securely via environment variable:');
    console.error('    ADMIN_PASSWORD="YourSecurePassword123!" npx tsx scripts/provision-admin.ts');
    console.error('  Or omit to be prompted interactively with terminal masking.');
    console.error('================================================================================\n');
    throw new Error('SECURITY_ERROR_PLAINTEXT_CLI_PASSWORD_PROHIBITED');
  }

  const getArg = (key: string): string | undefined => {
    const match = args.find((a) => a.startsWith(`--${key}=`));
    return match ? match.split('=')[1] : undefined;
  };

  const email = getArg('email') || process.env.ADMIN_EMAIL || 'admin@tathastu-insights.org';
  const name = getArg('name') || process.env.ADMIN_NAME || 'Dr. Aravind Nair';
  const affiliation = getArg('affiliation') || process.env.ADMIN_AFFILIATION || 'Frontier Systems & Alignment, AI Tathastu';

  let password = process.env.ADMIN_PASSWORD || process.env.PROVISION_PASSWORD;

  if (!password) {
    if (process.stdin.isTTY) {
      console.log(`\n[Super Admin Provisioning] Target: ${email} (${name})`);
      password = await promptPasswordHidden('Enter secure Super Admin password (masked): ');
    } else {
      console.error('ERROR: Non-interactive environment detected. You must provide ADMIN_PASSWORD via environment variable.');
      process.exit(1);
    }
  }

  // 2. Password complexity verification
  if (password.length < 12) {
    console.error('ERROR: Super Admin password must be at least 12 characters long.');
    process.exit(1);
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    console.error('ERROR: Password must contain uppercase, lowercase, numeric, and special characters.');
    process.exit(1);
  }

  // 3. Hash with 12 rounds of bcrypt
  console.log(`[Provisioning] Hashing Super Admin credentials with 12 bcrypt salt rounds...`);
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(password, salt);

  // 4. Upsert into repository
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
    console.log(`[Provisioning] Successfully updated existing user ${email} to Super Admin.`);
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
  console.log('[Provisioning] Persisted Super Admin credentials securely to persistent disk store.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  provisionAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Provisioning Error]', err);
      process.exit(1);
    });
}

export { provisionAdmin };
