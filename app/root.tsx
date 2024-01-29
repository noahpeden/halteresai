// root.tsx
import React, { useContext, useEffect } from "react";
import { withEmotionCache } from "@emotion/react";
import {
	Links,
	LiveReload,
	Meta,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { AppProvider } from "./contexts/AppContext";
import { ChakraProvider } from "@chakra-ui/react";
import { MetaFunction, LinksFunction, json } from "@remix-run/node"; // Depends on the runtime you choose
import App from "./App";
import { ServerStyleContext, ClientStyleContext } from "./context";

export const loader = async () => {
	return json({
		ENV: {
			PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
			PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		},
	});
};

export const meta: MetaFunction = () => [
	{
		charset: "utf-8",
		title: "New Remix App",
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

export default function AppRoot() {
	return (
		<Document>
			<ChakraProvider>
				<AppProvider>
					<App />
				</AppProvider>
			</ChakraProvider>
		</Document>
	);
}
