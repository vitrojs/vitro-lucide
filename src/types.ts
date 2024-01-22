import { FunctionMaybe } from 'vitro'

export type SVGAttributes = Partial<JSX.SVGAttributes<SVGSVGElement>>
type Option = {
	absoluteStrokeWidth?: boolean
	strokeWidth?: FunctionMaybe<number>
	size?: FunctionMaybe<24 | number>
}
export type LucideProps = Omit<
	JSX.SVGAttributes<SVGSVGElement>,
	'name' | 'strokeWidth' | 'size'
> &
	Option
