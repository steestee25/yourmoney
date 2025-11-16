// components/auth/nameStep.tsx
import { COLORS } from '@/constants/color'
import { MaterialIcons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

interface Props {
    name: string
    setName: (v: string) => void
    onNext: () => void
    onBack: () => void
}

export default function NameStep({ name, setName, onNext, onBack }: Props) {
    const [error, setError] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    // Animation for ONLY title, input, button
    const contentAnim = useRef(new Animated.Value(0)).current

    const handleNext = () => {
        if (!name.trim()) {
            setError('Please insert your name')
            return
        }
        setError('')
        onNext()
    }

    const handleFocus = () => {
        setIsFocused(true)
        Animated.timing(contentAnim, {
            toValue: 1,
            duration: 550,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start()
    }

    const handleBlur = () => {
        if (!name.trim()) {
            setIsFocused(false)
            Animated.timing(contentAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start()
        }
    }

    // Move block upward slightly but NEVER into the back arrow (max 50px)
    const contentTranslateY = contentAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [110, -50], // move UP
    })

    const titleTranslateX = contentAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -80], // move LEFT 
    })

    const titleFontSize = contentAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [28, 24], // font SMALLER
    })

    return (
        <View style={styles.container}>
            {/* FIXED Back Arrow */}
            <TouchableOpacity onPress={onBack} style={styles.backIcon}>
                <MaterialIcons name="arrow-back" size={28} color="#00C6D3" />
            </TouchableOpacity>

            {/* ANIMATED CONTENT (starts lower + stays under back arrow) */}
            <Animated.View
                style={[
                    styles.animatedBlock,
                    { transform: [{ translateY: contentTranslateY }] },
                ]}
            >
                <Animated.Text
                    style={[
                        styles.title,
                        {
                            fontSize: titleFontSize,
                            transform: [{ translateX: titleTranslateX }],
                        },
                    ]}
                >
                    What's your name?
                </Animated.Text>

                <TextInput
                    style={[
                        styles.input,
                        error ? { borderColor: 'red' } : {},
                    ]}
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                        if (error && text.trim()) setError('')
                    }}
                    placeholder="Charles"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onSubmitEditing={handleNext}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                    style={[
                        styles.button,
                        error ? { marginTop: 10 } : { marginTop: 15 },
                    ]}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    backIcon: {
        width: 40,
        height: 40,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.borderWhite,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },

    animatedBlock: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 60,
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        width: '100%',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        width: '100%',
    },

    errorText: {
        color: 'red',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 14,
        alignSelf: 'flex-start',
    },

    button: {
        backgroundColor: COLORS.primaryLight,
        padding: 15,
        alignItems: 'center',
        borderRadius: 12,
        width: '100%',
    },

    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
})
