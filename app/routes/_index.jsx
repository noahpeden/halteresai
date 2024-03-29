import { Link } from "@remix-run/react";
export const meta = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<ul>
				<li>
					<Link to="/create">Create new programming</Link>
				</li>
			</ul>
		</div>
	);
}
