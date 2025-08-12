import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

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
                    bottom: 15,
                    borderRadius: 30, // Arrotonda la barra
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                },
                tabBarIconStyle: {
                    marginTop: 5, // sposta solo l’icona verso il basso
                },

            }}
        >
            <Tabs.Screen name="index"
                options={{
                    title: 'YourMoney',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                    headerShown: false,
                }} />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
