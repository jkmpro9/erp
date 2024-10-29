export interface Client {
  id: string;
  custom_id?: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  created_at?: string;
}

export interface NewClient {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface ClientListProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ClientStatisticsProps {
  clients: Client[];
}
