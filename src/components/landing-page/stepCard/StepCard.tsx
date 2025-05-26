interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="relative p-6 rounded-xl border border-secondary">
      <span className="absolute -top-4 -left-4 bg-[#C17AFF] text-white text-base font-bold w-8 h-8 rounded-full flex items-center justify-center">
        {number}
      </span>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}