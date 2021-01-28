import { Locale } from "react-native-localize";
import { Region } from "shared/Region";

export type NotificationMessage = {
  id: string,
  title: any,
  message: any,
  target_regions: [Region],
}
