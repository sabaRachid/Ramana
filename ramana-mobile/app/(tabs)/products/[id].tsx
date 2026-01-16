import { useEffect, useMemo, useState } from "react"
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { listProducts } from "../../../src/api/products"
import type { StoreProductDTO } from "../../../src/dtos/product"
import { getProductImage } from "../../../src/utils/product-images"
import { useCart } from "../../../src/context/CartContext"

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [product, setProduct] = useState<StoreProductDTO | null>(
    null
  )
  const [selectedVariantId, setSelectedVariantId] =
    useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    if (!id) return
    listProducts().then((products) => {
      const found = products.find((p) => p.id === id) ?? null
      setProduct(found)
      if (found?.variants?.[0]?.id) {
        setSelectedVariantId(found.variants[0].id)
      }
    })
  }, [id])

  const selectedVariant = useMemo(() => {
    if (!product || !selectedVariantId) return null
    return (
      product.variants.find((v) => v.id === selectedVariantId) ??
      null
    )
  }, [product, selectedVariantId])

  if (!product) return null

  const imageSource = getProductImage(product)

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem({
      product_id: product.id,
      product_title: product.title,
      variant_id: selectedVariant.id,
      variant_title: selectedVariant.title,
      unit_price: selectedVariant.price.amount,
      currency_code: selectedVariant.price.currency_code,
      quantity,
    })
    Alert.alert("Ajouté", "Produit ajouté au panier", [
      { text: "Continuer", onPress: () => router.replace("/products") },
      { text: "Panier", onPress: () => router.push("/cart") },
    ])
  }

  return (
    <View style={styles.container}>
      {imageSource ? (
        <Image source={imageSource} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.subtitle}>Choisir une variante</Text>

      <View style={styles.variants}>
        {product.variants.map((variant) => {
          const selected = variant.id === selectedVariantId
          const inStock = variant.in_stock
          return (
            <Pressable
              key={variant.id}
              onPress={() => setSelectedVariantId(variant.id)}
              style={[
                styles.variantCard,
                selected && styles.variantCardSelected,
              ]}
            >
              <Text style={styles.variantTitle}>
                {variant.title}
              </Text>
              <Text style={styles.variantPrice}>
                {variant.price.amount} XOF
              </Text>
              <Text
                style={[
                  styles.variantStock,
                  { color: inStock ? "#16A34A" : "#DC2626" },
                ]}
              >
                {inStock
                  ? `En stock (${variant.available_quantity})`
                  : "Rupture de stock"}
              </Text>
            </Pressable>
          )
        })}
      </View>

      <View style={styles.quantityRow}>
        <Text style={styles.quantityLabel}>Quantité</Text>
        <View style={styles.quantityControls}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity((q) => q + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        onPress={handleAddToCart}
        style={[
          styles.addButton,
          !selectedVariant?.in_stock && styles.addButtonDisabled,
        ]}
        disabled={!selectedVariant?.in_stock}
      >
        <Text style={styles.addButtonText}>Ajouter au panier</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
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
    marginTop: 6,
    marginBottom: 10,
  },
  variants: {
    gap: 10,
  },
  variantCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
  },
  variantCardSelected: {
    borderColor: "#1D4ED8",
    backgroundColor: "#EFF6FF",
  },
  variantTitle: {
    fontFamily: "SpaceMono",
    fontWeight: "600",
  },
  variantPrice: {
    fontFamily: "SpaceMono",
    marginTop: 4,
  },
  variantStock: {
    fontFamily: "SpaceMono",
    marginTop: 4,
    fontWeight: "600",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  quantityLabel: {
    fontFamily: "SpaceMono",
    color: "#111827",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontFamily: "SpaceMono",
    fontSize: 18,
  },
  quantityValue: {
    fontFamily: "SpaceMono",
    fontSize: 16,
    minWidth: 24,
    textAlign: "center",
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  addButtonText: {
    fontFamily: "SpaceMono",
    color: "white",
    fontWeight: "700",
  },
})
