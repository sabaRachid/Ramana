import { Pressable, Text, View } from "react-native"
import { router } from "expo-router"
import { OrderStatusBadge } from "./OrderStatusBadge"
import type { StoreOrderListDTO } from "../src/dtos/order"

export function OrderCard({ order }: { order: StoreOrderListDTO }) {
  return (
    <Pressable
      onPress={() => router.push(`/orders/${order.id}`)}
      style={{
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <Text style={{ fontWeight: "600", fontSize: 16 }}>
        Commande #{order.id.slice(-6)}
      </Text>

      <View style={{ marginVertical: 6 }}>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text>Total : {order.total} XOF</Text>
      <Text style={{ color: "#6B7280", marginTop: 4 }}>
        {new Date(order.created_at).toLocaleString()}
      </Text>
    </Pressable>
  )
}
