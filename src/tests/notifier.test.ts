import { NotificationManager } from "../libs/notifier";
import { IAlert } from "../libs/notifier/interfaces/alert.interface";
import { checkDocument } from "../types/check.type";
const mockedNotify = jest.fn();

const notifier = {
  notify: mockedNotify,
};

const notificationManager = new NotificationManager();

test("Should invoke notifiers", () => {
  notificationManager.use("test notifier", notifier);
  const check = {} as checkDocument;
  const alert = {} as IAlert;
  notificationManager.notifyAll(check, alert);

  expect(mockedNotify).toHaveBeenCalled();
});
