import { Text, View } from "react-native"

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  paid: "#10B981",
  cancelled: "#EF4444",
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <View
      style={{
        backgroundColor: STATUS_COLORS[status] ?? "#9CA3AF",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: "white", fontSize: 12 }}>
        {status.toUpperCase()}
      </Text>
    </View>
  )
}
