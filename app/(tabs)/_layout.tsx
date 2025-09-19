import { Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#007bff',
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerShadowVisible: false,
                headerTintColor: '#007bff',
                tabBarStyle: {
                    position: 'absolute',
                    marginHorizontal: 10,
                    bottom: 20,
                    borderRadius: 30, // Arrotonda la barra
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                },
                tabBarIconStyle: {
                    marginTop: 10, // sposta solo l’icona verso il basso
                },

            }}
        >
            <Tabs.Screen name="index"
                options={{
                    title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                    headerShown: false,
                }} />

            <Tabs.Screen name="chat"
                options={{
                    title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} size={26} />
                    ),
                    headerStyle: { backgroundColor: '#fff' },
                    headerTintColor: '#000000',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 30,
                    },
                    headerShown: true,
                    headerTitle: "SaveBuddy",
                    headerLeft: () => (
                        <Ionicons
                            name="menu"
                            size={30}
                            color="#000"
                            style={{ marginLeft: 15, marginTop: 4 }}
                        />
                    ),
                    headerRight: () => (
                        <View style={{flexDirection: 'row', gap: 12, marginTop: 4}}>
                            <Entypo
                                name="new-message"
                                size={30}
                                color="#26C0CA"
                                style={{  }}
                            />
                            <Entypo
                                name="dots-three-vertical"
                                size={30}
                                color="#26C0CA"
                                style={{ marginRight: 15 }}
                            />
                        </View>
                    ),
                    tabBarStyle: { display: 'none' },
                }} />

            <Tabs.Screen
                name="about"
                options={{
                    title: '',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    )
}
