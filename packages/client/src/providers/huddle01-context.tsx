import React, { useEffect, useRef, useState } from "react"

interface IHuddle01Context {}

interface IHuddle01Provider {
  children: React.ReactNode
}

const Context = React.createContext<IHuddle01Context>({} as IHuddle01Context)

const Huddle01Provider = ({ children }: IHuddle01Provider) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>
}

const useHuddle01Context = () => {
  const c = React.useContext(Context)

  if (c === undefined) {
    throw new Error("useHuddle01Context must be used within a Huddle01Provider")
  }

  return c
}

export { Huddle01Provider, useHuddle01Context }
