import { FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { COLORS } from '../../constants/color'
import { useAuth } from '../../contexts/AuthContext'
import { fetchExpensesByCategoryLastMonth } from '../../lib/transactions'
import { HEADER_TOP, HORIZONTAL_GUTTER } from '../../styles/spacing'

const { width } = Dimensions.get('window')

export default function Advices() {
  const { session, loading: authLoading } = useAuth()
  const [pieData, setPieData] = useState<{ value: number; color: string; gradientCenterColor?: string; label: string }[]>([])
  const [filteredAdvice, setFilteredAdvice] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const categoryColors: Record<string, string[]> = {
    Svago: ['#006DFF', '#006DFF'],
    Cibo: ['#93FCF8', '#3BE9DE'],
    Trasporti: ['#BDB2FA', '#8F80F3'],
    Bollette: ['#FFA5BA', '#FF7F97'],
  }

  const categoryIcons: Record<string, string> = {
    Svago: 'beer',
    Cibo: 'utensils',
    Trasporti: 'bus',
    Bollette: 'file-invoice-dollar',
  }

  // Hardcoded advice items used when a pie slice is selected
  useEffect(() => {
    const hardcodedAdvice = [
      { text: "Se riduci del 12% le spese per le consegne, risparmierai circa 18€/settimana; così potrai permetterti l'iPhone 15 che desideravi in ~9 mesi.", category: 'Svago' },
      { text: "Se salti la palestra questo mese, risparmierai 50€; è abbastanza per un weekend fuori porta.", category: 'Svago' },
      { text: "Se ti rechi al lavoro con un abbonamento per i trasporti pubblici, risparmierai 30€/mese; è abbastanza per una gita nel weekend.", category: 'Trasporti' },
      { text: "Se riduci del 10% le uscite settimanali al bar, risparmierai 20€/mese; così potrai avere un fondo emergenze di 500€ in ~6 mesi.", category: 'Cibo' }
    ]

    setFilteredAdvice(hardcodedAdvice)
  }, [])

  useEffect(() => {
    const load = async () => {
      if (!session?.user) return
      setLoading(true)
      const result = await fetchExpensesByCategoryLastMonth(session.user.id)

      // Map fetched totals to pie chart data
      const mapped = (result || []).map((r: any, idx: number) => {
        const color = (categoryColors[r.category] && categoryColors[r.category][0]) || ['#CCCCCC'][0]
        const gradient = (categoryColors[r.category] && categoryColors[r.category][1]) || color
        return { value: r.total, color, gradientCenterColor: gradient, label: r.category }
      })

      setPieData(mapped)
      setLoading(false)
    }

    load()
  }, [session])

  const renderStyledText = (text: string) => {
    const parts = text.split(/(\d+%?|\€\d+|\d+\s*(week|month)s?)/gi)
    return parts.map((part, i) => (
      /\d+%?|\€\d+|\d+\s*(week|month)s?/i.test(part)
        ? <Text key={i} style={{ fontWeight: 'bold', color: '#0B6623' }}>{part}</Text>
        : <Text key={i}>{part}</Text>
    ))
  }

  const renderDot = (color: string) => <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color, marginRight: 10 }} />

  const handlePiePress = (slice: any) => {
    // For demo purposes we filter hardcoded advice by category
    const advice = [
      { text: "Se riduci del 12% le spese per le consegne, risparmierai circa 18€/settimana; così potrai permetterti l'iPhone 15 che desideravi in ~9 mesi.", category: 'Svago' },
      { text: "Se salti la palestra questo mese, risparmierai 50€; è abbastanza per un weekend fuori porta.", category: 'Svago' },
      { text: "Se ti rechi al lavoro con un abbonamento per i trasporti pubblici, risparmierai 30€/mese; è abbastanza per una gita nel weekend.", category: 'Trasporti' },
      { text: "Se riduci del 10% le uscite settimanali al bar, risparmierai 20€/mese; così potrai avere un fondo emergenze di 500€ in ~6 mesi.", category: 'Cibo' }
    ]

    setFilteredAdvice(advice.filter(a => a.category === slice.label))
  }

  const renderLegendComponent = () => (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        {pieData.map((p) => (
          <View key={p.label} style={{ flexDirection: 'row', alignItems: 'center', width: 150, marginRight: 12, marginBottom: 6 }}>
            {renderDot(p.color)}<Text style={{ color: 'black' }}>{p.label}: {Math.round((p.value / Math.max(1, pieData.reduce((s, x) => s + x.value, 0))) * 100)}%</Text>
          </View>
        ))}
      </View>
    </>
  )

  if (authLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: HEADER_TOP }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: HORIZONTAL_GUTTER }}>
          <View>
            <Text style={{ color: "#333", fontSize: 28, fontWeight: 'bold' }}>Advices</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: HORIZONTAL_GUTTER }}>
          <View style={{ width, alignItems: 'center', paddingVertical: 20 }}>
            <PieChart
              data={pieData.map(p => ({ ...p, onPress: () => handlePiePress(p) }))}
              donut
              showGradient
              sectionAutoFocus
              radius={90}
              innerRadius={60}
              innerCircleColor={'#F5F5F5'}
              centerLabelComponent={() => <View />}
            />
            {renderLegendComponent()}
          </View>

          {filteredAdvice && filteredAdvice.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Consigli</Text>
              {filteredAdvice.map((item, index) => (
                <LinearGradient
                  key={index}
                  colors={categoryColors[item.category] || ['#CFFFE6', '#CFFFE6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row',
                    padding: 18,
                    borderRadius: 20,
                    marginBottom: 12,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    elevation: 3,
                    alignItems: 'center'
                  }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <FontAwesome5
                      name={categoryIcons[item.category] || 'lightbulb'}
                      size={18}
                      color="#fff"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, lineHeight: 22, color: '#031f17ff', flexWrap: 'wrap' }}>
                      {renderStyledText(item.text)}
                    </Text>
                  </View>
                </LinearGradient>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
  )
}