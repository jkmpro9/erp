"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

interface Client {
  id: string;
  custom_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
}

interface ClientStatisticsProps {
  clients: Client[];
}

export const ClientStatistics = ({ clients }: ClientStatisticsProps) => {
  const calculateStatistics = () => {
    const totalClients = clients.length;
    const clientsByCity = clients.reduce((acc, client) => {
      acc[client.city] = (acc[client.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cityData = Object.entries(clientsByCity).map(([city, count]) => ({
      city,
      count,
    }));

    const phoneCodeData = clients.reduce((acc, client) => {
      if (client.phone) {
        const phoneCode = client.phone.slice(0, 5);
        acc[phoneCode] = (acc[phoneCode] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const phoneCodeChartData = Object.entries(phoneCodeData)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { totalClients, cityData, phoneCodeChartData };
  };

  const statistics = calculateStatistics();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Statistiques des Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Nombre total de clients : {statistics.totalClients}</h3>
            <h3 className="text-lg font-semibold mb-2">Répartition par ville</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statistics.cityData}>
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Top 5 des codes téléphoniques</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statistics.phoneCodeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statistics.phoneCodeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
