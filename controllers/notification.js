import Notification from '../models/notification';

const MakeNotification = async ({ orderId, userId, text }) => {
  try {
    console.log('user id and order id is ', userId, orderId);
    const notification = new Notification({
      userId,
      orderId,
      text
    });
    await notification.save();

  } catch (error) {
    throw new Error('Error sending notification');

  }
};

export { MakeNotification };