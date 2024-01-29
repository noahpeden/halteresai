"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useChatCompletion } from "../hooks/useOpenAiStream/chat-hook";
import {
	Box,
	Heading,
	Button,
	Spinner,
	VStack,
	List,
	ListItem,
	ListIcon,
	Text,
	Code,
	HStack,
	Badge,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const OPEN_AI_API_KEY = "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";

export default function Metcon() {
	const { office, whiteboard } = useAppContext();
	const [loading, setLoading] = useState(false);
	const userPrompt = `
  Based on the provided gym information, create a detailed ${whiteboard.cycleLength} CrossFit workout plan. Include workouts for each day, tailored to the available equipment and coaching expertise. Specify exact workouts, including scaled and RX weights for each exercise, without suggesting repetitions of previous workouts or scaling instructions. Focus solely on listing unique and specific workouts for each day of the ${whiteboard.cycleLength}.
  Here are the included details: 
  - Gym Equipment: ${office.equipment}, 
  - Coaching staff: ${office.coachInfo}, 
  - Class Schedule: ${office.classSchedule}, 
  - Class duration: ${office.classDuration}, 
  - Workout format: ${whiteboard.workoutFormat}, 
  - Workout cycle length: ${whiteboard.cycleLength}, 
  - Workout focus: ${whiteboard.focus}, 
  - Template workout: ${whiteboard.exampleWorkout};
  `;

	const prompt = [
		{
			content: userPrompt,
			role: "user",
		},
	];

	const { messages, submitPrompt } = useChatCompletion({
		model: "gpt-3.5-turbo",
		apiKey: OPEN_AI_API_KEY,
		temperature: 0.9,
	});

	const handleGenerateProgramming = () => {
		setLoading(true);
		submitPrompt(prompt);
		console.log(messages);
		setLoading(false);
	};

	useEffect(() => {
		window.scrollTo(0, document.body.scrollHeight);
	}, [messages]);

	return (
		<Box className="container" mx="auto" my={6}>
			<Heading as="h1" size="2xl" fontWeight="bold">
				Metcon
			</Heading>
			<Box my={4}>
				<Heading as="h2" size="xl">
					Review Details
				</Heading>

				<Box my={4}>
					<Heading as="h3" size="lg" fontWeight="semibold">
						Office Details
					</Heading>
					<List spacing={3}>
						<ListItem>
							Equipment List:
							<List>
								{office?.equipmentList?.map((item, index) => (
									<ListItem key={index}>
										<ListIcon as={CheckCircleIcon} color="green.500" />
										{item.quantity}x {item.name}
									</ListItem>
								))}
							</List>
						</ListItem>
						<ListItem>
							Coaching Staff:
							<List>
								{office?.coachList?.map((coach, index) => (
									<ListItem key={index}>
										<ListIcon as={MdCheckCircle} color="green.500" />
										{coach.name} - {coach.experience}
									</ListItem>
								))}
							</List>
						</ListItem>
						<ListItem>Class Schedule: {office.classSchedule}</ListItem>
						<ListItem>Class Duration: {office.classDuration}</ListItem>
					</List>
				</Box>

				<Box my={4}>
					<Heading as="h3" size="lg" fontWeight="semibold">
						Whiteboard Details
					</Heading>
					<List spacing={3}>
						<ListItem>Cycle Length: {whiteboard.cycleLength}</ListItem>
						<ListItem>Workout Format: {whiteboard.workoutFormat}</ListItem>
						<ListItem>Focus: {whiteboard.focus}</ListItem>
						<ListItem>Example Workout: {whiteboard.exampleWorkout}</ListItem>
					</List>
				</Box>
			</Box>
			<Button colorScheme="blue" my={4} onClick={handleGenerateProgramming}>
				{loading ? <Spinner size="sm" /> : "Generate Programming"}
			</Button>
			<Box>
				<Heading as="h2" size="xl" mt={4}>
					Generated Programming
				</Heading>
				<Box>
					{messages.length < 1 ? (
						<Text>No messages</Text>
					) : (
						messages.map((msg, i) => (
							<VStack align="stretch" key={i}>
								<Text fontWeight="bold">Role: {msg.role}</Text>
								<Code p={2}>{msg.content}</Code>
								{!msg.meta.loading && (
									<HStack>
										{msg.role === "assistant" && (
											<>
												<Badge colorScheme="green">
													Tokens: {msg.meta.chunks.length}
												</Badge>
												<Badge colorScheme="blue">
													Response time: {msg.meta.responseTime}
												</Badge>
											</>
										)}
									</HStack>
								)}
							</VStack>
						))
					)}
				</Box>
			</Box>
		</Box>
	);
}
