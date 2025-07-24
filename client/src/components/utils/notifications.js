let notificationId = 0;

const createNotificationElement = (message, type, duration) => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const closeButton = document.createElement('button');
  closeButton.className = 'notification-close';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => removeNotification(notification);
  
  notification.appendChild(closeButton);
  
  setTimeout(() => removeNotification(notification), duration);
  
  return notification;
};

const removeNotification = (notification) => {
  if (notification && notification.parentNode) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notification.parentNode.removeChild(notification);
    }, 300);
  }
};

const getOrCreateContainer = () => {
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  return container;
};

export const showNotification = (message, type = 'info', duration = 3000) => {
  const notification = createNotificationElement(message, type, duration);
  const container = getOrCreateContainer();
  container.appendChild(notification);
};