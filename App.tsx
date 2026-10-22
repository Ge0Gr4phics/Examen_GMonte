import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { EquipoProvider, useEquipo } from './src/context/EquipoContext'
import LoginScreen from './src/screens/LoginScreen'
import ExplorarScreen from './src/screens/ExplorarScreen'
import EquipoScreen from './src/screens/EquipoScreen'
import DetalleScreen from './src/screens/DetalleScreen'
import type { RootStackParamList, TabsParamList } from './src/types'
import { C } from './src/tema'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabsParamList>()

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.acento,
        tabBarInactiveTintColor: C.suave,
        tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: C.tarjeta },
      }}
    >
      <Tab.Screen
        name="Explorar"
        component={ExplorarScreen}
        options={{ tabBarIcon: ({ color }) => <TabIcon name="explorar" color={color} /> }}
      />
      <Tab.Screen
        name="Equipo"
        component={EquipoScreen}
        options={{ title: 'Mi equipo', tabBarIcon: ({ color }) => <TabIcon name="equipo" color={color} /> }}
      />
    </Tab.Navigator>
  )
}

function TabIcon({ name, color }: { name: 'explorar' | 'equipo'; color: string }) {
  if (name === 'explorar') {
    return (
      <View style={estilos.icono}>
        <View style={[estilos.lente, { borderColor: color }]} />
        <View style={[estilos.mango, { backgroundColor: color }]} />
      </View>
    )
  }

  return (
    <View style={[estilos.pokebola, { borderColor: color }]}>
      <View style={[estilos.bandaPokebola, { backgroundColor: color }]} />
      <View style={[estilos.botonPokebola, { backgroundColor: '#0f172a', borderColor: color }]} />
    </View>
  )
}

const estilos = StyleSheet.create({
  icono: { width: 24, height: 24, justifyContent: 'flex-start' },
  lente: { width: 15, height: 15, borderRadius: 8, borderWidth: 2, marginTop: 1, marginLeft: 1 },
  mango: { position: 'absolute', width: 9, height: 2, borderRadius: 1, top: 17, left: 14, transform: [{ rotate: '45deg' }] },
  pokebola: { width: 21, height: 21, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  bandaPokebola: { position: 'absolute', width: 24, height: 2, top: 8 },
  botonPokebola: { width: 8, height: 8, borderRadius: 4, borderWidth: 2 },
})

function Navegador() {
  const { usuario, cargandoAuth } = useEquipo()
  if (cargandoAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: C.fondo, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.acento} />
      </View>
    )
  }
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <>
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Detalle" component={DetalleScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <EquipoProvider>
      <Navegador />
    </EquipoProvider>
  )
}
