import { useToast as useToastOriginal } from "@/components/ui/toast"

export const useToast = useToastOriginal

// Add this type
type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  // Add any other properties your toast accepts
}

// Export the toast function
export const toast = (props: ToastProps) => {
  const { toast } = useToastOriginal()
  toast(props)
}
