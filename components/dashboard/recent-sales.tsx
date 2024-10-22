import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Client } from "@/app/dashboard/clients/types";

interface RecentSalesProps {
  clients: Client[];
}

export function RecentSales({ clients }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {clients.map((client) => (
        <div key={client.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{client.name}</p>
            <p className="text-sm text-muted-foreground">{client.email}</p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
      ))}
    </div>
  );
}
