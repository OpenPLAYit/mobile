/** @format */

import * as React from "react";
import { create } from "zustand";

const DEFAULT_PORTAL_HOST = "INTERNAL_PRIMITIVE_DEFAULT_HOST_NAME";

type PortalMap = Map<string, React.ReactNode>;
type PortalHostMap = Map<string, PortalMap>;

const usePortal = create<{ map: PortalHostMap }>(() => ({
	map: new Map<string, PortalMap>().set(
		DEFAULT_PORTAL_HOST,
		new Map<string, React.ReactNode>(),
	),
}));

const updatePortal = (
	hostName: string,
	name: string,
	children: React.ReactNode,
) => {
	usePortal.setState((prev) => {
		const next = new Map(prev.map);
		const portal = next.get(hostName) ?? new Map<string, React.ReactNode>();
		portal.set(name, children);
		next.set(hostName, portal);
		return { map: next };
	});
};
const removePortal = (hostName: string, name: string) => {
	usePortal.setState((prev) => {
		const next = new Map(prev.map);
		const portal = next.get(hostName) ?? new Map<string, React.ReactNode>();
		portal.delete(name);
		next.set(hostName, portal);
		return { map: next };
	});
};

interface PortalHostProps {
	name?: string;
}

/**
 * @see {@link https://rn-primitives.vercel.app/portal/}
 */
const PortalHost: React.FC<PortalHostProps> = ({
	name = "DEFAULT_PORTAL_HOST",
}) => {
	const portalMap =
		usePortal((state) => state.map).get(name) ??
		new Map<string, React.ReactNode>();

	if (portalMap.size === 0) return null;

	return <>{Array.from(portalMap.values())}</>;
};

interface PortalProps {
	name: string;
	hostName?: string;
	children: React.ReactNode;
}

/**
 * @see {@link https://rn-primitives.vercel.app/portal/}
 */
const Portal: React.FC<PortalProps> = ({
	name,
	hostName = DEFAULT_PORTAL_HOST,
	children,
}) => {
	React.useEffect(() => {
		updatePortal(hostName, name, children);
	}, [hostName, name, children]);

	React.useEffect(() => {
		return () => {
			removePortal(hostName, name);
		};
	}, [hostName, name]);

	return null;
};

export { Portal, PortalHost };
export type { PortalProps, PortalHostProps };
