import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  avatar: string
  rating: number
  testimonial: string
}

export function TestimonialCard({ name, avatar, rating, testimonial }: TestimonialCardProps) {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent
className="pt-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-4 border-2 border-primary">
            <AvatarImage src={avatar} alt={name} className="object-cover" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-primary">{name}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? "text-accent fill-accent" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground italic">&ldquo;{testimonial}&rdquo;</p>
      </CardContent>
    </Card>
  )
}

