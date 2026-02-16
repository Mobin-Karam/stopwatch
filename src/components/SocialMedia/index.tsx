import Image from "next/image";
import Github from "../../assets/images/github-logo.png";
import Linkedin from "../../assets/images/linkedin.png";

const SocialMedia = () => {
  const links = [
    {
      href: "https://linkedin.com/in/mobin-karam",
      label: "LinkedIn",
      icon: Linkedin,
      alt: "linkedin.com/in/mobin-karam",
    },
    {
      href: "https://github.com/Mobin-Karam",
      label: "GitHub",
      icon: Github,
      alt: "github.com/Mobin-Karam",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group flex w-full items-center justify-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-200 transition-colors duration-200 hover:border-slate-600 hover:bg-slate-800 sm:w-auto"
        >
          <Image src={link.icon} alt={link.alt} className="h-5 w-5" width={20} height={20} />
          <span className="text-sm font-medium group-hover:text-white">
            {link.label}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
