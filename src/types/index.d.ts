/** @format */
import type React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReadableProps<T extends React.ComponentType<any>> = Prettify<
	React.ComponentProps<T>
>;

type PlainObject = Record<PropertyKey, unknown>;
