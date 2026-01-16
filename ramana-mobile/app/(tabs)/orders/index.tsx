import { FlatList, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { listOrders } from "../../../src/api/orders"
import { OrderCard } from "../../../components/OrderCard"
import type { StoreOrderListDTO } from "../../../src/dtos/order"

export default function OrdersScreen() {
  const [orders, setOrders] = useState<StoreOrderListDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    listOrders()
      .then((res) => setOrders(res.orders))
      .catch((err: any) =>
        setError(err?.message ?? "Erreur de chargement")
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <View style={{ padding: 16, paddingTop: 24 }}>
      {error ? (
        <Text
          style={{
            fontFamily: "SpaceMono",
            color: "#DC2626",
            marginBottom: 8,
          }}
        >
          {error}
        </Text>
      ) : null}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          loading ? (
            <Text style={{ fontFamily: "SpaceMono" }}>
              Chargement...
            </Text>
          ) : (
            <Text style={{ fontFamily: "SpaceMono" }}>
              Aucune commande
            </Text>
          )
        }
      />
    </View>
  )
}
