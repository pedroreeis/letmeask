import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export function useAuth() {
  const value = useContext(AuthContext)

  if (!value) throw new Error("useAuth must be used within a AuthProvider");

  return value;
}