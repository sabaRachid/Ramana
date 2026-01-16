import { useMemo, useState } from "react"
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import { router } from "expo-router"
import { useCart } from "../../../src/context/CartContext"
import { createOrder } from "../../../src/api/orders"

export default function CheckoutScreen() {
  const { items, clear } = useCart()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    )
  }, [items])

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    if (items.length === 0) {
      Alert.alert("Erreur", "Le panier est vide")
      return
    }

    try {
      setLoading(true)
      const payload = {
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        items: {
          lines: items.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
        },
        payment_method: "cash" as const,
      }

      const res = await createOrder(payload)
      clear()
      router.replace(`/confirmation?orderId=${res.order.id}`)
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error?.message ?? "Impossible de creer la commande"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Validation commande</Text>
      <Text style={styles.subtitle}>Total {total} XOF</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Nom</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nom complet"
          style={styles.input}
        />

        <Text style={styles.label}>Telephone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Ex: +22600000000"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Adresse</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Ville, quartier, rue"
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Paiement</Text>
        <View style={styles.paymentPill}>
          <Text style={styles.paymentText}>Cash</Text>
        </View>
      </View>

      <Pressable
        onPress={handleSubmit}
        style={[
          styles.submitButton,
          loading && styles.submitButtonDisabled,
        ]}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? "Envoi..." : "Valider la commande"}
        </Text>
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
  section: {
    marginTop: 16,
  },
  label: {
    fontFamily: "SpaceMono",
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontFamily: "SpaceMono",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  paymentPill: {
    backgroundColor: "#111827",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  paymentText: {
    fontFamily: "SpaceMono",
    color: "white",
    fontWeight: "700",
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontFamily: "SpaceMono",
    color: "white",
    fontWeight: "700",
  },
})
