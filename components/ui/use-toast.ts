import { Toast } from "@/components/ui/toast"
import { useToast as useToastOriginal } from "@/components/ui/toast"

export const useToast = useToastOriginal

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

export const toast = (props: Omit<ToastProps, "id">) => {
  const { toast } = useToastOriginal()
  toast(props as ToastProps)
}
