import { View, FlatList } from "react-native"
import { useEffect, useState } from "react"
import { listProducts } from "../../../src/api/products"
import { StoreProductDTO } from "../../../src/dtos/product"
import { ProductCard } from "../../../components/ProductCard"

export default function ProductsScreen() {
  const [products, setProducts] = useState<StoreProductDTO[]>([])

  useEffect(() => {
    listProducts().then(setProducts)
  }, [])

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} />
        )}
      />
    </View>
  )
}
