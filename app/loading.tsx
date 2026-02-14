import { SpinnerIcon } from "@/components/SvgIcon"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-2">
        <SpinnerIcon className="size-8 animate-spin" />
        <span>loading...</span>
      </div>
    </div>
  );
}
