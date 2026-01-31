import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { useAuth } from '../../contexts/AuthContext'
import { fetchExpensesByCategoryLastMonth } from '../../lib/transactions'

const Advices = () => {
  const { session, loading: authLoading } = useAuth()
  const [data, setData] = useState<{ category: string; total: number }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return
      setLoading(true)
      const result = await fetchExpensesByCategoryLastMonth(session.user.id)
      setData(result)
      setLoading(false)
    }

    load()
  }, [session])

  if (authLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Last month expenses by category</Text>
      {data.length === 0 ? (
        <Text>No expenses found for last month.</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
              <Text>{item.category}</Text>
              <Text>{item.total} €</Text>
            </View>
          )}
        />
      )}
    </View>
  )
}

export default Advices