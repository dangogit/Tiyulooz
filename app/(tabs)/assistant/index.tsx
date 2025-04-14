import { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssistant } from '../../../hooks/use-assistant';
import { useProfile } from '../../../context/profile-context';
import { colors } from '../../../constants/colors';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';

export default function AssistantScreen() {
  const { messages, isLoading, sendMessage } = useAssistant();
  const { profile } = useProfile();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (input.trim() === '') return;
    sendMessage(input);
    setInput('');
  };

  const renderSuggestion = (text: string) => (
    <TouchableOpacity 
      style={styles.suggestionButton}
      onPress={() => {
        sendMessage(text);
      }}
    >
      <Text style={styles.suggestionText}>{text}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: typeof messages[0] }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer
    ]}>
      <View style={styles.messageAvatar}>
        {item.sender === 'user' ? (
          <User size={20} color={colors.white} />
        ) : (
          <Bot size={20} color={colors.white} />
        )}
      </View>
      
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userMessageBubble : styles.assistantMessageBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.assistantIconContainer}>
              <Bot size={40} color={colors.white} />
            </View>
            <Text style={styles.emptyTitle}>העוזר האישי שלך לטיולים</Text>
            <Text style={styles.emptyDescription}>
              שאל אותי כל דבר על המסלול שלך, המלצות למקומות, טיפים לתקציב, או כל דבר אחר שקשור לטיול שלך
            </Text>
            
            <View style={styles.suggestionsContainer}>
              <View style={styles.suggestionHeader}>
                <Sparkles size={16} color={colors.primary} />
                <Text style={styles.suggestionHeaderText}>נסה לשאול</Text>
              </View>
              
              {renderSuggestion("מה כדאי לעשות בתאילנד ב-3 ימים?")}
              {renderSuggestion("איך להתמודד עם ג'ט לג?")}
              {renderSuggestion("מה התקציב המומלץ ליום בהודו?")}
              {renderSuggestion("איזה חיסונים צריך לפני טיול לדרום אמריקה?")}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => `message-${index}`}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={[
              styles.sendButton,
              input.trim() === '' && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={input.trim() === ''}
          >
            <Send size={20} color={input.trim() === '' ? colors.grayDark : colors.white} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="שאל את העוזר האישי שלך..."
            value={input}
            onChangeText={setInput}
            multiline
            placeholderTextColor={colors.textLight}
            textAlign="right"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  assistantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: '100%',
  },
  suggestionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionHeaderText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
  },
  suggestionButton: {
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  suggestionText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row-reverse',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-start',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: colors.grayLight,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.grayLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.grayLight,
  },
});