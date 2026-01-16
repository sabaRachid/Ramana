import { useMemo } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"

export default function ConfirmationScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>()
  const ref = useMemo(
    () => (orderId ? `#${orderId.slice(-6)}` : ""),
    [orderId]
  )

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Commande confirmée</Text>
        <Text style={styles.subtitle}>
          Merci. Nous vous contacterons bientôt.
        </Text>
        {orderId ? (
          <Text style={styles.refText}>Ref {ref}</Text>
        ) : null}
      </View>

      <Pressable
        onPress={() =>
          orderId
            ? router.replace(`/orders/${orderId}`)
            : router.replace("/orders")
        }
        style={styles.primaryButton}
      >
        <Text style={styles.primaryText}>Voir la commande</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/products")}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryText}>Retour au catalogue</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 18,
  },
  title: {
    fontFamily: "SpaceMono",
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  subtitle: {
    fontFamily: "SpaceMono",
    color: "#D1D5DB",
    marginTop: 6,
  },
  refText: {
    fontFamily: "SpaceMono",
    marginTop: 10,
    color: "#F9FAFB",
    fontWeight: "700",
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: {
    fontFamily: "SpaceMono",
    color: "white",
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryText: {
    fontFamily: "SpaceMono",
    color: "#111827",
    fontWeight: "700",
  },
})
