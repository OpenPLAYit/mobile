/** @format */

import React from "react";
import { createModal } from "@gluestack-ui/modal";
import { Pressable, View, ScrollView, type ViewStyle } from "react-native";
import {
	Motion,
	AnimatePresence,
	createMotionAnimatedComponent,
	type MotionComponentProps,
} from "@legendapp/motion";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
	withStyleContext,
	useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";

type IAnimatedPressableProps = React.ComponentProps<typeof Pressable> &
	MotionComponentProps<
		typeof Pressable,
		ViewStyle,
		unknown,
		unknown,
		unknown
	>;

const AnimatedPressable = createMotionAnimatedComponent(
	Pressable,
) as React.ComponentType<IAnimatedPressableProps>;
const SCOPE = "MODAL";

type IMotionViewProps = React.ComponentProps<typeof View> &
	MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>;

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

const UIModal = createModal({
	Root: withStyleContext(View, SCOPE),
	Backdrop: AnimatedPressable,
	Content: MotionView,
	Body: ScrollView,
	CloseButton: Pressable,
	Footer: View,
	Header: View,
	AnimatePresence: AnimatePresence,
});

cssInterop(AnimatedPressable, { className: "style" });
cssInterop(MotionView, { className: "style" });

const modalStyle = tva({
	base: "group/modal w-full h-full justify-center items-center web:pointer-events-none",
	variants: {
		size: {
			xs: "",
			sm: "",
			md: "",
			lg: "",
			full: "",
		},
	},
});

const modalBackdropStyle = tva({
	base: "absolute left-0 top-0 right-0 bottom-0 bg-background-dark web:cursor-default",
});

const modalContentStyle = tva({
	base: "bg-background-0 rounded-md overflow-hidden border border-outline-100 shadow-hard-2 p-6",
	parentVariants: {
		size: {
			xs: "w-[60%] max-w-[360px]",
			sm: "w-[70%] max-w-[420px]",
			md: "w-[80%] max-w-[510px]",
			lg: "w-[90%] max-w-[640px]",
			full: "w-full",
		},
	},
});

const modalBodyStyle = tva({
	base: "mt-2 mb-6",
});

const modalCloseButtonStyle = tva({
	base: "group/modal-close-button z-10 rounded cursor-pointer",
});

const modalHeaderStyle = tva({
	base: "justify-between items-center flex-row",
});

const modalFooterStyle = tva({
	base: "flex-row justify-end items-center gap-2",
});

type ModalProps = Prettify<
	React.ComponentProps<typeof UIModal> &
		VariantProps<typeof modalStyle> & { className?: string }
>;

const Modal: React.FC<ModalProps> = ({ className, size = "md", ...props }) => (
	<UIModal
		{...props}
		pointerEvents="box-none"
		className={modalStyle({ size, class: className })}
		context={{ size }}
	/>
);

type ModalBackdropProps = Prettify<
	React.ComponentProps<typeof UIModal.Backdrop> &
		VariantProps<typeof modalBackdropStyle> & { className?: string }
>;

const ModalBackdrop: React.FC<ModalBackdropProps> = ({
	className,
	...props
}) => {
	return (
		<UIModal.Backdrop
			{...props}
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 0.5,
			}}
			exit={{
				opacity: 0,
			}}
			transition={{
				type: "spring",
				damping: 18,
				stiffness: 250,
				opacity: {
					type: "timing",
					duration: 250,
				},
			}}
			className={modalBackdropStyle({
				class: className,
			})}
		/>
	);
};

type ModalContentProps = Prettify<
	React.ComponentProps<typeof UIModal.Content> &
		VariantProps<typeof modalContentStyle> & { className?: string }
>;

const ModalContent: React.FC<ModalContentProps> = ({
	className,
	size,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof modalContentStyle
	>;

	return (
		<UIModal.Content
			{...props}
			initial={{
				opacity: 0,
				scale: 0.9,
			}}
			animate={{
				opacity: 1,
				scale: 1,
			}}
			exit={{
				opacity: 0,
			}}
			transition={{
				type: "spring",
				damping: 18,
				stiffness: 250,
				opacity: {
					type: "timing",
					duration: 250,
				},
			}}
			className={modalContentStyle({
				parentVariants: {
					size: parentSize,
				},
				size,
				class: className,
			})}
			pointerEvents="auto"
		/>
	);
};

type ModalHeaderProps = Prettify<
	React.ComponentProps<typeof UIModal.Header> &
		VariantProps<typeof modalHeaderStyle> & { className?: string }
>;

const ModalHeader: React.FC<ModalHeaderProps> = ({ className, ...props }) => {
	return (
		<UIModal.Header
			{...props}
			className={modalHeaderStyle({
				class: className,
			})}
		/>
	);
};

type ModalBodyProps = Prettify<
	React.ComponentProps<typeof UIModal.Body> &
		VariantProps<typeof modalBodyStyle> & { className?: string }
>;

const ModalBody: React.FC<ModalBodyProps> = ({ className, ...props }) => {
	return (
		<UIModal.Body
			{...props}
			className={modalBodyStyle({
				class: className,
			})}
		/>
	);
};

type ModalFooterProps = Prettify<
	React.ComponentProps<typeof UIModal.Footer> &
		VariantProps<typeof modalFooterStyle> & { className?: string }
>;

const ModalFooter: React.FC<ModalFooterProps> = ({ className, ...props }) => {
	return (
		<UIModal.Footer
			{...props}
			className={modalFooterStyle({
				class: className,
			})}
		/>
	);
};

type ModalCloseButtonProps = Prettify<
	React.ComponentProps<typeof UIModal.CloseButton> &
		VariantProps<typeof modalCloseButtonStyle> & { className?: string }
>;

const ModalCloseButton: React.FC<ModalCloseButtonProps> = ({
	className,
	...props
}) => {
	return (
		<UIModal.CloseButton
			{...props}
			className={modalCloseButtonStyle({
				class: className,
			})}
		/>
	);
};

export {
	Modal,
	ModalBackdrop,
	ModalContent,
	ModalCloseButton,
	ModalHeader,
	ModalBody,
	ModalFooter,
};

export type {
	ModalProps,
	ModalBackdropProps,
	ModalContentProps,
	ModalCloseButtonProps,
	ModalHeaderProps,
	ModalBodyProps,
	ModalFooterProps,
};
