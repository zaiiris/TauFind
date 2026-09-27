import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { useTauFind } from "../context/TauFindContext";
import en from "./en";
import ru from "./ru";

const dictionaries = { en, ru };
const I18nContext = createContext(null);
const originals = new WeakMap();
const translatedNodes = new WeakSet();
const attributeOriginals = new WeakMap();

function readPath(source, path) {
  return path.split(".").reduce((value, part) => value?.[part], source);
}

function interpolate(value, variables = {}) {
  return Object.entries(variables).reduce((text, [key, replacement]) => text.replaceAll(`{{${key}}}`, replacement), value);
}

function translateDynamicPhrase(value) {
  let match = value.match(/^([\d\s\u00a0,.]+) m altitude, (.+), and (-?\d+)°C produce an environmental risk of (\d+)\/100\.$/);
  if (match) return `Высота ${match[1].trim()} м, условия «${translateVisibleText(match[2], "ru").trim()}» и температура ${match[3]}°C формируют экологический риск ${match[4]}/100.`;

  match = value.match(/^(\d+) bpm, (.+), and (\d+)% bracelet battery produce a sensor risk of (\d+)\/100\.$/);
  if (match) return `Пульс ${match[1]} уд/мин, ${translateVisibleText(match[2], "ru").trim()} и заряд браслета ${match[3]}% формируют сенсорный риск ${match[4]}/100.`;

  match = value.match(/^(.+) is rated (.+), producing a route risk of (\d+)\/100\.$/);
  if (match) return `${match[1]} имеет уровень сложности «${translateVisibleText(match[2], "ru").trim()}», поэтому риск маршрута составляет ${match[3]}/100.`;

  match = value.match(/^(.+) experience produces a preparedness risk of (\d+)\/100\.$/);
  if (match) return `Уровень опыта «${translateVisibleText(match[1], "ru").trim()}» формирует риск подготовки ${match[2]}/100.`;

  match = value.match(/^(\d+)% of required equipment is ready, leaving an equipment risk of (\d+)\/100\.$/);
  if (match) return `${match[1]}% обязательного снаряжения готово; остаточный риск снаряжения — ${match[2]}/100.`;

  match = value.match(/^Review the forecast and altitude plan: (.+) at ([\d\s\u00a0,.]+) m increases exposure\.$/);
  if (match) return `Проверьте прогноз и высотный план: условия «${translateVisibleText(match[1], "ru").trim()}» на высоте ${match[2].trim()} м увеличивают воздействие.`;

  return null;
}

function translateVisibleText(value, language) {
  if (language !== "ru" || !value?.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const core = value.trim();
  if (ru.phrases[core]) return `${leading}${ru.phrases[core]}${trailing}`;
  const dynamic = translateDynamicPhrase(core);
  if (dynamic) return `${leading}${dynamic}${trailing}`;

  let translated = core;
  Object.entries(ru.phrases)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([source, target]) => {
      if (source.length > 3 && translated.includes(source)) translated = translated.replaceAll(source, target);
    });
  translated = translated.replace(/\b[A-Za-z][A-Za-z-]*\b/g, (word) => ru.words[word.toLowerCase()] ?? word);
  return `${leading}${translated}${trailing}`;
}

function localizeTree(root, language) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const parentTag = node.parentElement?.tagName;
    if (!new Set(["SCRIPT", "STYLE", "NOSCRIPT"]).has(parentTag)) {
      if (language === "ru") {
        const source = translatedNodes.has(node) ? originals.get(node) : node.nodeValue;
        const translated = translateVisibleText(source, language);
        if (translated !== source) {
          originals.set(node, source);
          translatedNodes.add(node);
          if (node.nodeValue !== translated) node.nodeValue = translated;
        }
      } else if (translatedNodes.has(node)) {
        const source = originals.get(node);
        if (typeof source === "string" && node.nodeValue !== source) node.nodeValue = source;
      }
    }
    node = walker.nextNode();
  }

  root.querySelectorAll?.("[placeholder], [aria-label], [title]").forEach((element) => {
    const saved = attributeOriginals.get(element) ?? {};
    ["placeholder", "aria-label", "title"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!(attribute in saved)) saved[attribute] = element.getAttribute(attribute);
      const nextValue = language === "ru" ? translateVisibleText(saved[attribute], language) : saved[attribute];
      if (element.getAttribute(attribute) !== nextValue) element.setAttribute(attribute, nextValue);
    });
    attributeOriginals.set(element, saved);
  });
}

export function I18nProvider({ children }) {
  const { state, updatePlatform } = useTauFind();
  const storedLanguage = window.localStorage.getItem("taufind:language");
  const language = (storedLanguage ?? state.platform.language) === "ru" ? "ru" : "en";
  const dictionary = dictionaries[language];

  const t = useCallback((path, variables) => {
    const value = readPath(dictionary, path) ?? readPath(en, path) ?? path;
    return typeof value === "string" ? interpolate(value, variables) : value;
  }, [dictionary]);

  const translate = useCallback((value) => translateVisibleText(value, language)?.trim(), [language]);

  const setLanguage = useCallback((nextLanguage) => {
    const normalizedLanguage = nextLanguage === "ru" ? "ru" : "en";
    window.localStorage.setItem("taufind:language", normalizedLanguage);
    updatePlatform({ language: normalizedLanguage });
    window.setTimeout(() => window.location.reload(), 80);
  }, [updatePlatform]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = dictionary.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", dictionary.meta.description);
    localizeTree(document.body, language);

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        localizeTree(document.body, language);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title"] });
    return () => observer.disconnect();
  }, [dictionary, language]);

  const value = useMemo(() => ({ language, setLanguage, t, translate }), [language, setLanguage, t, translate]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// The provider and hook intentionally share this module.
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
