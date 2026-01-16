import { useEffect } from "react"
import { Stack } from "expo-router"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { CartProvider } from "../src/context/CartContext"

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(tabs)/orders/[id]"
          options={{ title: "Détail commande" }}
        />
        <Stack.Screen
          name="(tabs)/products/[id]"
          options={{ title: "Détail produit" }}
        />
      </Stack>
    </CartProvider>
  )
}
