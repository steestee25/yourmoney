
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ciao 👋, sono SaveBuddy. Come posso aiutarti?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(50);

  const { resetMessages } = useLocalSearchParams();

  // Helper function to reset chat
  const resetChat = () => {
    setMessages([
      { role: 'assistant', content: 'Ciao 👋, sono SaveBuddy. Come posso aiutarti?' }
    ]);
    setInput('');
  };

  // Reset chat when Chat screen looses its focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetChat();
      };
    }, [])
  );

  // Reset chat when new message button is pressed
  useEffect(() => {
    if (resetMessages) {
      resetChat();
    }
  }, [resetMessages]);

  useEffect(() => {
    // Listener for opening keyboard
    const showKeyboard = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOffset(90); // keyboard opened
    });

    // Listener for closing keyboard
    const hideKeyboard = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(50); // keyboard closed
    });

    // Cleanup listeners
    return () => {
      showKeyboard.remove();
      hideKeyboard.remove();
    };
  }, []);


  // Helper function to render message content with bold text
  const renderMessageContent = (content: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/g); // Highlight text between ** **
    return parts.map((part: string, index: number) => {
      const isBold = index % 2 === 1;
      return (
        <Text
          key={index}
          style={{
            fontWeight: isBold ? 'bold' : 'normal',
            color: '#fff',
            fontSize: 16,
          }}
        >
          {part}
        </Text>
      );
    });
  };

  // Fake replies
  const fakeReplies = [
    'Questa è una risposta fittizia.',
    'Ecco una risposta di esempio.',
    'Posso aiutarti con altre domande!',
    'Risposta automatica generata.',
    'Grazie per il tuo messaggio!'
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    // Simulate a fake reply
    setTimeout(() => {
      const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardOffset}
    >
      <View style={styles.container}>
        <View style={{ flex: 1, width: '100%' }}>
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20, paddingHorizontal: 15 }}
            onContentSizeChange={() => {
              // If is needed to verify that scrollViewRef is not null (aka not yet mounted)
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
          >
            {messages.map((msg, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: msg.role === 'user' ? '#e6f4f4ff' : '#6cebe9ff',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  borderRadius: 16,
                  padding: 12,
                  marginVertical: 4,
                  maxWidth: '80%',
                }}
              >
                {msg.role === 'assistant' ? (
                  <Text style={{ color: '#fff', fontSize: 16 }}>
                    {renderMessageContent(msg.content)}
                  </Text>
                ) : (
                  <Text style={{ color: '#0B3D2E', fontSize: 16 }}>
                    {msg.content}
                  </Text>
                )}
              </View>
            ))}
            {loading && (
              <Text style={{ alignSelf: 'flex-start', color: '#26C0CA', marginVertical: 8 }}>...</Text>
            )}
          </ScrollView>
        </View>
        {/* Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Fai una domanda"
            value={input}
            onChangeText={setInput}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Feather name="send" size={24} color="#6cebe9ff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#26C0CA',
    elevation: 2,
  },
});
