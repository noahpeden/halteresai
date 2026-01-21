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
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const OPEN_AI_API_KEY = "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";

// Generation phases
const PHASE = {
	INITIAL: "initial",
	SKELETON: "skeleton",
	APPROVED: "approved",
	FULL: "full",
};

export default function Metcon() {
	const { office, whiteboard } = useAppContext();
	const [loading, setLoading] = useState(false);
	const [phase, setPhase] = useState(PHASE.INITIAL);
	const [skeletonContent, setSkeletonContent] = useState("");

	// Phase 1: Skeleton prompt - just high-level structure, no details
	const skeletonPrompt = `
You are creating a ${whiteboard.cycleLength} CrossFit program skeleton. Generate ONLY a brief outline for each workout day.

For each day, provide ONLY:
- Day number and name (e.g., "Day 1 - Monday")
- Primary focus in 3-5 words (e.g., "Upper Body Push + Conditioning")
- Workout format type (e.g., "Strength + AMRAP", "EMOM", "For Time")
- 2-3 movement categories that will be used (e.g., "Pressing, Squatting, Cardio")

DO NOT include:
- Specific exercises or movements
- Rep schemes or set counts
- Weights or percentages
- Warm-up or cool-down details
- Coaching cues or pacing strategies
- Scaling options

Keep each day to 3-4 lines maximum. This is just a skeleton for approval before generating full details.

Gym context:
- Equipment: ${office.equipment}
- Cycle length: ${whiteboard.cycleLength}
- Workout format: ${whiteboard.workoutFormat}
- Focus: ${whiteboard.focus}
`;

	// Phase 2: Full workout prompt - detailed generation based on approved skeleton
	const fullWorkoutPrompt = `
Based on the approved workout skeleton below, now generate the COMPLETE detailed workouts for each day.

APPROVED SKELETON:
${skeletonContent}

For each day in the skeleton, now provide the full workout including:
- Detailed warm-up (10-15 minutes)
- Specific exercises with exact rep schemes
- RX and scaled weights for all movements
- Conditioning work with full details
- Coaching cues and pacing strategies
- Cool-down and mobility work
- Stimulus and strategy notes

Gym Details:
- Equipment: ${office.equipment}
- Coaching staff: ${office.coachInfo}
- Class Schedule: ${office.classSchedule}
- Class duration: ${office.classDuration}
- Workout format: ${whiteboard.workoutFormat}
- Cycle length: ${whiteboard.cycleLength}
- Focus: ${whiteboard.focus}
- Template workout style: ${whiteboard.exampleWorkout}

Generate complete, detailed workouts following the structure from the skeleton.
`;

	const { messages, submitPrompt, resetMessages } = useChatCompletion({
		model: "gpt-3.5-turbo",
		apiKey: OPEN_AI_API_KEY,
		temperature: 0.9,
	});

	// Generate skeleton (Phase 1)
	const handleGenerateSkeleton = () => {
		setLoading(true);
		setPhase(PHASE.SKELETON);
		resetMessages();
		submitPrompt([{ content: skeletonPrompt, role: "user" }]);
	};

	// Approve skeleton and generate full workouts (Phase 2)
	const handleApproveSkeleton = () => {
		// Capture the skeleton content from the assistant's response
		const assistantMessage = messages.find((m) => m.role === "assistant");
		if (assistantMessage) {
			setSkeletonContent(assistantMessage.content);
			setPhase(PHASE.APPROVED);
		}
	};

	// Generate full workouts after approval
	const handleGenerateFullWorkouts = () => {
		setLoading(true);
		setPhase(PHASE.FULL);
		resetMessages();
		submitPrompt([{ content: fullWorkoutPrompt, role: "user" }]);
	};

	// Trigger full generation once skeleton is approved and content is set
	useEffect(() => {
		if (phase === PHASE.APPROVED && skeletonContent) {
			handleGenerateFullWorkouts();
		}
	}, [phase, skeletonContent]);

	// Update loading state based on message status
	useEffect(() => {
		const lastMessage = messages[messages.length - 1];
		if (lastMessage && !lastMessage.meta?.loading) {
			setLoading(false);
		}
	}, [messages]);

	// Reset to start over
	const handleReset = () => {
		setPhase(PHASE.INITIAL);
		setSkeletonContent("");
		resetMessages();
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
				{/* Phase-based action buttons */}
			<HStack spacing={4} my={4}>
				{phase === PHASE.INITIAL && (
					<Button
						colorScheme="blue"
						onClick={handleGenerateSkeleton}
						isLoading={loading}
						loadingText="Generating Skeleton..."
					>
						Generate Program Skeleton
					</Button>
				)}

				{phase === PHASE.SKELETON && !loading && messages.length > 0 && (
					<>
						<Button colorScheme="green" onClick={handleApproveSkeleton}>
							Approve & Generate Full Workouts
						</Button>
						<Button colorScheme="gray" variant="outline" onClick={handleReset}>
							Start Over
						</Button>
					</>
				)}

				{phase === PHASE.FULL && !loading && (
					<Button colorScheme="gray" variant="outline" onClick={handleReset}>
						Generate New Program
					</Button>
				)}

				{loading && (
					<HStack>
						<Spinner size="sm" />
						<Text>
							{phase === PHASE.SKELETON
								? "Generating skeleton..."
								: "Generating full workouts..."}
						</Text>
					</HStack>
				)}
			</HStack>

			{/* Phase indicator */}
			{phase !== PHASE.INITIAL && (
				<Alert
					status={phase === PHASE.FULL && !loading ? "success" : "info"}
					mb={4}
				>
					<AlertIcon />
					<Box>
						<AlertTitle>
							{phase === PHASE.SKELETON && "Phase 1: Skeleton Generation"}
							{phase === PHASE.APPROVED && "Skeleton Approved"}
							{phase === PHASE.FULL && !loading && "Phase 2: Complete"}
							{phase === PHASE.FULL && loading && "Phase 2: Generating Full Workouts"}
						</AlertTitle>
						<AlertDescription>
							{phase === PHASE.SKELETON &&
								!loading &&
								"Review the workout skeleton below. If it looks good, approve it to generate full workout details."}
							{phase === PHASE.SKELETON &&
								loading &&
								"Generating a quick outline of your program..."}
							{phase === PHASE.FULL &&
								!loading &&
								"Your complete workout program has been generated."}
							{phase === PHASE.FULL &&
								loading &&
								"Now generating detailed workouts based on the approved skeleton..."}
						</AlertDescription>
					</Box>
				</Alert>
			)}

			<Box>
				<Heading as="h2" size="xl" mt={4}>
					{phase === PHASE.SKELETON
						? "Program Skeleton (Preview)"
						: phase === PHASE.FULL
						? "Complete Program"
						: "Generated Programming"}
				</Heading>
				<Box>
					{messages.length < 1 ? (
						<Text color="gray.500">
							{phase === PHASE.INITIAL
								? "Click 'Generate Program Skeleton' to start. You'll review a quick outline before generating full workouts."
								: "Generating..."}
						</Text>
					) : (
						messages.map((msg, i) => (
							<VStack align="stretch" key={i} my={4}>
								{msg.role === "assistant" && (
									<>
										<Code p={4} whiteSpace="pre-wrap" display="block">
											{msg.content}
										</Code>
										{!msg.meta.loading && (
											<HStack>
												<Badge colorScheme="green">
													Tokens: {msg.meta.chunks.length}
												</Badge>
												<Badge colorScheme="blue">
													Response time: {msg.meta.responseTime}
												</Badge>
											</HStack>
										)}
									</>
								)}
							</VStack>
						))
					)}
				</Box>
			</Box>
		</Box>
	);
}
