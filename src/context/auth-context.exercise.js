// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext
import {createContext, useContext} from 'react'
export const AuthContext = createContext()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthContext provider`)
  }
  return context
}
