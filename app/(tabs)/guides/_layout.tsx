import { Stack } from 'expo-router';
import { colors } from '../../../constants/colors';

export default function GuidesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          fontFamily: 'Heebo-Bold',
          color: colors.text,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'מדריכי טיולים',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: '',
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}