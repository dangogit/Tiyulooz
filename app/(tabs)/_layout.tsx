import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { Map, BookOpen, MessageCircle, Bot } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="guides"
        options={{
          title: 'מדריכים',
          tabBarLabel: 'מדריכים',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'תכנון טיול',
          tabBarLabel: 'תכנון',
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'צ\'אטים',
          tabBarLabel: 'צ\'אטים',
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'עוזר אישי',
          tabBarLabel: 'עוזר',
          tabBarIcon: ({ color }) => <Bot size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontFamily: 'Heebo-Medium',
    fontSize: 12,
  },
  header: {
    backgroundColor: colors.background,
    shadowColor: 'transparent',
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: 'Heebo-Bold',
    fontSize: 18,
    color: colors.text,
  },
});