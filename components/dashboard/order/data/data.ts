import {
  ArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  HandCoinsIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from 'lucide-react'

export const labels = [
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
  },
  {
    value: 'processing',
    label: 'Processing',
  },
  {
    value: 'packed',
    label: 'Packed',
  },
  {
    value: 'shipped',
    label: 'Shipped',
  },
  {
    value: 'outfordelivery',
    label: 'Out for Delivery',
  },
  {
    value: 'delivered',
    label: 'Delivered',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
  },
  {
    value: 'returned',
    label: 'Returned',
  },
]

export const statuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: ClockIcon,
  },
  {
    value: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircleIcon,
  },
  {
    value: 'processing',
    label: 'Processing',
    icon: PackageIcon,
  },
  {
    value: 'packed',
    label: 'Packed',
    icon: PackageIcon,
  },
  {
    value: 'shipped',
    label: 'Shipped',
    icon: TruckIcon,
  },
  {
    value: 'outfordelivery',
    label: 'Out for Delivery',
    icon: TruckIcon,
  },
  {
    value: 'delivered',
    label: 'Delivered',
    icon: CheckCircleIcon,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    icon: XCircleIcon,
  },
  {
    value: 'returned',
    label: 'Returned',
    icon: ArrowDownIcon,
  },
]

export const paymentMethods = [
  {
    value: 'cashondelivery',
    label: 'Cash on Delivery',
    icon: HandCoinsIcon,
  },
  {
    value: 'mastercard',
    label: 'Mastercard',
    icon: CreditCardIcon,
  },
  {
    value: 'mobicred',
    label: 'Mobicred',
    icon: CreditCardIcon,
  },
  {
    value: 'ozow',
    label: 'Ozow',
    icon: CreditCardIcon,
  },
  {
    value: 'payfast',
    label: 'PayFast',
    icon: CreditCardIcon,
  },
  {
    value: 'payflex',
    label: 'PayFlex',
    icon: CreditCardIcon,
  },
  {
    value: 'paypal',
    label: 'PayPal',
    icon: CreditCardIcon,
  },
  {
    value: 'snapscan',
    label: 'SnapScan',
    icon: CreditCardIcon,
  },
  {
    value: 'other',
    label: 'Other',
    icon: CreditCardIcon,
  },
]

export const paymentStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: ClockIcon,
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: CheckCircleIcon,
  },
  {
    value: 'failed',
    label: 'Failed',
    icon: XCircleIcon,
  },
  {
    value: 'refunded',
    label: 'Refunded',
    icon: ArrowDownIcon,
  },
  {
    value: 'partiallyrefunded',
    label: 'Partially Refunded',
    icon: ArrowDownIcon,
  },
  {
    value: 'authorized',
    label: 'Authorized',
    icon: CheckCircleIcon,
  },
]
