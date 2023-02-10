import { ContextApi } from "@verto/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("About"),
    items: [
      {
        label: t("Contact"),
        href: "https://docs.vertotrade.com//contact-us",
        isHighlighted: true,
      },
      {
        label: t("Brand"),
        href: "https://docs.vertotrade.com//brand",
      },
      {
        label: t("Blog"),
        href: "https://medium.com/vertotrade",
      },
      {
        label: t("Community"),
        href: "https://docs.vertotrade.com//contact-us/telegram",
      },
      {
        label: t("Litepaper"),
        href: "https://v2litepaper.pancakeswap.finance/",
      },
    ],
  },
  {
    label: t("Help"),
    items: [
      {
        label: t("Customer Support"),
        href: "https://docs.vertotrade.com//contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "https://docs.vertotrade.com//help/troubleshooting",
      },
      {
        label: t("Guides"),
        href: "https://docs.vertotrade.com//get-started",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: "Github",
        href: "https://github.com/vertotrade",
      },
      {
        label: t("Documentation"),
        href: "https://docs.vertotrade.com/",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.vertotrade.com/code/bug-bounty",
      },
      {
        label: t("Audits"),
        href: "https://docs.vertotrade.com//help/faq#is-vertotrade-safe-has-vertotrade-been-audited",
      },
      {
        label: t("Careers"),
        href: "https://docs.vertotrade.com//hiring/become-a-chef",
      },
    ],
  },
];
