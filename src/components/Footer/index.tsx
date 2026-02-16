import SocialMedia from "../SocialMedia";
import { useI18n } from "../../i18n/I18nProvider";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="flex w-full flex-col items-center gap-3 border-t border-slate-800 px-4 py-4 text-sm text-slate-400 sm:flex-row sm:justify-between sm:px-6">
      <span className="text-center tracking-wide text-slate-500 sm:text-left">{t("footer.tagline")}</span>
      <SocialMedia />
    </footer>
  );
};

export default Footer;
