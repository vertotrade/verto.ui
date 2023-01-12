import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import {
  TwitterIcon,
  TelegramIcon,
  RedditIcon,
  InstagramIcon,
  GithubIcon,
  DiscordIcon,
  MediumIcon,
  YoutubeIcon,
} from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      {
        label: "Contact",
        href: "https://docs.pancakeswap.finance/contact-us",
      },
      {
        label: "Blog",
        href: "https://medium.com/vertotrade",
      },
      {
        label: "Community",
        href: "https://docs.pancakeswap.finance/contact-us/telegram",
      },
      {
        label: "CAKE",
        href: "https://docs.pancakeswap.finance/tokenomics/cake",
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
        href: "Support https://docs.pancakeswap.finance/contact-us/customer-support",
      },
      {
        label: "Troubleshooting",
        href: "https://docs.pancakeswap.finance/help/troubleshooting",
      },
      {
        label: "Guides",
        href: "https://docs.pancakeswap.finance/get-started",
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
        href: "https://docs.pancakeswap.finance",
      },
      {
        label: "Bug Bounty",
        href: "https://app.gitbook.com/@vertotrade-1/s/pancakeswap/code/bug-bounty",
      },
      {
        label: "Audits",
        href: "https://docs.pancakeswap.finance/help/faq#is-vertotrade-safe-has-vertotrade-been-audited",
      },
      {
        label: "Careers",
        href: "https://docs.pancakeswap.finance/hiring/become-a-chef",
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
    items: [
      {
        label: "English",
        href: "https://t.me/vertotrade",
      },
      {
        label: "Bahasa Indonesia",
        href: "https://t.me/VertoTradeIndonesia",
      },
      {
        label: "中文",
        href: "https://t.me/VertoTrade_CN",
      },
      {
        label: "Tiếng Việt",
        href: "https://t.me/VertoTradeVN",
      },
      {
        label: "Italiano",
        href: "https://t.me/vertotrade_ita",
      },
      {
        label: "русский",
        href: "https://t.me/vertotrade_ru",
      },
      {
        label: "Türkiye",
        href: "https://t.me/vertotradeturkiye",
      },
      {
        label: "Português",
        href: "https://t.me/VertoTradePortuguese",
      },
      {
        label: "Español",
        href: "https://t.me/PancakeswapEs",
      },
      {
        label: "日本語",
        href: "https://t.me/vertotradejp",
      },
      {
        label: "Français",
        href: "https://t.me/vertotradefr",
      },
      {
        label: "Deutsch",
        href: "https://t.me/VertoTrade_DE",
      },
      {
        label: "Filipino",
        href: "https://t.me/Pancakeswap_Ph",
      },
      {
        label: "ქართული ენა",
        href: "https://t.me/VertoTradeGeorgia",
      },
      {
        label: "हिन्दी",
        href: "https://t.me/VertoTradeINDIA",
      },
      {
        label: "Announcements",
        href: "https://t.me/VertoTradeAnn",
      },
    ],
  },
  {
    label: "Reddit",
    icon: RedditIcon,
    href: "https://reddit.com/r/vertotrade",
  },
  {
    label: "Instagram",
    icon: InstagramIcon,
    href: "https://instagram.com/vertotrade_official",
  },
  {
    label: "Github",
    icon: GithubIcon,
    href: "https://github.com/pancakeswap/",
  },
  {
    label: "Discord",
    icon: DiscordIcon,
    href: "https://discord.gg/vertotrade",
  },
  {
    label: "Medium",
    icon: MediumIcon,
    href: "https://medium.com/vertotrade",
  },
  {
    label: "Youtube",
    icon: YoutubeIcon,
    href: "https://www.youtube.com/@vertotrade_official",
  },
];

export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
