import { IconSvgProps } from '@/shared/components/SvgIcon/types'

export const BackToTopIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14 3H2V2h12zM7.979 4.008l4.484 4.484l-.707.707l-3.277-3.277v7.984h-1V5.922L4.2 9.199l-.707-.707z"
        clipRule="evenodd"
      />
    </svg>
  )
}
