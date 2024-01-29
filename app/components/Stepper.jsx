import {
	Step,
	StepDescription,
	StepIcon,
	StepIndicator,
	StepNumber,
	StepSeparator,
	StepStatus,
	StepTitle,
	Stepper,
	Button,
	Box,
	Flex,
} from "@chakra-ui/react";

const steps = [
	{ title: "Office", description: "Set up your gym" },
	{ title: "Whiteboard", description: "Accessorize your programming" },
	{ title: "Metcon", description: "Generate WODs" },
];
const AppStepper = ({ activeStep, setActiveStep }) => {
	const goToNextStep = () => {
		if (activeStep < steps.length - 1) {
			setActiveStep(activeStep + 1);
		}
	};

	const goToPreviousStep = () => {
		if (activeStep > 0) {
			setActiveStep(activeStep - 1);
		}
	};

	return (
		<Flex direction={"column"}>
			<Stepper index={activeStep} orientation="vertical" height="400px" gap="0">
				{steps.map((step, index) => (
					<Step key={index}>
						<StepIndicator>
							<StepStatus
								complete={<StepIcon />}
								incomplete={<StepNumber />}
								active={<StepNumber />}
							/>
						</StepIndicator>

						<Box flexShrink="0">
							<StepTitle>{step.title}</StepTitle>
							<StepDescription>{step.description}</StepDescription>
						</Box>

						<StepSeparator />
					</Step>
				))}
			</Stepper>
			<Button
				onClick={goToPreviousStep}
				colorScheme="blue"
				sx={{ margin: "2px" }}
			>
				Previous
			</Button>
			<Button onClick={goToNextStep} colorScheme="blue">
				Next
			</Button>
		</Flex>
	);
};

export default AppStepper;
