import type { Handle } from '@sveltejs/kit';
import { PASSWORD } from '$env/static/private';

import { createPasswordProtectHandler } from 'sveltekit-password-protect';

export const handle: Handle = createPasswordProtectHandler({
 password: PASSWORD,
});
