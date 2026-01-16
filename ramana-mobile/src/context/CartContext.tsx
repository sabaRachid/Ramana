import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Platform } from "react-native"

export type CartItem = {
  product_id: string
  product_title: string
  variant_id: string
  variant_title: string
  unit_price: number
  currency_code: "XOF"
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  addItem: (item: CartItem) => void
  updateQuantity: (variantId: string, quantity: number) => void
  removeItem: (variantId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "ramana_cart_v1"

function readStorage(): CartItem[] | null {
  if (Platform.OS !== "web") return null
  try {
    const raw = globalThis?.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CartItem[]
  } catch {
    return null
  }
}

function writeStorage(items: CartItem[]) {
  if (Platform.OS !== "web") return
  try {
    globalThis?.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    )
  } catch {
    // ignore storage failures on web
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    return readStorage() ?? []
  })

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const index = prev.findIndex(
        (p) => p.variant_id === item.variant_id
      )
      if (index === -1) {
        return [...prev, item]
      }
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + item.quantity,
      }
      return updated
    })
  }, [])

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((item) =>
            item.variant_id === variantId
              ? { ...item, quantity }
              : item
          )
          .filter((item) => item.quantity > 0)
      )
    },
    []
  )

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) =>
      prev.filter((item) => item.variant_id !== variantId)
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      totalItems,
    }),
    [items, addItem, updateQuantity, removeItem, clear, totalItems]
  )

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}
  useEffect(() => {
    writeStorage(items)
  }, [items])
