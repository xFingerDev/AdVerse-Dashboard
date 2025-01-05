import AdNetworkManager from "@/repository/AdNetworkManager";
import { createContext } from "react";

export const AdNetworkManagerContext = createContext<AdNetworkManager | null>(
  null
);
