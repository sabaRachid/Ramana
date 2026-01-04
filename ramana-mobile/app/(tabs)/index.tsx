import { useEffect } from "react"
import { View, Text } from "react-native"
import { listOrders } from "../../src/api/orders"

export default function HomeScreen() {
  useEffect(() => {
    listOrders().then((r) => {
      console.log("ORDERS FROM API", r)
    })
  }, [])

  return (
    <View>
      <Text>Ramana Mobile OK</Text>
    </View>
  )
}
