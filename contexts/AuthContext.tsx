import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  session: Session | null
  loading: boolean
  isOnboarding: boolean
  beginOnboarding: () => void
  finishOnboarding: () => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  isOnboarding: false,
  beginOnboarding: () => {},
  finishOnboarding: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnboarding, setIsOnboarding] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        setIsOnboarding(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isOnboarding,
        beginOnboarding: () => setIsOnboarding(true),
        finishOnboarding: () => setIsOnboarding(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)