import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/auth-context';
import { chatGroups as mockChatGroups } from '../mocks/chats';

export function useChats() {
  const { user } = useAuth();
  const [chatGroups, setChatGroups] = useState(mockChatGroups);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        setChatGroups(mockChatGroups);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('chat_groups')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching chat groups:', error);
          setChatGroups(mockChatGroups);
        } else if (data && data.length > 0) {
          // Fetch messages for each chat group
          const groupsWithMessages = await Promise.all(
            data.map(async (group) => {
              const { data: messagesData, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_group_id', group.id)
                .order('timestamp', { ascending: false })
                .limit(50);

              if (messagesError) {
                console.error(`Error fetching messages for group ${group.id}:`, messagesError);
                return { ...group, messages: [] };
              }
              return { ...group, messages: messagesData || [] };
            })
          );
          setChatGroups(groupsWithMessages);
        } else {
          setChatGroups(mockChatGroups);
        }
      } catch (error) {
        console.error('Error in fetchChats:', error);
        setChatGroups(mockChatGroups);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();

    // Subscribe to real-time changes
    if (user) {
      const subscription = supabase
        .channel('chat_groups')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          setChatGroups((prevGroups) => {
            return prevGroups.map((group) => {
              if (group.id === payload.new.chat_group_id) {
                const messageExists = group.messages.some(msg => msg.id === payload.new.id);
                if (!messageExists) {
                  return { ...group, messages: [payload.new, ...group.messages] };
                }
              }
              return group;
            });
          });
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const sendMessage = async (chatId: string, content: string, type: 'text' | 'image' = 'text') => {
    if (!user) {
      // Fallback for non-authenticated users
      const newMessage = {
        id: `m${Date.now()}`,
        userId: 'u1',
        userName: 'אתה',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        text: content,
        type,
        timestamp: new Date().toISOString(),
        chat_group_id: chatId,
      };

      setChatGroups(chatGroups.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [newMessage, ...chat.messages] } 
          : chat
      ));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_group_id: chatId,
          user_id: user.id,
          user_name: user.name,
          user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
          content,
          type,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      // Message will be updated via real-time subscription
    } catch (error) {
      console.error('Error in sendMessage:', error);
    }
  };

  const joinChat = async (chatId: string) => {
    if (!user) {
      setChatGroups(chatGroups.map(chat => 
        chat.id === chatId 
          ? { ...chat, members: chat.members + 1 } 
          : chat
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_group_members')
        .insert({
          chat_group_id: chatId,
          user_id: user.id,
        });

      if (error) {
        console.error('Error joining chat:', error);
        throw error;
      }

      setChatGroups(chatGroups.map(chat => 
        chat.id === chatId 
          ? { ...chat, members: chat.members + 1 } 
          : chat
      ));
    } catch (error) {
      console.error('Error in joinChat:', error);
    }
  };

  const leaveChat = async (chatId: string) => {
    if (!user) {
      setChatGroups(chatGroups.map(chat => 
        chat.id === chatId 
          ? { ...chat, members: chat.members - 1 } 
          : chat
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_group_members')
        .delete()
        .eq('chat_group_id', chatId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error leaving chat:', error);
        throw error;
      }

      setChatGroups(chatGroups.map(chat => 
        chat.id === chatId 
          ? { ...chat, members: chat.members - 1 } 
          : chat
      ));
    } catch (error) {
      console.error('Error in leaveChat:', error);
    }
  };

  return {
    chatGroups,
    isLoading,
    sendMessage,
    joinChat,
    leaveChat,
  };
}