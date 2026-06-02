import {
  Grid2X2,
  MessageSquare,
  PlusCircle,
  UserRound,
  WalletCards,
  History,
} from "lucide-react";
import type { SatomiNavItem } from "@/src/lib/satomi-data";

export const navIconMap = {
  dashboard: Grid2X2,
  chat: MessageSquare,
  add: PlusCircle,
  pockets: WalletCards,
  profile: UserRound,
  history: History,
} satisfies Record<SatomiNavItem["icon"], typeof Grid2X2>;
