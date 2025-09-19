import { Entypo } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
    const router = useRouter();

    const handleNewMessage = () => {
        // Send event to reset messages in chat screen
        // Use Date.now() to ensure a new value each time
        router.setParams({ resetMessages: Date.now().toString() });
    };

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
                    borderRadius: 30,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                },
                tabBarIconStyle: {
                    marginTop: 10, 
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
                        fontSize: 28,
                    },
                    headerShown: true,
                    headerTitle: "SaveBuddy",
                    headerLeft: () => (
                        <Ionicons
                            name="menu"
                            size={28}
                            color="#000"
                            style={{ marginLeft: 15, marginTop: 4 }}
                        />
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity onPress={handleNewMessage}>
                                <Entypo name="new-message" size={26} color="#6cebe9ff" />
                            </TouchableOpacity>
                            <Entypo name="dots-three-vertical" size={26} color="#6cebe9ff" style={{ marginRight: 15 }} />
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
