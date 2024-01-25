/* eslint-disable @typescript-eslint/no-explicit-any */
// root.tsx
import React, { useContext, useEffect, useState } from "react";
import { withEmotionCache } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	json,
} from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { AppProvider } from "./contexts/AppContext";
import { MetaFunction, LinksFunction } from "@remix-run/node"; // Depends on the runtime you choose

import { ServerStyleContext, ClientStyleContext } from "./context";

export const meta: MetaFunction = () => [
	{
		charset: "utf-8",
		title: "HalteresAI",
		viewport: "width=device-width,initial-scale=1",
	},
];

export const links: LinksFunction = () => {
	return [
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{ rel: "preconnect", href: "https://fonts.gstatic.com" },
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
		},
	];
};

interface DocumentProps {
	children: React.ReactNode;
}

const Document = withEmotionCache(
	({ children }: DocumentProps, emotionCache) => {
		const serverStyleData = useContext(ServerStyleContext);
		const clientStyleData = useContext(ClientStyleContext);

		// Only executed on client
		useEffect(() => {
			// re-link sheet container
			emotionCache.sheet.container = document.head;
			// re-inject tags
			const tags = emotionCache.sheet.tags;
			emotionCache.sheet.flush();
			tags.forEach((tag) => {
				(emotionCache.sheet as any)._insertTag(tag);
			});
			// reset cache to reapply global styles
			clientStyleData?.reset();
		}, []);

		return (
			<html lang="en">
				<head>
					<Meta />
					<Links />
					{serverStyleData?.map(({ key, ids, css }) => (
						<style
							key={key}
							data-emotion={`${key} ${ids.join(" ")}`}
							dangerouslySetInnerHTML={{ __html: css }}
						/>
					))}
				</head>
				<body>
					{children}
					<ScrollRestoration />
					<Scripts />
					<LiveReload />
				</body>
			</html>
		);
	}
);

export const loader = async () => {
	return json({
		ENV: {
			PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		},
	});
};

interface Session {
	provider_token?: string | null;
	access_token: string;
	expires_in: string;
	expires_at: string;
	refresh_token: string;
	token_type: string;
	user: User | null;
}

interface User {
	id: string;
	aud: string;
	role: string;
	email: string;
	confirmed_at: string;
	confirmation_sent_at: string;
	last_sign_in_at: string;
	created_at: string;
	updated_at: string;
}

export default function App() {
	const data = useLoaderData();
	const supabase = createClient(
		(data as any).ENV.PUBLIC_SUPABASE_URL,
		(data as any).ENV.PUBLIC_SUPABASE_ANON_KEY
	);

	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	return (
		<div>
			{!session ? (
				<Auth
					supabaseClient={supabase}
					appearance={{ theme: ThemeSupa }}
					providers={["google"]}
				/>
			) : (
				<Document>
					<ChakraProvider>
						<AppProvider>
							<Outlet />
						</AppProvider>
					</ChakraProvider>
				</Document>
			)}
		</div>
	);
}
