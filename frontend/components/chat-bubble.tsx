import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  message: string
  timestamp: string
  avatar?: string
  isAudio?: boolean
  className?: string
}

export function ChatBubble({ message, timestamp, avatar, isAudio, className }: ChatBubbleProps) {
  return (
    <div className={cn("flex items-start space-x-2 max-w-[280px]", className)}>
      {avatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} />
          <AvatarFallback>VET</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col space-y-1">
        <div className={cn(
          "rounded-2xl p-3 text-sm",
          isAudio ? "bg-accent/20" : "bg-accent"
        )}>
          {isAudio ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-background" />
              </div>
              <div className="w-32 h-1 bg-accent rounded-full" />
              <span className="text-xs text-accent-foreground">0:32</span>
            </div>
          ) : (
            message
          )}
        </div>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>
    </div>
  )
}

