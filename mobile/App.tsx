import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RoleSelectorScreen } from "./src/screens/shared/RoleSelectorScreen";
import { CitizenHomeScreen } from "./src/screens/citizen/CitizenHomeScreen";
import { CreateAlertScreen } from "./src/screens/citizen/CreateAlertScreen";
import { CitizenTrackingScreen } from "./src/screens/citizen/CitizenTrackingScreen";
import { CitizenHistoryScreen } from "./src/screens/citizen/CitizenHistoryScreen";
import { RatingScreen } from "./src/screens/citizen/RatingScreen";
import { SerenoHomeScreen } from "./src/screens/sereno/SerenoHomeScreen";
import { SerenoAlertDetailScreen } from "./src/screens/sereno/SerenoAlertDetailScreen";
import { CloseCaseScreen } from "./src/screens/sereno/CloseCaseScreen";
import { ChecklistScreen } from "./src/screens/sereno/ChecklistScreen";
import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="RoleSelector"
          screenOptions={{
            headerStyle: { backgroundColor: "#0b1f3a" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: "#f6f8fb" }
          }}
        >
          <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} options={{ title: "KusiAlerta" }} />
          <Stack.Screen name="CitizenHome" component={CitizenHomeScreen} options={{ title: "Ciudadano" }} />
          <Stack.Screen name="CreateAlert" component={CreateAlertScreen} options={{ title: "Kusi Rápido" }} />
          <Stack.Screen name="CitizenTracking" component={CitizenTrackingScreen} options={{ title: "Seguimiento" }} />
          <Stack.Screen name="CitizenHistory" component={CitizenHistoryScreen} options={{ title: "Mis alertas" }} />
          <Stack.Screen name="Rating" component={RatingScreen} options={{ title: "Calificar atención" }} />
          <Stack.Screen name="SerenoHome" component={SerenoHomeScreen} options={{ title: "Sereno" }} />
          <Stack.Screen name="SerenoAlertDetail" component={SerenoAlertDetailScreen} options={{ title: "Alerta asignada" }} />
          <Stack.Screen name="CloseCase" component={CloseCaseScreen} options={{ title: "Cerrar caso" }} />
          <Stack.Screen name="Checklist" component={ChecklistScreen} options={{ title: "Checklist operativo" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
