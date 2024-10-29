import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientStatisticsProps } from "../types";

export function ClientStatistics({ clients }: ClientStatisticsProps) {
  // Calculate statistics
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.email).length;
  const clientsWithPhone = clients.filter(client => client.phone).length;
  const clientsWithAddress = clients.filter(client => client.address).length;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Statistiques Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Total Clients:</span>
            <span className="font-bold">{totalClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Clients avec Email:</span>
            <span className="font-bold">{activeClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Clients avec Téléphone:</span>
            <span className="font-bold">{clientsWithPhone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Clients avec Adresse:</span>
            <span className="font-bold">{clientsWithAddress}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
