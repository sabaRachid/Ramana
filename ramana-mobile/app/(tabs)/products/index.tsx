import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native"
import { useEffect, useMemo, useState } from "react"
import { router } from "expo-router"
import { listProducts } from "../../../src/api/products"
import { StoreProductDTO } from "../../../src/dtos/product"
import { ProductCard } from "../../../components/ProductCard"
import { getProductImage } from "../../../src/utils/product-images"
import { useCart } from "../../../src/context/CartContext"

export default function ProductsScreen() {
  const [products, setProducts] = useState<StoreProductDTO[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    setLoading(true)
    setError(null)
    listProducts()
      .then(setProducts)
      .catch((err: any) => {
        setError(err?.message ?? "Erreur de chargement")
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return products
    const q = query.toLowerCase()
    return products.filter((p) => {
      if (p.title.toLowerCase().includes(q)) return true
      return p.variants.some((v) =>
        v.title.toLowerCase().includes(q)
      )
    })
  }, [products, query])

  return (
    <View style={{ paddingHorizontal: 12, paddingTop: 24 }}>
      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#111827",
            fontFamily: "SpaceMono",
          }}
        >
          Catalogue
        </Text>
        <Text
          style={{
            color: "#6B7280",
            marginTop: 4,
            fontFamily: "SpaceMono",
          }}
        >
          Produits frais du jour, prix en XOF
        </Text>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un produit..."
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontFamily: "SpaceMono",
          marginBottom: 12,
        }}
      />
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
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: 8 }}>
            <ProductCard
              product={item}
              imageSource={getProductImage(item)}
              onPress={() => router.push(`/products/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <Text style={{ fontFamily: "SpaceMono" }}>
              Chargement...
            </Text>
          ) : (
            <Text style={{ fontFamily: "SpaceMono" }}>
              Aucun produit trouvé
            </Text>
          )
        }
      />
      {totalItems > 0 ? (
        <Pressable
          onPress={() => router.push("/cart")}
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            backgroundColor: "#111827",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              fontFamily: "SpaceMono",
              color: "white",
              fontWeight: "700",
            }}
          >
            Panier ({totalItems})
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}
