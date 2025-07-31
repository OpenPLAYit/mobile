/** @format */

import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import {
	Modal,
	ModalBackdrop,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@/components/ui/modal";
import {
	Radio,
	RadioGroup,
	RadioIcon,
	RadioIndicator,
	RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { CircleIcon } from "lucide-react-native";
import React from "react";

const SORT_KEYS = ["date", "name", "size", "duration"] as const;
type SortKey = (typeof SORT_KEYS)[number];

const SORT_ORDERS = ["descending", "ascending"] as const;
type SortOrder = (typeof SORT_ORDERS)[number];

export interface SortingState {
	key: SortKey;
	selected: SortOrder;
}

type SortOption = Prettify<
	Record<SortOrder, string> & {
		key: SortKey;
	}
>;

const sortOptions = [
	{
		key: "date",
		descending: "From new to old",
		ascending: "From old to new",
	},
	{
		key: "name",
		descending: "From Z to A",
		ascending: "From A to Z",
	},
	{
		key: "size",
		descending: "From big to small",
		ascending: "From small to big",
	},
	{
		key: "duration",
		descending: "From long to short",
		ascending: "From short to long",
	},
] as const satisfies SortOption[];

interface SortingRadioProps {
	value: string;
	label: string;
	variant: "key" | "order";
}
const SortingRadio: React.FC<SortingRadioProps> = ({
	value,
	label,
	variant,
}) => {
	return (
		<Radio value={value} className="justify-between">
			<RadioLabel
				className={cn("capitalize", variant === "key" && "text-xl")}>
				{label}
			</RadioLabel>
			<RadioIndicator className="data-[checked=true]:border-success-500">
				<RadioIcon
					className="fill-success-500 stroke-success-500"
					as={CircleIcon}
				/>
			</RadioIndicator>
		</Radio>
	);
};

interface SortOrderGroupProps {
	sortingState: SortingState;
	onOrderChange: (order: SortOrder) => void;
}
const SortOrderGroup: React.FC<SortOrderGroupProps> = ({
	sortingState,
	onOrderChange,
}) => {
	const activeSortOption = sortOptions.find(
		({ key }) => key === sortingState.key,
	);
	if (!activeSortOption) {
		throw new Error(
			"[SortOrderGroup]: sorting state and sort options mismatch.",
		);
	}

	return (
		<RadioGroup
			className="gap-4"
			value={sortingState.selected}
			onChange={(order: SortOrder) => onOrderChange(order)}>
			{SORT_ORDERS.map((order) => {
				return (
					<SortingRadio
						key={order}
						value={order}
						label={activeSortOption[order]}
						variant="order"
					/>
				);
			})}
		</RadioGroup>
	);
};

export interface VideoSortingModalProps {
	onSortingChange: (state: SortingState) => void;
	sortingState: SortingState;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
export const VideoSortingModal: React.FC<VideoSortingModalProps> = ({
	onSortingChange,
	sortingState: externalSortingState,
	open,
	onOpenChange,
}) => {
	const [optimisticSortingState, setOptimisticSortingState] =
		React.useState<SortingState>(externalSortingState);

	return (
		<Modal isOpen={open} onClose={() => onOpenChange(false)}>
			<ModalBackdrop />
			<ModalContent className="gap-6">
				<ModalHeader>
					<Heading size="3xl" className="text-success-500">
						Sort by
					</Heading>
				</ModalHeader>

				<ModalBody>
					<Box className="gap-4">
						<RadioGroup
							className="gap-4"
							value={optimisticSortingState.key}
							onChange={(key: SortKey) =>
								setOptimisticSortingState({
									key,
									selected: "descending",
								})
							}>
							{SORT_KEYS.map((key) => {
								return (
									<SortingRadio
										key={key}
										value={key}
										label={key}
										variant="key"
									/>
								);
							})}
						</RadioGroup>

						<Divider />

						<SortOrderGroup
							sortingState={optimisticSortingState}
							onOrderChange={(order) =>
								setOptimisticSortingState((prevState) => ({
									...prevState,
									selected: order,
								}))
							}
						/>
					</Box>
				</ModalBody>

				<ModalFooter className="gap-6">
					<ModalCloseButton>
						<Text>Cancel</Text>
					</ModalCloseButton>

					<ModalCloseButton
						onPress={() => {
							onOpenChange(false);
							onSortingChange(optimisticSortingState);
						}}>
						<Text className="font-semibold text-success-500">
							OK
						</Text>
					</ModalCloseButton>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
