"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileSettings() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      setFullName(data.full_name || '')
      setAvatarUrl(data.avatar_url || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      } as any)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user?.id,
          full_name: fullName, 
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      } as any)
      
      // Refresh the profile data after successful update
      await fetchProfile()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      } as any)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" value={user?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="avatarUrl" className="text-sm font-medium">Avatar URL</label>
            <Input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
