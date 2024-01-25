import { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

import PropTypes from "prop-types";

export const AppProvider = ({ children }) => {
	const [office, setOffice] = useState([]);
	const [whiteboard, setWhiteboard] = useState([]);

	const addOfficeInfo = (officeDetails) => {
		setOffice(officeDetails);
	};

	const addWhiteboardInfo = (whiteboardDetails) => {
		setWhiteboard(whiteboardDetails);
	};

	return (
		<AppContext.Provider
			value={{ office, whiteboard, addOfficeInfo, addWhiteboardInfo }}
		>
			{children}
		</AppContext.Provider>
	);
};

AppProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
