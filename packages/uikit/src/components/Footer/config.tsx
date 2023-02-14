import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, GithubIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.vertotrade.com/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/vertotrade",
      },
      {
        label: "Community",
        href: "https://docs.vertotrade.com/contact-us/telegram",
      },
      {
        label: "—",
      },
      {
        label: "Online Store",
        href: "https://vertotrade.creator-spring.com/",
        isHighlighted: true,
      },
    ],
  },
  {
    label: "Help",
    items: [
      {
        label: "Customer",
        href: "Support https://docs.vertotrade.com/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.vertotrade.com/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.vertotrade.com/get-started",
      },
    ],
  },
  {
    label: "Developers",
    items: [
      {
        label: "Github",
        href: "https://github.com/vertotrade",
      },
      {
        label: "Documentation",
        href: "https://docs.vertotrade.com",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@vertotrade-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.vertotrade.com/help/faq#is-vertotrade-safe-has-vertotrade-been-audited",
      },
    ],
  },
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/vertotrade",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    href: "https://t.me/vertotrade",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/vertotrade/",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
