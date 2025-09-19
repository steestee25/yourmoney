import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChatInput() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    console.log('Messaggio inviato:', message);
    setMessage('');
  };

  const HEADER_OFFSET = 90;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={HEADER_OFFSET} 
    >
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Fai una domanda"
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Feather name="send" size={24} color="#26C0CA" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'transparent',
  },
  container: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
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
    marginBottom: 10,
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
