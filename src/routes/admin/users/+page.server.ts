import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '#lib/server/db';
import { users } from '#lib/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { requireRole } from '#lib/server/auth';
import { logAudit } from '#lib/server/audit';

export const load: PageServerLoad = async ({ locals }) => {
	requireRole(locals.user, ['owner']);

	const allUsers = await db.query.users.findMany({
		orderBy: [desc(users.createdAt)]
	});

	return {
		users: allUsers,
		currentUserId: locals.user!.id
	};
};

export const actions: Actions = {
	create: async (event) => {
		const currentUser = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();
		const name = (formData.get('name')?.toString() || '').trim();
		const email = (formData.get('email')?.toString() || '').trim().toLowerCase();
		const role = (formData.get('role')?.toString() || 'viewer') as any;

		if (!name || !email || !email.includes('@')) {
			return fail(400, { error: 'Valid name and email are required.' });
		}

		const existing = await db.query.users.findFirst({
			where: eq(users.email, email)
		});

		if (existing) {
			return fail(400, { error: 'A staff member with this email already exists.' });
		}

		const newId = crypto.randomUUID();

		await db.insert(users).values({
			id: newId,
			name,
			email,
			role,
			emailVerified: true,
			deactivated: false
		});

		await logAudit({
			actorId: currentUser.id,
			action: 'user.create',
			entityType: 'user',
			entityId: newId,
			diff: { name, email, role },
			event
		});

		return { success: true };
	},

	updateRole: async (event) => {
		const currentUser = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();
		const targetId = formData.get('id')?.toString();
		const newRole = formData.get('role')?.toString() as any;

		if (!targetId || !newRole) return fail(400, { error: 'Missing parameters' });

		const targetUser = await db.query.users.findFirst({
			where: eq(users.id, targetId)
		});

		if (!targetUser) return fail(404, { error: 'User not found' });

		// Prevent demotion of the last active Owner (BR-AUTH-09.1)
		if (targetUser.role === 'owner' && newRole !== 'owner') {
			const activeOwners = await db.query.users.findMany({
				where: and(eq(users.role, 'owner'), eq(users.deactivated, false))
			});
			if (activeOwners.length <= 1) {
				return fail(400, { error: 'Cannot demote the last remaining active Owner account.' });
			}
		}

		await db
			.update(users)
			.set({ role: newRole, updatedAt: new Date() })
			.where(eq(users.id, targetId));

		await logAudit({
			actorId: currentUser.id,
			action: 'user.role_change',
			entityType: 'user',
			entityId: targetId,
			diff: { oldRole: targetUser.role, newRole },
			event
		});

		return { success: true };
	},

	toggleDeactivate: async (event) => {
		const currentUser = requireRole(event.locals.user, ['owner']);
		const formData = await event.request.formData();
		const targetId = formData.get('id')?.toString();

		if (!targetId) return fail(400, { error: 'Missing target ID' });

		const targetUser = await db.query.users.findFirst({
			where: eq(users.id, targetId)
		});

		if (!targetUser) return fail(404, { error: 'User not found' });

		// Prevent deactivating the last active Owner (BR-AUTH-09.1 & E2E-15)
		if (targetUser.role === 'owner' && !targetUser.deactivated) {
			const activeOwners = await db.query.users.findMany({
				where: and(eq(users.role, 'owner'), eq(users.deactivated, false))
			});
			if (activeOwners.length <= 1) {
				return fail(400, { error: 'Cannot deactivate the last active Owner account.' });
			}
		}

		const newStatus = !targetUser.deactivated;

		await db
			.update(users)
			.set({ deactivated: newStatus, updatedAt: new Date() })
			.where(eq(users.id, targetId));

		await logAudit({
			actorId: currentUser.id,
			action: newStatus ? 'user.deactivate' : 'user.activate',
			entityType: 'user',
			entityId: targetId,
			event
		});

		return { success: true };
	}
};
