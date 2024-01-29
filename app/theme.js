import { extendTheme } from "@chakra-ui/react";
export const primary = {
	lighter: "#c5d5df", // lighter shade of #ACCBD7
	light: "#b3c7d1", // light shade of #ACCBD7
	main: "#ACCBD7", // provided blue color
	dark: "#90afb5", // dark shade of #ACCBD7
	darker: "#748f93", // darker shade of #ACCBD7
	contrastText: "#FFFFFF",
};

export const secondary = {
	lighter: "#6d7480", // lighter shade of #424C5D
	light: "#5b606a", // light shade of #424C5D
	main: "#424C5D", // provided dark blue color
	dark: "#363d47", // dark shade of #424C5D
	darker: "#2a2f34", // darker shade of #424C5D
	contrastText: "#FFFFFF",
};

export const info = {
	lighter: "#eb9880", // lighter shade of #DA6E42
	light: "#e07c61", // light shade of #DA6E42
	main: "#DA6E42", // provided orange color
	dark: "#b55a37", // dark shade of #DA6E42
	darker: "#90462c", // darker shade of #DA6E42
	contrastText: "#FFFFFF",
};

const colors = {
	primary,
	secondary,
	info,
};

const theme = extendTheme({
	colors,
	// You can also extend other theme keys here
});

export default theme;
