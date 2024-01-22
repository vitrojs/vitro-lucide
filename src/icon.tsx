import { $$ } from "vitro";
import { LucideProps, SVGAttributes } from "./types";
const defaultAttributes: SVGAttributes = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
};

type IconProps = LucideProps & {
	name: string;
	nodes: string;
};

export const Icon: JSX.Component<IconProps> = ({
	color,
	size,
	strokeWidth,
	children,
	class: classes,
	name,
	nodes,
	absoluteStrokeWidth,

	...rest
}) => {
	return (
		<svg
			{...defaultAttributes}
			{...rest}
			width={size ?? defaultAttributes.width}
			height={size ?? defaultAttributes.height}
			stroke={color ?? defaultAttributes.stroke}
			stroke-width={
				absoluteStrokeWidth
					? () =>
							(Number($$(strokeWidth) ?? defaultAttributes["stroke-width"]) *
								24) /
							Number($$(size))
					: () => Number($$(strokeWidth) ?? defaultAttributes["stroke-width"])
			}
			class={["lucide", `lucide-${toKebabCase(name)}`, classes]}
			set:html={nodes}
		/>
	);
};

function toKebabCase(str: string) {
	return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
