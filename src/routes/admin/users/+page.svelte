<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isCreateModalOpen = $state(false);
	let newName = $state('');
	let newEmail = $state('');
	let newRole = $state('viewer');
</script>

<svelte:head>
	<title>Staff Users — AI Tathastu Admin</title>
</svelte:head>

<div class="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
	<!-- Top Bar -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">
				Staff & Access Control
			</h1>
			<p class="text-xs text-slate-500 mt-1">
				Four-tier RBAC (Owner, Editor, Author, Viewer) with passwordless magic links
			</p>
		</div>

		<button
			type="button"
			onclick={() => isCreateModalOpen = true}
			class="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
		>
			+ Add Staff Account
		</button>
	</div>

	{#if form?.error}
		<div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
			{form.error}
		</div>
	{/if}

	<!-- Users Table -->
	<div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-slate-200 text-left text-xs">
				<thead class="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
					<tr>
						<th class="px-6 py-3.5">Name & Email</th>
						<th class="px-6 py-3.5">Assigned Role</th>
						<th class="px-6 py-3.5">Status</th>
						<th class="px-6 py-3.5">Last Login</th>
						<th class="px-6 py-3.5 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 bg-white">
					{#each data.users as u}
						<tr class="hover:bg-slate-50 transition">
							<td class="px-6 py-4">
								<p class="font-bold text-slate-900">{u.name}</p>
								<p class="text-slate-500 font-mono text-[11px]">{u.email}</p>
							</td>
							<td class="px-6 py-4">
								<form method="POST" action="?/updateRole" use:enhance class="inline">
									<input type="hidden" name="id" value={u.id} />
									<select
										name="role"
										value={u.role}
										onchange={(e) => (e.target as HTMLSelectElement).form?.requestSubmit()}
										class="rounded-lg border border-slate-300 text-xs px-2.5 py-1 bg-white text-slate-800 uppercase font-semibold text-[10px]"
									>
										<option value="owner">Owner</option>
										<option value="editor">Editor</option>
										<option value="author">Author</option>
										<option value="viewer">Viewer</option>
									</select>
								</form>
							</td>
							<td class="px-6 py-4">
								{#if u.deactivated}
									<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
										Deactivated
									</span>
								{:else}
									<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
										Active
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 text-slate-500">
								{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
							</td>
							<td class="px-6 py-4 text-right">
								<form method="POST" action="?/toggleDeactivate" use:enhance class="inline">
									<input type="hidden" name="id" value={u.id} />
									<button
										type="submit"
										class={`text-xs font-semibold ${u.deactivated ? 'text-emerald-600 hover:underline' : 'text-slate-400 hover:text-rose-600'}`}
									>
										{u.deactivated ? 'Reactivate' : 'Deactivate'}
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Create User Modal -->
{#if isCreateModalOpen}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
			<h2 class="text-lg font-bold text-slate-900 mb-1">Add Staff Account</h2>
			<p class="text-xs text-slate-500 mb-5">Create a staff profile. They will authenticate passwordlessly via magic link.</p>

			<form method="POST" action="?/create" use:enhance class="space-y-4">
				<div>
					<label for="input-staff-name" class="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
					<input
						id="input-staff-name"
						type="text"
						name="name"
						bind:value={newName}
						required
						placeholder="Jane Doe"
						class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
					/>
				</div>

				<div>
					<label for="input-staff-email" class="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
					<input
						id="input-staff-email"
						type="email"
						name="email"
						bind:value={newEmail}
						required
						placeholder="jane@company.com"
						class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 text-slate-900 focus:ring-1 focus:ring-slate-900"
					/>
				</div>

				<div>
					<label for="input-staff-role" class="block text-xs font-semibold text-slate-700 mb-1">RBAC Role *</label>
					<select
						id="input-staff-role"
						name="role"
						bind:value={newRole}
						class="w-full rounded-xl border border-slate-300 text-xs px-3 py-2 bg-white text-slate-900 focus:ring-1 focus:ring-slate-900"
					>
						<option value="viewer">Viewer (Read-only access)</option>
						<option value="author">Author (Create/edit own drafts)</option>
						<option value="editor">Editor (Publish, media, subscribers)</option>
						<option value="owner">Owner (Full administrative rights)</option>
					</select>
				</div>

				<div class="flex items-center justify-end gap-3 pt-3">
					<button
						type="button"
						onclick={() => isCreateModalOpen = false}
						class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
					>
						Create Account →
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
