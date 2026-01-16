import { StyleSheet, Text, View } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { getOrder } from "../../../src/api/orders"
import { OrderStatusBadge } from "../../../components/OrderStatusBadge"
import type { StoreOrderDetailsDTO } from "../../../src/dtos/order"

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [order, setOrder] = useState<StoreOrderDetailsDTO | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getOrder(id)
      .then((res) => setOrder(res.order))
      .catch((err: any) =>
        setError(err?.message ?? "Erreur de chargement")
      )
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.lineMuted}>Chargement...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!order) return null

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Détail commande</Text>
          <Text style={styles.orderRef}>#{order.id.slice(-6)}</Text>
        </View>
        <OrderStatusBadge status={order.status} />
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{order.total} XOF</Text>
        <Text style={styles.totalDate}>
          {new Date(order.created_at).toLocaleString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client</Text>
        <View style={styles.card}>
          <Text style={styles.lineText}>{order.customer.name}</Text>
          <Text style={styles.lineMuted}>{order.customer.phone}</Text>
          <Text style={styles.lineMuted}>{order.customer.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Articles</Text>
        <View style={styles.card}>
          {order.items.map((line, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lineText}>
                  {line.product_title}
                  {line.variant_title
                    ? ` - ${line.variant_title}`
                    : ""}
                </Text>
                <Text style={styles.lineMuted}>
                  {line.quantity} x {line.unit_price} XOF
                </Text>
              </View>
              <Text style={styles.itemTotal}>{line.total} XOF</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "SpaceMono",
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  orderRef: {
    fontFamily: "SpaceMono",
    color: "#6B7280",
    marginTop: 2,
  },
  totalCard: {
    marginTop: 12,
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
  },
  totalLabel: {
    fontFamily: "SpaceMono",
    color: "#F3F4F6",
  },
  totalValue: {
    fontFamily: "SpaceMono",
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginTop: 4,
  },
  totalDate: {
    fontFamily: "SpaceMono",
    color: "#D1D5DB",
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  lineText: {
    fontFamily: "SpaceMono",
    color: "#111827",
  },
  lineMuted: {
    fontFamily: "SpaceMono",
    color: "#6B7280",
    marginTop: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemTotal: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
    color: "#111827",
  },
  errorText: {
    fontFamily: "SpaceMono",
    color: "#DC2626",
  },
})
