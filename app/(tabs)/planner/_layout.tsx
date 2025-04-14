import { Stack } from 'expo-router';
import { colors } from '../../../constants/colors';

export default function PlannerLayout() {
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
          title: 'תכנון טיול',
        }}
      />
    </Stack>
  );
}