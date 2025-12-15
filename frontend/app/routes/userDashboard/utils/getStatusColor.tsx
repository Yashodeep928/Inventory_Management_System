import CheckIcon from "~/Icons/userIcons/CheckIcon";
import TruckIcon from "~/Icons/userIcons/TruckIcon";
import ClockIcon from "~/Icons/userIcons/ClockIcon";

type OrderStatus = "delivered" | "shipped" | "pending" | "default";

const statusColors: Record<OrderStatus, {
  bg: string;
  text: string;
  icon: React.ComponentType;
}> = {
  delivered: { bg: "#ECFDF5", text: "#059669", icon: CheckIcon },
  shipped: { bg: "#DBEAFE", text: "#2563EB", icon: TruckIcon },
  pending: { bg: "#FEF3C7", text: "#D97706", icon: ClockIcon },
  default: { bg: "#F3F4F6", text: "#6B7280", icon: ClockIcon },
};

export function getStatusColor(status: string) {
  const key = status.toLowerCase() as OrderStatus;
  return statusColors[key] ?? statusColors.default;
}
