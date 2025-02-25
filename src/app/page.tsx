
import PadGrid from "@/components/pad-grid"

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <PadGrid padCount={9} />
    </div>
  )
}