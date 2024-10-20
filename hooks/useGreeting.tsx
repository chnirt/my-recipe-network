import { useTranslations } from "next-intl";

export function useGreeting() {
  const t = useTranslations("Greeting");
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return t("morning"); // Good morning
  } else if (currentHour >= 12 && currentHour < 18) {
    return t("afternoon"); // Good afternoon
  } else if (currentHour >= 18 && currentHour < 22) {
    return t("evening"); // Good evening
  } else {
    return t("night"); // Good night
  }
}
