import type { Actions } from './$types';
import { PRODUCTION_API_URL } from '$env/static/private';
import { dev } from '$app/environment';

import { fail } from "@sveltejs/kit";

let apiURL;
dev ? apiURL = "http://localhost:3000" : apiURL = PRODUCTION_API_URL;

export const load = async ({ fetch, params }) => {

	const res = await fetch(`${apiURL}/counts/recent`);
	const data = await res.json();

	return { data };
};

export const actions = {
	add: async (event) => {

		const data = await event.request.formData();
    const formObject = Object.fromEntries(data);

    try {

      const rawResponse = await fetch(`${apiURL}/apps/add`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
      });

      const response = await rawResponse.json();

      if (rawResponse.status === 500) {
        throw new Error(response.error);
      }

      return { success: true };

    } catch (error) {
      // @ts-ignore
      return fail(400, {error: error.message});
    }

	},
  delete: async (event) => {

    const data = await event.request.formData();
    const idObj = Object.fromEntries(data);

    const rawResponse = await fetch(`${apiURL}/apps/delete`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(idObj)
    });

    const response = await rawResponse.json();

    if (rawResponse.status === 500) {
      throw new Error(response.error);
    }

    return { success: true };

  }
} satisfies Actions;
