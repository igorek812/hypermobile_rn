import { createContext, useContext, useState } from "react";
import AgentWalletModel from "../models/agent-wallet-model";

interface AuthContextType {
  agentWallet: AgentWalletModel | null
  setAgentWallet: (p: AgentWalletModel | null) => void
  isLoading: boolean
  setIsLoading: (p: boolean) => void
//   logout: () => void
}


const GlobalContext = createContext<AuthContextType>({
    agentWallet: null,
    setAgentWallet: async () => {},
    isLoading: true,
    setIsLoading: async () => {},
    // logout: () => {}
})

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({children}: {children: any}) => {

    const [agentWallet, setAgentWallet] = useState<AgentWalletModel | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    return(
        <GlobalContext.Provider 
            value={{
                agentWallet,
                setAgentWallet,
                isLoading,
                setIsLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider