import { cn } from '@/shared/lib/utils'
import { IconSvgProps } from '@/shared/components/SvgIcon/types'

const CENTER_OFFSET = 'translate(2 2.05)'

export const WikiIcon = ({ size = 24, width, height, className, ...props }: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width ?? size}
    height={height ?? size}
    viewBox="0 0 24 24"
    data-name="BookTypeDefault"
    className={cn('block max-h-full max-w-full shrink-0', className)}
    {...props}
  >
    <g fill="none" fillRule="evenodd" transform={CENTER_OFFSET}>
      <path
        d="M4.75 1.267h10.5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4.75a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2Z"
        fill="#C4DCFF"
      ></path>
      <path d="M4.75 1.267h2.215v18H5.75a3 3 0 0 1-3-3v-13a2 2 0 0 1 2-2Z" fill="#679FF4"></path>
      <path stroke="#397ABD" d="M7.25 1.1v17.667"></path>
      <path
        stroke="#397ABD"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.85 5.394h3.4"
      ></path>
      <path
        d="M4.25 1.267h11.5a1.5 1.5 0 0 1 1.5 1.5v14.5a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5v-14.5a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="#397ABD"
      ></path>
    </g>
  </svg>
)
