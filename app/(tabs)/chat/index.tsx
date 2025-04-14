import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, TextInput, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChats } from '../../../hooks/use-chats';
import { colors } from '../../../constants/colors';
import { Search, MapPin, Users, Send, Image as ImageIcon } from 'lucide-react-native';

export default function ChatScreen() {
  const { chatGroups, isLoading, sendMessage } = useChats();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const currentChat = chatGroups.find(chat => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim() === '' && !isImageUpload) return;
    
    sendMessage(selectedChat!, isImageUpload ? imageUrl : message, isImageUpload ? 'image' : 'text');
    setMessage('');
    setIsImageUpload(false);
    setImageUrl('');
  };

  const handleImageUpload = () => {
    // In a real app, this would open an image picker and upload to Supabase Storage
    // For demo, we'll simulate with a placeholder URL
    setIsImageUpload(true);
    setImageUrl('https://images.unsplash.com/photo-1559333086-b0a56225a93c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80');
  };

  const renderChatItem = ({ item }: { item: typeof chatGroups[0] }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        selectedChat === item.id && styles.chatItemSelected
      ]}
      onPress={() => setSelectedChat(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.chatImage} />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <View style={styles.chatDetails}>
          <MapPin size={12} color={colors.textLight} />
          <Text style={styles.chatLocation}>{item.location}</Text>
        </View>
        <View style={styles.chatDetails}>
          <Users size={12} color={colors.textLight} />
          <Text style={styles.chatMembers}>{item.members} חברים</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const groupedChats = [
    {
      title: 'תאילנד',
      data: chatGroups.filter(chat => chat.location.includes('תאילנד')),
    },
    {
      title: 'הודו',
      data: chatGroups.filter(chat => chat.location.includes('הודו')),
    },
    {
      title: 'פרו',
      data: chatGroups.filter(chat => chat.location.includes('פרו')),
    },
    {
      title: 'וייטנאם',
      data: chatGroups.filter(chat => chat.location.includes('וייטנאם')),
    },
  ].filter(section => section.data.length > 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>טוען צ'אטים...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="חפש צ'אטים..."
              placeholderTextColor={colors.textLight}
              textAlign="right"
            />
            <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          </View>
          
          <SectionList
            sections={groupedChats}
            renderItem={renderChatItem}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatList}
          />
        </View>
        
        {selectedChat ? (
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Image source={{ uri: currentChat?.image }} style={styles.chatHeaderImage} />
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderName}>{currentChat?.name}</Text>
                <Text style={styles.chatHeaderMembers}>{currentChat?.members} חברים</Text>
              </View>
            </View>
            
            <FlatList
              data={currentChat?.messages}
              renderItem={({ item }) => (
                <View style={[
                  styles.messageContainer,
                  item.userId === 'u1' ? styles.myMessageContainer : styles.otherMessageContainer
                ]}>
                  {item.userId !== 'u1' && (
                    <Image source={{ uri: item.userAvatar }} style={styles.messageAvatar} />
                  )}
                  
                  <View style={[
                    styles.messageBubble,
                    item.userId === 'u1' ? styles.myMessageBubble : styles.otherMessageBubble
                  ]}>
                    {item.userId !== 'u1' && (
                      <Text style={styles.messageSender}>{item.userName}</Text>
                    )}
                    {item.type === 'image' ? (
                      <Image source={{ uri: item.text }} style={styles.messageImage} />
                    ) : (
                      <Text style={[
                        styles.messageText,
                        item.userId === 'u1' ? styles.myMessageText : styles.otherMessageText
                      ]}>
                        {item.text}
                      </Text>
                    )}
                    <Text style={[
                      styles.messageTime,
                      item.userId === 'u1' ? styles.myMessageTime : styles.otherMessageTime
                    ]}>
                      {new Date(item.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesList}
              inverted
            />
            
            <View style={styles.inputContainer}>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
                disabled={message.trim() === '' && !isImageUpload}
              >
                <Send size={20} color={message.trim() === '' && !isImageUpload ? colors.grayDark : colors.primary} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                placeholder="הקלד הודעה..."
                value={message}
                onChangeText={setMessage}
                multiline
                placeholderTextColor={colors.textLight}
                textAlign="right"
              />
              
              <TouchableOpacity 
                style={styles.imageButton}
                onPress={handleImageUpload}
              >
                <ImageIcon size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyChatContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
              style={styles.emptyChatImage}
            />
            <Text style={styles.emptyChatTitle}>בחר צ'אט להתחיל לדבר</Text>
            <Text style={styles.emptyChatDescription}>
              הצטרף לקבוצות צ'אט מקומיות כדי לפגוש מטיילים אחרים ולקבל טיפים
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.textLight,
  },
  content: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  sidebar: {
    width: 120,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    backgroundColor: colors.backgroundDark,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    margin: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Heebo-Regular',
    fontSize: 12,
    color: colors.text,
    padding: 0,
  },
  searchIcon: {
    marginLeft: 4,
    width: 16,
    height: 16,
  },
  chatList: {
    padding: 8,
  },
  chatItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  chatItemSelected: {
    backgroundColor: colors.grayLight,
  },
  chatImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  chatInfo: {
    alignItems: 'center',
  },
  chatName: {
    fontFamily: 'Heebo-Medium',
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  chatDetails: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatLocation: {
    fontFamily: 'Heebo-Regular',
    fontSize: 10,
    color: colors.textLight,
    marginRight: 2,
  },
  chatMembers: {
    fontFamily: 'Heebo-Regular',
    fontSize: 10,
    color: colors.textLight,
    marginRight: 2,
  },
  sectionHeader: {
    fontFamily: 'Heebo-Bold',
    fontSize: 14,
    color: colors.primary,
    backgroundColor: colors.backgroundDark,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chatHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontFamily: 'Heebo-Bold',
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  chatHeaderMembers: {
    fontFamily: 'Heebo-Regular',
    fontSize: 12,
    color: colors.textLight,
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
  myMessageContainer: {
    alignSelf: 'flex-start',
  },
  otherMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.grayLight,
    borderBottomRightRadius: 4,
  },
  messageSender: {
    fontFamily: 'Heebo-Bold',
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  messageText: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'right',
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontFamily: 'Heebo-Regular',
    fontSize: 10,
    alignSelf: 'flex-start',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: colors.textLight,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyChatImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
  },
  emptyChatTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyChatDescription: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    maxWidth: 300,
  },
});