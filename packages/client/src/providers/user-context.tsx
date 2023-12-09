import React from "react"

interface IUserContext {
  isLoggedIn: boolean
  user: {
    name: string
    isCreator: boolean
    walletAddress: string
  }
}

interface IUserProvider {
  children: React.ReactNode
}

const Context = React.createContext<IUserContext>({
  isLoggedIn: false,
  user: {
    name: "",
    isCreator: false,
    walletAddress: "",
  },
} as IUserContext)

const UserProvider = ({ children }: IUserProvider) => {
  return (
    <Context.Provider
      value={{
        isLoggedIn: false,
        user: {
          name: "",
          isCreator: false,
          walletAddress: "",
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

const useUserContext = () => {
  const c = React.useContext(Context)

  if (c === undefined) {
    throw new Error("useUserContext must be used within a UserProvider")
  }

  return c
}

export { UserProvider, useUserContext }
