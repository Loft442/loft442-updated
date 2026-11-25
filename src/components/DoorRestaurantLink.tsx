import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const DOOR_RESTAURANT_URL = "https://thedoorrestaurant.nyc";

type DoorRestaurantLinkProps = {
  children?: ReactNode;
  className?: string;
};

export default function DoorRestaurantLink({
  children = "The Door",
  className,
}: DoorRestaurantLinkProps) {
  return (
    <a
      href={DOOR_RESTAURANT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-gold underline decoration-gold/50 underline-offset-[4px] transition-colors hover:text-gold-light hover:decoration-gold",
        className
      )}
    >
      {children}
    </a>
  );
}
