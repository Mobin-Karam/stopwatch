import SocialMedia from "../SocialMedia";
import { useI18n } from "../../i18n/I18nProvider";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="flex w-full items-center justify-between border-t border-slate-800 px-6 py-4 text-sm text-slate-400">
      <span className="tracking-wide text-slate-500">{t("footer.tagline")}</span>
      <SocialMedia />
    </footer>
  );
};

export default Footer;
