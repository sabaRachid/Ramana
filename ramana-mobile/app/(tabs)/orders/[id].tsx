import { Text, View } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { getOrder } from "../../../src/api/orders"
import { OrderStatusBadge } from "../../../components/OrderStatusBadge"
import { StoreOrderDTO } from "../../../src/dtos/order"

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [order, setOrder] = useState<StoreOrderDTO | null>(null)

  useEffect(() => {
    if (!id) return
    getOrder(id).then((res) => setOrder(res.order))
  }, [id])

  if (!order) return null

  return (
    <View style={{ padding: 16 }}>
      {/* Header */}
      <Text style={{ fontSize: 20, fontWeight: "600" }}>
        Commande #{order.id.slice(-6)}
      </Text>

      <View style={{ marginVertical: 8 }}>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text>Total : {order.total} XOF</Text>

      <Text style={{ color: "#6B7280", marginBottom: 16 }}>
        {new Date(order.created_at).toLocaleString()}
      </Text>

      {/* Client */}
      <Text style={{ fontWeight: "600", marginBottom: 4 }}>
        Client
      </Text>
      <Text>{order.customer.name}</Text>
      <Text>{order.customer.phone}</Text>
      <Text style={{ marginBottom: 16 }}>
        {order.customer.address}
      </Text>

      {/* Articles */}
      <Text style={{ fontWeight: "600", marginBottom: 8 }}>
        Articles
      </Text>

      {order.items.map((line, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: "500" }}>
            {line.product_title}
            {line.variant_title ? ` – ${line.variant_title}` : ""}
          </Text>

          <Text style={{ color: "#6B7280" }}>
            {line.quantity} × {line.unit_price} XOF
          </Text>

          <Text>Total : {line.total} XOF</Text>
        </View>
      ))}
    </View>
  )
}
