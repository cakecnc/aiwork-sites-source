import type { Locale } from "./i18n";

export const characterKeys = ["aiwork", "planner"] as const;

export type CharacterKey = (typeof characterKeys)[number];

export type CharacterProfile = {
  openSrc: string;
  winkSrc: string;
  thumbnailSrc: string;
};

export const characterProfiles: Record<CharacterKey, CharacterProfile> = {
  aiwork: {
    openSrc: "/images/aiwork-assistant-open.webp",
    winkSrc: "/images/aiwork-assistant-wink.webp",
    thumbnailSrc: "/images/aiwork-assistant-wink.webp",
  },
  planner: {
    openSrc: "/images/aiwork-planner-open.webp",
    winkSrc: "/images/aiwork-agent-yellow.webp",
    thumbnailSrc: "/images/aiwork-agent-yellow.webp",
  },
};

type CharacterPickerCopy = {
  title: string;
  note: string;
  selectLabel: string;
  options: Record<CharacterKey, { name: string; note: string }>;
};

export const characterPickerCopy: Record<Locale, CharacterPickerCopy> = {
  ko: {
    title: "캐릭터 선택",
    note: "선택한 캐릭터가 모든 페이지에 적용됩니다",
    selectLabel: "{name} 캐릭터 선택",
    options: {
      aiwork: { name: "AIWORK", note: "차분한 블루 에이전트" },
      planner: { name: "플래너", note: "따뜻한 비즈니스 파트너" },
    },
  },
  en: {
    title: "Choose a character",
    note: "Your choice appears across every page",
    selectLabel: "Select the {name} character",
    options: {
      aiwork: { name: "AIWORK", note: "Calm blue agent" },
      planner: { name: "Planner", note: "Warm business partner" },
    },
  },
  ja: {
    title: "キャラクター選択",
    note: "選択内容はすべてのページに反映されます",
    selectLabel: "{name}キャラクターを選択",
    options: {
      aiwork: { name: "AIWORK", note: "落ち着いたブルーエージェント" },
      planner: { name: "プランナー", note: "親しみやすいビジネスパートナー" },
    },
  },
  "zh-CN": {
    title: "选择角色",
    note: "所选角色会应用到所有页面",
    selectLabel: "选择{name}角色",
    options: {
      aiwork: { name: "AIWORK", note: "沉稳的蓝色智能助手" },
      planner: { name: "策划伙伴", note: "温暖的商务伙伴" },
    },
  },
  ar: {
    title: "اختيار الشخصية",
    note: "تظهر الشخصية المختارة في جميع الصفحات",
    selectLabel: "اختيار شخصية {name}",
    options: {
      aiwork: { name: "AIWORK", note: "وكيلة زرقاء هادئة" },
      planner: { name: "المخططة", note: "شريكة أعمال ودودة" },
    },
  },
  es: {
    title: "Elegir personaje",
    note: "Tu elección se aplica a todas las páginas",
    selectLabel: "Seleccionar el personaje {name}",
    options: {
      aiwork: { name: "AIWORK", note: "Agente azul serena" },
      planner: { name: "Planner", note: "Socia de negocios cercana" },
    },
  },
  fr: {
    title: "Choisir un personnage",
    note: "Votre choix s’applique à toutes les pages",
    selectLabel: "Sélectionner le personnage {name}",
    options: {
      aiwork: { name: "AIWORK", note: "Agente bleue et sereine" },
      planner: { name: "Planner", note: "Partenaire professionnelle chaleureuse" },
    },
  },
  de: {
    title: "Charakter wählen",
    note: "Ihre Auswahl gilt auf allen Seiten",
    selectLabel: "Charakter {name} auswählen",
    options: {
      aiwork: { name: "AIWORK", note: "Ruhige blaue Agentin" },
      planner: { name: "Planner", note: "Sympathische Geschäftspartnerin" },
    },
  },
};
