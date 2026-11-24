import type { LayoutLoad } from './$types';

// Disable SSR for administrative CMS routes: saves serverless CPU & execution overhead
export const ssr = false;

export const load: LayoutLoad = async () => {
	return {};
};
