import { useState } from "react"
import { Pressable, View, Text } from "react-native"
import { StoreProductDTO } from "../src/dtos/product"

export function ProductCard({ product }: { product: StoreProductDTO }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <View
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
      {/* En-tête produit */}
      <Pressable onPress={() => setExpanded((v) => !v)}>
        <Text style={{ fontWeight: "600", fontSize: 16 }}>
          {product.title}
        </Text>
        <Text style={{ color: "#6B7280", marginTop: 4 }}>
          {expanded ? "Masquer les variantes" : "Voir les variantes"}
        </Text>
      </Pressable>

      {/* Variantes */}
      {expanded &&
        product.variants.map((variant) => (
          <View
            key={variant.id}
            style={{ marginTop: 12, paddingLeft: 8 }}
          >
            <Text style={{ fontWeight: "500" }}>
              {variant.title}
            </Text>
            <Text>
              {variant.price.amount} {variant.price.currency_code}
            </Text>
            <Text
              style={{
                color: variant.in_stock ? "#10B981" : "#EF4444",
                fontWeight: "500",
              }}
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
