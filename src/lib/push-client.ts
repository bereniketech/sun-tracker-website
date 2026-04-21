'use client'

interface LocationData {
  lat?: number
  lng?: number
}

export async function subscribeToPush(
  token: string,
  location?: LocationData
): Promise<PushSubscription> {
  // Check browser support
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Browser does not support push notifications')
  }

  // Get VAPID public key
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!vapidPublicKey) {
    throw new Error('VAPID public key not configured')
  }

  // Register service worker if not already registered
  let registration: ServiceWorkerRegistration
  try {
    registration = await navigator.serviceWorker.ready
  } catch {
    throw new Error('Failed to register service worker')
  }

  // Convert VAPID key to Uint8Array
  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

  // Subscribe to push notifications
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey as unknown as ArrayBuffer
  })

  // Send subscription to backend
  const subscriptionData = subscription.toJSON()
  const keys = subscriptionData.keys as Record<string, string>

  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth
      },
      lat: location?.lat,
      lng: location?.lng,
      notificationTypes: {
        golden_hour: true,
        blue_hour: true
      }
    })
  })

  if (!response.ok) {
    throw new Error('Failed to save push subscription to server')
  }

  return subscription
}

export async function unsubscribeFromPush(
  token: string,
  endpoint: string
): Promise<void> {
  // Check browser support
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Browser does not support push notifications')
  }

  // Get service worker registration
  let registration: ServiceWorkerRegistration
  try {
    registration = await navigator.serviceWorker.ready
  } catch {
    throw new Error('Failed to access service worker')
  }

  // Get current subscription
  const subscription = await registration.pushManager.getSubscription()
  if (subscription) {
    await subscription.unsubscribe()
  }

  // Notify backend
  const response = await fetch('/api/push/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      endpoint
    })
  })

  if (!response.ok) {
    throw new Error('Failed to remove push subscription from server')
  }
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  // Check browser support
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null
  }

  // Get service worker registration
  try {
    const registration = await navigator.serviceWorker.ready
    return await registration.pushManager.getSubscription()
  } catch {
    return null
  }
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.reject(
      new Error('Browser does not support notifications')
    )
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve('granted')
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission()
  }

  return Promise.reject(
    new Error('User has denied notification permission')
  )
}

export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied'
  }
  return Notification.permission
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}
