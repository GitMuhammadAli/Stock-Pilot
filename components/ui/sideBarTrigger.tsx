import { Button } from "./button";
import { Menu } from "lucide-react";
export function SidebarTrigger({ className, onClick }: { className?: string; onClick?: () => void }) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={className}
        onClick={onClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
    )
  }