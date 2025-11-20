import { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  session: Session | null
  loading: boolean
  isOnboarding: boolean
  isCelebrating: boolean
  beginOnboarding: () => void
  finishOnboarding: () => void
  startCelebration: () => void
  endCelebration: () => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  isOnboarding: false,
  isCelebrating: false,
  beginOnboarding: () => {},
  finishOnboarding: () => {},
  startCelebration: () => {},
  endCelebration: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)

  useEffect(() => {
    // Enter the object → take "data" → inside "data" take "session"
    // → create "session" variable
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        setIsOnboarding(false)
        setIsCelebrating(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    // Allows all children components to access AuthContext values
    // So anyone using useAuth() can access these values and call these functions
    <AuthContext.Provider
      value={{
        session,
        loading,
        isOnboarding,
        isCelebrating,
        beginOnboarding: () => setIsOnboarding(true),
        finishOnboarding: () => setIsOnboarding(false),
        startCelebration: () => {
          setIsCelebrating(true)
          setIsOnboarding(false)
        },
        endCelebration: () => setIsCelebrating(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Allow other components to use the AuthContext values using useAuth() hook
// Hiding the useContext(AuthContext) implementation details
// Instead of: const { session, loading } = useContext(AuthContext)
// Use: const { session, loading } = useAuth()
export const useAuth = () => useContext(AuthContext)
