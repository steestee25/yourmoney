import { FontAwesome5 } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { COLORS } from '../../constants/color'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from '../../lib/i18n'
import { fetchExpensesByCategoryLast3Months, fetchExpensesByCategoryLastMonth, fetchExpensesByCategoryLastYear } from '../../lib/transactions'
import locales from '../../locales/locales.json'
import { HEADER_TOP, HORIZONTAL_GUTTER } from '../../styles/spacing'

const { width } = Dimensions.get('window')

type PeriodType = 'month' | '3months' | 'year'

export default function Advices() {
  const { session, loading: authLoading } = useAuth()
  const [pieData, setPieData] = useState<{ value: number; color: string; gradientCenterColor?: string; label: string }[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [filteredAdvice, setFilteredAdvice] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<PeriodType>('month')

  const { locale } = useTranslation()
  const [refreshing, setRefreshing] = useState(false)

  // Derive category colors from locales so colors stay consistent with Home
  const categoriesFromLocale: Record<string, any> = (locales as any)[locale]?.categories || {}
  const categoryColors: Record<string, string[]> = Object.fromEntries(
    Object.entries(categoriesFromLocale).map(([k, v]) => [k, [v.color, v.color]])
  )

  // Use FontAwesome icon names for advice cards (kept minimal)
  const categoryIcons: Record<string, string> = {
    Svago: 'beer',
    Cibo: 'utensils',
    Trasporti: 'bus',
    Bollette: 'file-invoice-dollar',
  }

  const appendHexOpacity = (hex: string, alpha = '20') => {
    if (!hex || typeof hex !== 'string') return hex;
    if (hex.length === 7 && hex.startsWith('#')) return `${hex}${alpha}`;
    // If already has alpha or not a standard hex, return original
    return hex;
  }

  const hexToRgba = (hex: string, alpha = 0.125) => {
    if (!hex || typeof hex !== 'string') return hex;
    // Normalize #RRGGBB
    if (hex.startsWith('#') && (hex.length === 7 || hex.length === 9)) {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    return hex
  }

  // Hardcoded advice items used when a pie slice is selected
  useEffect(() => {
    const hardcodedAdvice = [
      { text: "Se riduci del 12% le spese per le consegne, risparmierai circa 18€/settimana; così potrai permetterti l'iPhone 15 che desideravi in ~9 mesi.", category: 'Svago' },
      { text: "Se salti la palestra questo mese, risparmierai 50€; è abbastanza per un weekend fuori porta.", category: 'Svago' },
    ]

    setFilteredAdvice(hardcodedAdvice)
  }, [])

  useEffect(() => {
    fetchAndSetData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, period])

  const fetchAndSetData = async () => {
    if (!session?.user) return
    try {
      setLoading(true)
      
      let result
      if (period === 'month') {
        result = await fetchExpensesByCategoryLastMonth(session.user.id)
      } else if (period === '3months') {
        result = await fetchExpensesByCategoryLast3Months(session.user.id)
      } else {
        result = await fetchExpensesByCategoryLastYear(session.user.id)
      }

      const rows = (result || [])
      if (rows.length === 0) {
        setPieData([])
        setFilteredAdvice([])
        setSelectedIndex(null)
        return
      }

      const maxIndex = rows.reduce((acc: number, cur: any, i: number) => (cur.total > (rows[acc]?.total || 0) ? i : acc), 0)
      const mapped = rows.map((r: any, idx: number) => {
        const base = (categoryColors[r.category] && categoryColors[r.category][0]) || '#CCCCCC'
        const gradBase = (categoryColors[r.category] && categoryColors[r.category][1]) || base
        const color = hexToRgba(base, 0.125)
        const gradient = hexToRgba(gradBase, 0.125)
        const item: any = { value: r.total, color, gradientCenterColor: gradient, label: r.category }
        if (idx === maxIndex) item.focused = true
        return item
      })

      setPieData(mapped)
      setSelectedIndex(mapped.findIndex((m) => m.focused) ?? 0)

      const advice = [
        { text: "Se riduci del 12% le spese per le consegne, risparmierai circa 18€/settimana; così potrai permetterti l'iPhone 15 che desideravi in ~9 mesi.", category: 'Svago' },
        { text: "Se salti la palestra questo mese, risparmierai 50€; è abbastanza per un weekend fuori porta.", category: 'Svago' },
        { text: "Se ti rechi al lavoro con un abbonamento per i trasporti pubblici, risparmierai 30€/mese; è abbastanza per una gita nel weekend.", category: 'Trasporti' },
        { text: "Se riduci del 10% le uscite settimanali al bar, risparmierai 20€/mese; così potrai avere un fondo emergenze di 500€ in ~6 mesi.", category: 'Cibo' }
      ]
      const focused = mapped.find((m) => m.focused)
      if (focused) setFilteredAdvice(advice.filter(a => a.category === focused.label))
    } catch (err) {
      console.error('Errore fetch advices chart:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchAndSetData()
  }

  const renderStyledText = (text: string) => {
    const parts = text.split(/(\d+%?|\€\d+|\d+\s*(week|month)s?)/gi)
    return parts.map((part, i) => (
      /\d+%?|\€\d+|\d+\s*(week|month)s?/i.test(part)
        ? <Text key={i} style={{ fontWeight: 'bold', color: '#0B6623' }}>{part}</Text>
        : <Text key={i}>{part}</Text>
    ))
  }

  const renderDot = (color: string) => <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color, marginRight: 10 }} />

  const handlePiePress = (slice: any, index: number) => {
    // For demo purposes we filter hardcoded advice by category
    const advice = [
      { text: "Se riduci del 12% le spese per le consegne, risparmierai circa 18€/settimana; così potrai permetterti l'iPhone 15 che desideravi in ~9 mesi.", category: 'Svago' },
      { text: "Se salti la palestra questo mese, risparmierai 50€; è abbastanza per un weekend fuori porta.", category: 'Svago' },
      { text: "Se ti rechi al lavoro con un abbonamento per i trasporti pubblici, risparmierai 30€/mese; è abbastanza per una gita nel weekend.", category: 'Trasporti' },
      { text: "Se riduci del 10% le uscite settimanali al bar, risparmierai 20€/mese; così potrai avere un fondo emergenze di 500€ in ~6 mesi.", category: 'Cibo' }
    ]

    // Toggle selection on same index and update pieData focused flags
    if (selectedIndex === index) {
      setSelectedIndex(null)
      setPieData((prev) => prev.map((p) => ({ ...p, focused: false })))
      setFilteredAdvice(advice)
    } else {
      setSelectedIndex(index)
      setPieData((prev) => prev.map((p, i) => ({ ...p, focused: i === index })))
      setFilteredAdvice(advice.filter(a => a.category === slice.label))
    }
  }

  const renderLegendComponent = () => (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        {(selectedIndex !== null ? [pieData[selectedIndex]].filter(Boolean) : pieData).map((p) => (
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
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: HORIZONTAL_GUTTER, justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: "#333", fontSize: 34, fontWeight: 'bold' }}>Advices</Text>
          </View>
        </View>

        {/* Period Toggle */}
        <View style={{ flexDirection: 'row', marginTop: 15, marginHorizontal: HORIZONTAL_GUTTER, borderRadius: 35,
          backgroundColor: '#faf9f9ff', padding: 4 }}>
          <TouchableOpacity
            onPress={async () => { try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {} ; setPeriod('month'); setSelectedIndex(null); }}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 35,
              backgroundColor: period === 'month' ? '#ffffff' : 'transparent',
              borderWidth: period === 'month' ? 0.5 : 0,
              borderColor: period === 'month' ? '#e0e0e0f1' : 'transparent',
            }}
          >
            <Text style={{ textAlign: 'center', 
              fontWeight: period === 'month' ? '600' : '400', color: "#333" }}>
              Last Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => { try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {} ; setPeriod('3months'); setSelectedIndex(null); }}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 35,
              backgroundColor: period === '3months' ? '#ffffff' : 'transparent',
              borderWidth: period === '3months' ? 0.5 : 0,
              borderColor: period === '3months' ? '#e0e0e0f1' : 'transparent',
            }}
          >
            <Text style={{ textAlign: 'center',
              fontWeight: period === '3months' ? '600' : '400', color: "#333" }}>
              3 Months
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => { try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {} ; setPeriod('year'); setSelectedIndex(null); }}
            style={{
              flex: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 35,
              backgroundColor: period === 'year' ? '#ffffff' : 'transparent',
              borderWidth: period === 'year' ? 0.5 : 0,
              borderColor: period === 'year' ? '#e0e0e0f1' : 'transparent',
            }}
          >
            <Text style={{ textAlign: 'center',
              fontWeight: period === 'year' ? '600' : '400', color: "#333" }}>
              Last Year
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: HORIZONTAL_GUTTER }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        >
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <PieChart
              data={pieData.map((p, i) => ({ ...p, onPress: () => handlePiePress(p, i) }))}
              donut
              showGradient={false}
              sectionAutoFocus
              focusOnPress
              extraRadiusForFocused={10}
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
                  colors={
                    (categoryColors[item.category] && [appendHexOpacity(categoryColors[item.category][0], '20'), categoryColors[item.category][1]])
                    || ['#CFFFE6', '#CFFFE6']
                  }
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
                  <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: appendHexOpacity((categoryColors[item.category] && categoryColors[item.category][0]) || '#CCCCCC', '20'), justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
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