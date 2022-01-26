import { NotificationManager } from "../libs/notifier";
import { IAlert } from "../libs/notifier/interfaces/alert.interface";
import { userDocument } from "../types/user.type";

const mockedNotify = jest.fn();

const notifier = {
  notify: mockedNotify,
};

const notificationManager = new NotificationManager();

test("Should invoke notifiers", () => {
  notificationManager.use("test notifier", notifier);
  const user = {} as userDocument;
  const alert = {} as IAlert;
  notificationManager.notifyAll(user, alert);

  expect(mockedNotify).toHaveBeenCalled();
});
