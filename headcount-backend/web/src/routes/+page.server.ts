import { fail } from "@sveltejs/kit";

import type { Actions } from './$types';
import { PRODUCTION_API_URL, IS_DOCKERISED } from '$env/static/private';
import { dev } from "$app/environment";


let apiURL;

if (IS_DOCKERISED == "1") {

  if (dev) {
    apiURL = "http://server:3000"
  } else {
    apiURL = PRODUCTION_API_URL;
  }

} else {
  apiURL = "http://localhost:3000"
}

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
