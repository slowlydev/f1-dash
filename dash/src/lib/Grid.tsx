import { CSSProperties, ElementType, createContext, useContext } from "react";

// general types

export type GridComponentMap = {
	[key: string]: ElementType;
};

export type GridItem =
	| {
			component: keyof GridComponentMap;
			style?: CSSProperties;
	  }
	| GridStack;

export type GridStack = {
	direction: "row" | "column";
	children: GridItem[];
	style?: Omit<CSSProperties, "display" | "flexDirection">;
};

// grid context

type GridContextValues = {
	map: GridComponentMap;
};

const GridContext = createContext<GridContextValues | null>(null);

const useGridContext = () => {
	const context = useContext(GridContext);
	if (!context) {
		throw new Error("useGridContext must be used within a GridProvider");
	}
	return context;
};

// grid component

type GridProps = {
	map: GridComponentMap;
	stack: GridStack;
};

export const Grid = ({ map, stack }: GridProps) => {
	return (
		<GridContext.Provider value={{ map }}>
			<GridRenderer stack={stack} />
		</GridContext.Provider>
	);
};

// grid renderer

type GridRendererProps = {
	stack: GridStack;
};

const GridRenderer = ({ stack }: GridRendererProps) => {
	const { map } = useGridContext();

	return (
		<div style={{ ...stack.style, display: "flex", flexDirection: stack.direction }}>
			{stack.children.map((child, index) => {
				if ("component" in child) {
					const Component = map[child.component];
					return (
						<div key={index} className="border border-zinc-600" style={child.style}>
							<Component key={index} />
						</div>
					);
				} else {
					return <GridRenderer key={index} stack={child} />;
				}
			})}
		</div>
	);
};
