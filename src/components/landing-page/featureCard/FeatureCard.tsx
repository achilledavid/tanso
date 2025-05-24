type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-xl border border-secondary transition-all hover:transform hover:translate-y-[-5px]">
      <div className="bg-purple-600/20 w-8 h-8 rounded-lg flex items-center justify-center mb-4 text-purple-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 font-[Deezer]">{title}</h3>
      <p className="text-secondary text-left">{description}</p>
    </div>
  )
}