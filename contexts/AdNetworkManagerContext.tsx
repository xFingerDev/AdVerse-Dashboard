import AdNetworkManager from "@/manager/AdNetworkManager";
import { AdNetworkManagerInstance } from "@/manager/AdNetworkManagerInstance";
import { createContext, useContext } from "react";

const AdNetworkManagerContext = createContext<AdNetworkManager>(
  AdNetworkManagerInstance
);

export const AdNetworkManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <AdNetworkManagerContext.Provider value={AdNetworkManagerInstance}>
    {children}
  </AdNetworkManagerContext.Provider>
);

export const useAdNetworkManager = (): AdNetworkManager =>
  useContext(AdNetworkManagerContext);
