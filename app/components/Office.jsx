"use client";
import { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import {
	Button,
	Input,
	Textarea,
	Box,
	VStack,
	HStack,
	Heading,
} from "@chakra-ui/react";
import theme from "../theme";

export default function Office() {
	const { addOfficeInfo } = useAppContext();
	const [equipmentList, setEquipmentList] = useState([]);
	const [newEquipmentName, setNewEquipmentName] = useState("");
	const [newEquipmentQuantity, setNewEquipmentQuantity] = useState("");
	const [coachList, setCoachList] = useState([]);
	const [newCoachName, setNewCoachName] = useState("");
	const [newCoachExperience, setNewCoachExperience] = useState("");
	const [classSchedule, setClassSchedule] = useState("");
	const [classDuration, setClassDuration] = useState("");

	const handleAddEquipment = () => {
		setEquipmentList([
			...equipmentList,
			{ name: newEquipmentName, quantity: newEquipmentQuantity },
		]);
		setNewEquipmentName("");
		setNewEquipmentQuantity("");
	};

	const updateEquipmentItem = (index, field, value) => {
		const newList = [...equipmentList];
		newList[index] = { ...newList[index], [field]: value };
		setEquipmentList(newList);
	};

	const handleAddCoach = () => {
		setCoachList([
			...coachList,
			{ name: newCoachName, experience: newCoachExperience },
		]);
		setNewCoachName("");
		setNewCoachExperience("");
	};

	const updateCoachItem = (index, field, value) => {
		const newList = [...coachList];
		newList[index] = { ...newList[index], [field]: value };
		setCoachList(newList);
	};

	const handleSubmit = () => {
		addOfficeInfo({ equipmentList, coachList, classSchedule, classDuration });
	};

	return (
		<Box className="container mx-auto" p={5}>
			<Heading as="h1" colorScheme="blue">
				Office
			</Heading>
			<VStack spacing={4}>
				<Box>
					<Heading as="h2" size="md">
						Gym Equipment
					</Heading>
					<HStack>
						<Input
							placeholder="Equipment name"
							value={newEquipmentName}
							onChange={(e) => setNewEquipmentName(e.target.value)}
						/>
						<Input
							placeholder="Qty"
							type="number"
							value={newEquipmentQuantity}
							onChange={(e) => setNewEquipmentQuantity(e.target.value)}
						/>
						<Button onClick={handleAddEquipment}>Add</Button>
					</HStack>
					{equipmentList.map((item, index) => (
						<HStack key={index}>
							<Input
								value={item.name}
								onChange={(e) =>
									updateEquipmentItem(index, "name", e.target.value)
								}
							/>
							<Input
								type="number"
								value={item.quantity}
								onChange={(e) =>
									updateEquipmentItem(index, "quantity", e.target.value)
								}
							/>
						</HStack>
					))}
				</Box>

				<Box>
					<Heading as="h2" size="md">
						Coaching Staff
					</Heading>
					<HStack>
						<Input
							placeholder="Coach name"
							value={newCoachName}
							onChange={(e) => setNewCoachName(e.target.value)}
						/>
						<Input
							placeholder="Experience"
							value={newCoachExperience}
							onChange={(e) => setNewCoachExperience(e.target.value)}
						/>
						<Button onClick={handleAddCoach}>Add</Button>
					</HStack>
					{coachList.map((coach, index) => (
						<HStack key={index}>
							<Input
								value={coach.name}
								onChange={(e) => updateCoachItem(index, "name", e.target.value)}
							/>
							<Input
								value={coach.experience}
								onChange={(e) =>
									updateCoachItem(index, "experience", e.target.value)
								}
							/>
						</HStack>
					))}
				</Box>

				<Box>
					<Heading as="h2" size="md">
						Class Schedule
					</Heading>
					<Textarea
						placeholder="Class Schedule"
						value={classSchedule}
						onChange={(e) => setClassSchedule(e.target.value)}
					/>
				</Box>

				<Box>
					<Heading as="h2" size="md">
						Class Duration
					</Heading>
					<Textarea
						placeholder="Class Duration"
						value={classDuration}
						onChange={(e) => setClassDuration(e.target.value)}
					/>
				</Box>
			</VStack>
			<Button colorScheme="blue" mt={4} onClick={handleSubmit}>
				Save
			</Button>
		</Box>
	);
}
