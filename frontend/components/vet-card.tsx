import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bot } from 'lucide-react'

interface VetCardProps {
  name: string
  image: string
  className?: string
}

export function VetCard({ name, image, className }: VetCardProps) {
  return (
    <div className={`bg-white rounded-xl p-2 shadow-lg flex items-center space-x-2 ${className}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback><Bot className="h-6 w-6" /></AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}

