"use client";
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
	Box,
	Text,
	Textarea,
	Button,
	VStack,
	Heading,
	useToast,
} from "@chakra-ui/react";

export default function Whiteboard() {
	const { addWhiteboardInfo } = useAppContext();
	const toast = useToast();
	const [workoutFormat, setWorkoutFormat] = useState(
		"Crossfit Classes: Warmup, Strength, Metcon, Cool Down, Mobility | Olympic Lifting: Warmup, Strength, Cool Down"
	);
	const [cycleLength, setCycleLength] = useState("Crossfit Classes: 1 week");
	const [focus, setFocus] = useState("Squat, Deadlift, Bench, outside cardio");
	const [exampleWorkout, setExampleWorkout] = useState(
		"Warm up: Hip halo into goblet squat, Strength: 5x5 Back Squat, Metcon: 21-15-9 Wall Balls, Burpees, Cool Down: 5 min bike, Mobility: Couch Stretch"
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		addWhiteboardInfo({ cycleLength, workoutFormat, focus, exampleWorkout });
		document.getElementById("metcon").scrollIntoView({ behavior: "smooth" });
		toast({
			title: "Information Added.",
			description: "Your whiteboard information has been added successfully.",
			status: "success",
			duration: 9000,
			isClosable: true,
		});
	};

	return (
		<Box className="container" mx="auto" my={6}>
			<Heading as="h1" size="xl" fontWeight="bold">
				Whiteboard
			</Heading>

			<VStack my={4} spacing={4}>
				<Box w="full">
					<Heading as="h2" size="lg">
						Workout Format
					</Heading>
					<Textarea
						placeholder="Describe the workout format"
						value={workoutFormat}
						onChange={(e) => setWorkoutFormat(e.target.value)}
						size="lg"
					/>
				</Box>

				<Box w="full">
					<Heading as="h2" size="lg">
						Cycle Length
					</Heading>
					<Textarea
						placeholder="Describe the cycle length"
						value={cycleLength}
						onChange={(e) => setCycleLength(e.target.value)}
						size="lg"
					/>
				</Box>

				<Box w="full">
					<Heading as="h2" size="lg">
						Focuses
					</Heading>
					<Textarea
						placeholder="Describe the focuses"
						value={focus}
						onChange={(e) => setFocus(e.target.value)}
						size="lg"
					/>
				</Box>

				<Box w="full">
					<Heading as="h2" size="lg">
						Template Workouts
					</Heading>
					<Textarea
						placeholder="Describe the example workouts"
						value={exampleWorkout}
						onChange={(e) => setExampleWorkout(e.target.value)}
						size="lg"
					/>
				</Box>
			</VStack>

			<Button colorScheme="blue" mt={4} onClick={handleSubmit}>
				Next
			</Button>
		</Box>
	);
}
