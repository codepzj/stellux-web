import { IconSvgProps } from '@/shared/components/SvgIcon/types'

export const MoonIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9"
    />
  </svg>
)
