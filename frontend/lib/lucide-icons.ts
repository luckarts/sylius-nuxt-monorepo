/**
 * Registry centralisé des icônes Lucide
 * UN SEUL import ici, utilisé partout dans le projet
 */

import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  // Navigation
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  // Other
  Bell,
  BellOff,
  Bookmark,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  // Note: Les icônes social (Facebook, Twitter, etc.) sont dépréciées dans Lucide
  // Utiliser des icônes génériques ou une lib dédiée pour les réseaux sociaux

  // Files
  File,
  FileText,
  Filter,
  Folder,
  Grid,
  Heart,
  HelpCircle,
  Home,
  Image,
  // UI
  Info,
  LayoutGrid,
  List,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  // Forms
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Minus,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Package,
  Percent,
  Phone,
  Plus,
  Receipt,
  Search,
  Settings,
  Share2,
  // E-commerce
  ShoppingCart,
  Star,
  Store,
  Sun,
  Tag,
  Trash2,
  Truck,
  Unlock,
  Upload,
  // User
  User,
  UserCircle,
  UserPlus,
  Users,
  // Actions
  X,
  XCircle,
  Zap,
} from 'lucide-vue-next'

import type { LucideIcon } from 'lucide-vue-next'

/**
 * Registry des icônes avec noms simplifiés
 * Usage: <Icon name="cart" /> au lieu de <ShoppingCart />
 */
export const iconRegistry = {
  // Navigation
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,

  // Actions
  close: X,
  check: Check,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  delete: Trash2,
  trash: Trash2,
  search: Search,
  menu: Menu,
  'more-vertical': MoreVertical,
  'more-horizontal': MoreHorizontal,
  filter: Filter,
  download: Download,
  upload: Upload,
  copy: Copy,
  'external-link': ExternalLink,

  // E-commerce
  cart: ShoppingCart,
  'shopping-cart': ShoppingCart,
  heart: Heart,
  star: Star,
  tag: Tag,
  package: Package,
  'credit-card': CreditCard,
  truck: Truck,
  store: Store,
  receipt: Receipt,
  percent: Percent,
  discount: Percent,

  // User
  user: User,
  users: Users,
  'user-circle': UserCircle,
  login: LogIn,
  logout: LogOut,
  'user-plus': UserPlus,
  register: UserPlus,

  // Forms
  email: Mail,
  mail: Mail,
  lock: Lock,
  unlock: Unlock,
  eye: Eye,
  'eye-off': EyeOff,
  phone: Phone,
  'map-pin': MapPin,
  location: MapPin,
  calendar: Calendar,
  clock: Clock,

  // UI
  info: Info,
  warning: AlertTriangle,
  alert: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  'x-circle': XCircle,
  help: HelpCircle,
  settings: Settings,
  spinner: Loader2,
  loading: Loader2,
  home: Home,
  grid: Grid,
  list: List,
  'layout-grid': LayoutGrid,
  moon: Moon,
  sun: Sun,
  x: X,

  // Note: Pas d'icônes social (dépréciées dans Lucide)

  // Files
  file: File,
  'file-text': FileText,
  image: Image,
  folder: Folder,

  // Other
  bell: Bell,
  'bell-off': BellOff,
  notification: Bell,
  bookmark: Bookmark,
  share: Share2,
  message: MessageSquare,
  zap: Zap,
} as const

export type IconName = keyof typeof iconRegistry
export type IconComponent = LucideIcon

/**
 * Récupérer un composant d'icône par son nom
 */
export function getIcon(name: IconName): IconComponent | null {
  return iconRegistry[name] || null
}
