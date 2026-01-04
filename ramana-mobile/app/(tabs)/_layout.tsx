import { Tabs } from "expo-router"

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="orders/index" options={{ title: "Commandes" }} />
      <Tabs.Screen name="products" options={{ title: "Produits" }} />
    </Tabs>
  )
}
