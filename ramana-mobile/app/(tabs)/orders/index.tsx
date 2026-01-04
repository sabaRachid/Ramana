import { FlatList, View } from "react-native"
import { useEffect, useState } from "react"
import { listOrders } from "../../../src/api/orders"
import { OrderCard } from "../../../components/OrderCard"
import { StoreOrderDTO } from "../../../src/dtos/order"

export default function OrdersScreen() {
  const [orders, setOrders] = useState<StoreOrderDTO[]>([])

  useEffect(() => {
    listOrders().then((res) => setOrders(res.orders))
  }, [])

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </View>
  )
}
