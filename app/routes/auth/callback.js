import { redirect } from "@remix-run/node";
import { createServerClient } from "@supabase/auth-helpers-remix";

export const loader = async ({ request }) => {
	const response = new Response();
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	if (code) {
		const supabaseClient = createServerClient(
			process.env.PUBLIC_SUPABASE_URL,
			process.env.PUBLIC_SUPABASE_ANON_KEY,
			{ request, response }
		);
		await supabaseClient.auth.exchangeCodeForSession(code);
	}

	return redirect("/", {
		headers: response.headers,
	});
};
