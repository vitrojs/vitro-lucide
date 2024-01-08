import { FunctionMaybe } from 'vitro'

export type SVGAttributes = Partial<JSX.SVGAttributes<SVGSVGElement>>
type Option = {
  absoluteStrokeWidth?: boolean
  strokeWidth?: FunctionMaybe<number>
}
export type LucideProps = Omit<
  JSX.SVGAttributes<SVGSVGElement>,
  'name' | 'strokeWidth'
> &
  Option
