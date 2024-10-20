import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const SupabaseTest = () => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your_table' with an actual table name from your Supabase project
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
          .limit(1)

        if (error) throw error

        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : data ? (
        <pre className="bg-white p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default SupabaseTest

