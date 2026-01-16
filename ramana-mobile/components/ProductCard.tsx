import { useMemo, useState } from "react"
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native"
import type { StoreProductDTO } from "../src/dtos/product"

export function ProductCard({
  product,
  imageSource,
  onPress,
}: {
  product: StoreProductDTO
  imageSource?: ImageSourcePropType
  onPress?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const priceRange = useMemo(() => {
    const prices = product.variants.map(
      (v) => v.price.amount
    )
    if (!prices.length) return null
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return { min, max }
  }, [product.variants])

  const anyInStock = product.variants.some((v) => v.in_stock)

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress}>
        {imageSource ? (
          <View style={styles.imageWrap}>
            <Image source={imageSource} style={styles.image} />
            <View
              style={[
                styles.stockPill,
                {
                  backgroundColor: anyInStock
                    ? "#16A34A"
                    : "#DC2626",
                },
              ]}
            >
              <Text style={styles.stockPillText}>
                {anyInStock ? "Disponible" : "Rupture"}
              </Text>
            </View>
          </View>
        ) : null}

        <Text
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.title}
        </Text>
        <Text
          style={styles.subtitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.variants.length} variante(s)
        </Text>

        {priceRange ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>A partir de</Text>
            <Text style={styles.priceValue}>
              {priceRange.min} XOF
            </Text>
          </View>
        ) : null}
      </Pressable>

      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.expandPressable}
      >
        <Text style={styles.expandHint} numberOfLines={1}>
          {expanded ? "Masquer les variantes" : "Voir les variantes"}
        </Text>
      </Pressable>

      {expanded &&
        product.variants.map((variant) => (
          <View key={variant.id} style={styles.variantRow}>
            <Text style={styles.variantTitle}>
              {variant.title}
            </Text>
            <Text>
              {variant.price.amount} {variant.price.currency_code}
            </Text>
            <Text
              style={[
                styles.stockText,
                {
                  color: variant.in_stock
                    ? "#16A34A"
                    : "#DC2626",
                },
              ]}
            >
              {variant.in_stock
                ? `En stock (${variant.available_quantity})`
                : "Rupture de stock"}
            </Text>
          </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrap: {
    position: "relative",
    width: "100%",
    height: 96,
    marginBottom: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  stockPill: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stockPillText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
    fontSize: 14,
    color: "#111827",
  },
  subtitle: {
    fontFamily: "SpaceMono",
    color: "#6B7280",
    marginTop: 2,
    fontSize: 11,
  },
  priceRow: {
    marginTop: 4,
    alignItems: "flex-start",
  },
  priceLabel: {
    fontFamily: "SpaceMono",
    fontSize: 10,
    color: "#6B7280",
  },
  priceValue: {
    fontFamily: "SpaceMono",
    fontWeight: "700",
    fontSize: 12,
    color: "#111827",
  },
  expandPressable: {
    marginTop: 6,
  },
  expandHint: {
    fontFamily: "SpaceMono",
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 11,
  },
  variantRow: {
    marginTop: 8,
    paddingLeft: 4,
  },
  variantTitle: {
    fontFamily: "SpaceMono",
    fontWeight: "600",
    fontSize: 12,
  },
  stockText: {
    fontFamily: "SpaceMono",
    fontWeight: "600",
    fontSize: 11,
  },
})
