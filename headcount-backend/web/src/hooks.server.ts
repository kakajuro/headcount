import type { Handle } from '@sveltejs/kit';

import { createPasswordProtectHandler } from 'sveltekit-password-protect';

const PASSWORD = process.env.PASSWORD;

export const handle: Handle = createPasswordProtectHandler({
 password: PASSWORD!,
});
