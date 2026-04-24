export type NotificationPrefs = {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  reviews: boolean;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  orderUpdates: true,
  promotions: false,
  newArrivals: false,
  reviews: true,
}