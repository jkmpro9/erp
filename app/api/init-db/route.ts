import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create clients table if it doesn't exist
    const { error: clientsError } = await supabase.rpc('create_clients_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });

    if (clientsError) throw clientsError;

    // Create invoices table if it doesn't exist
    const { error: invoicesError } = await supabase.rpc('create_invoices_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS invoices (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          client_id UUID REFERENCES clients(id),
          total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });

    if (invoicesError) throw invoicesError;

    // Create packages table if it doesn't exist
    const { error: packagesError } = await supabase.rpc('create_packages_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS packages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          client_id UUID REFERENCES clients(id),
          tracking_number TEXT,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
        );
      `
    });

    if (packagesError) throw packagesError;

    return NextResponse.json({ message: "Database initialized successfully" });
  } catch (error) {
    console.error("Error initializing database:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}
