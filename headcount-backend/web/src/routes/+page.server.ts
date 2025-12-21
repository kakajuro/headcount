import { dev } from '$app/environment';

export const load = async ({ fetch, params }) => {

  let apiURL;
  dev ? apiURL = "http://localhost:3000" : apiURL = "http://localhost:3000";

	const res = await fetch(`${apiURL}/counts/recent`);
	const data = await res.json();

	return { data };
};
