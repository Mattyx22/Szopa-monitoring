export const subscribeToPushNotifications = async () => {
    const swRegistration = await navigator.serviceWorker.register('/sw.js');
  
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BGOMScLYpS6BIc3A2vTYgK9Jgahhi6KxWU1ek8Er84uUPrtyTM5Ggxzd_yr_ByUWHhlWlwLxf68rvGISawT75LU',
    });
  
    return subscription;
  };
  