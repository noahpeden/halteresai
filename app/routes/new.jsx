// New.js
import { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import Metcon from "../components/Metcon";
import Office from "../components/Office";
import AppStepper from "../components/Stepper";
import Whiteboard from "../components/Whiteboard";

const New = () => {
	const [activeStep, setActiveStep] = useState(0);

	const getStepContent = (stepIndex) => {
		switch (stepIndex) {
			case 0:
				return <Office />;
			case 1:
				return <Whiteboard />;
			case 2:
				return <Metcon />;
			default:
				return "Unknown step";
		}
	};

	return (
		<Flex>
			<Box
				flex="1"
				position="fixed"
				left="0"
				top="50%"
				transform="translateY(-50%)"
			>
				<AppStepper activeStep={activeStep} setActiveStep={setActiveStep} />
			</Box>
			<Box flex="2" ml={{ base: "0", md: "300px" }} p="4">
				{getStepContent(activeStep)}
			</Box>
		</Flex>
	);
};

export default New;
