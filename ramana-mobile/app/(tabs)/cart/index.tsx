import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { useMemo } from "react"
import { useCart } from "../../../src/context/CartContext"
import { router } from "expo-router"

export default function CartScreen() {
  const { items, updateQuantity, removeItem } = useCart()

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    )
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }, [items])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panier</Text>
      <Text style={styles.subtitle}>
        {totalItems} article(s)
      </Text>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Votre panier est vide
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.variant_id}
          contentContainerStyle={{ paddingTop: 12 }}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Pressable
                onPress={() =>
                  router.push(`/products/${item.product_id}`)
                }
                style={{ flex: 1 }}
              >
                <Text style={styles.itemTitle}>
                  {item.product_title}
                </Text>
                <Text style={styles.itemVariant}>
                  {item.variant_title}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.quantity} x {item.unit_price} XOF
                </Text>
              </Pressable>
              <View style={styles.itemActions}>
                <View style={styles.qtyRow}>
                <Pressable
                  onPress={() =>
                    updateQuantity(item.variant_id, item.quantity - 1)
                  }
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <Pressable
                  onPress={() =>
                    updateQuantity(item.variant_id, item.quantity + 1)
                  }
                  style={styles.qtyButton}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </Pressable>
                </View>
                <Pressable
                  onPress={() => removeItem(item.variant_id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Retirer</Text>
                </Pressable>
              </View>
              <Text style={styles.itemTotal}>
                {item.unit_price * item.quantity} XOF
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{total} XOF</Text>
      </View>

      <Pressable
        style={[
          styles.checkoutButton,
          items.length === 0 && styles.checkoutButtonDisabled,
        ]}
        disabled={items.length === 0}
        onPress={() => router.push("/checkout")}
      >
        <Text style={styles.checkoutButtonText}>Commander</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontFamily: "SpaceMono",
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontFamily: "SpaceMono",
    color: "#6B7280",
    marginTop: 4,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "SpaceMono",
    color: "#9CA3AF",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  itemTitle: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
    color: "#111827",
  },
  itemVariant: {
    fontFamily: "SpaceMono",
    color: "#6B7280",
    marginTop: 2,
  },
  itemMeta: {
    fontFamily: "SpaceMono",
    color: "#6B7280",
    marginTop: 2,
  },
  itemTotal: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
    color: "#111827",
  },
  itemActions: {
    alignItems: "flex-end",
    gap: 6,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    fontFamily: "SpaceMono",
    fontSize: 16,
  },
  qtyValue: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
  },
  removeButton: {
    marginTop: 4,
  },
  removeButtonText: {
    fontFamily: "SpaceMono",
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "700",
  },
  totalBar: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontFamily: "SpaceMono",
    color: "#F9FAFB",
  },
  totalValue: {
    fontFamily: "SpaceMono",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 12,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  checkoutButtonText: {
    fontFamily: "SpaceMono",
    color: "white",
    fontWeight: "700",
  },
})
