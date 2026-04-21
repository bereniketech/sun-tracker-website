'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Loader } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscription,
  requestNotificationPermission,
  getNotificationPermission
} from '@/lib/push-client'

export interface NotificationToggleProps {
  lat?: number
  lng?: number
}

export function NotificationToggle({ lat, lng }: NotificationToggleProps) {
  const { user, getAccessToken } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('denied')

  // Check initial subscription status
  useEffect(() => {
    async function checkSubscriptionStatus() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        // Check permission first
        const permission = getNotificationPermission()
        setPermissionStatus(permission)

        // Check if user has an active subscription
        const subscription = await getPushSubscription()
        setIsSubscribed(!!subscription)
        setIsLoading(false)
      } catch (err) {
        console.error('Error checking subscription status:', err)
        setIsLoading(false)
      }
    }

    checkSubscriptionStatus()
  }, [user])

  const handleToggle = async () => {
    if (!user) {
      setError('You must be logged in to manage notifications')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const accessToken = await getAccessToken()
      if (!accessToken) {
        setError('Failed to get access token. Please try signing in again.')
        setIsLoading(false)
        return
      }

      if (isSubscribed) {
        // Unsubscribe
        const subscription = await getPushSubscription()
        if (subscription) {
          await unsubscribeFromPush(accessToken, subscription.endpoint)
          setIsSubscribed(false)
        }
      } else {
        // Request permission first
        const permission = await requestNotificationPermission()
        if (permission !== 'granted') {
          setError('Notification permission denied. Please enable notifications in your browser settings.')
          setIsLoading(false)
          return
        }

        setPermissionStatus(permission)

        // Subscribe
        await subscribeToPush(accessToken, { lat, lng })
        setIsSubscribed(true)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification settings'
      setError(errorMessage)
      console.error('Toggle notification error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const isDisabled = isLoading || permissionStatus === 'denied'
  const Icon = isSubscribed ? Bell : BellOff

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleToggle}
        disabled={isDisabled || isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 dark:bg-sky-600 text-white hover:bg-sky-600 dark:hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={
          isSubscribed
            ? 'Disable golden/blue hour notifications'
            : 'Enable golden/blue hour notifications'
        }
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Icon className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isLoading ? 'Loading...' : isSubscribed ? 'Notifications On' : 'Notifications Off'}
        </span>
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {permissionStatus === 'denied' && !isSubscribed && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Notifications are blocked. Check your browser settings to enable them.
        </p>
      )}
    </div>
  )
}
