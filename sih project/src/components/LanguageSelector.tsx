import { languages } from '../utils/languages';

interface LanguageSelectorProps {
  selectedLang: string;
  onLanguageChange: (lang: string) => void;
}

export const LanguageSelector = ({ selectedLang, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <select
      value={selectedLang}
      onChange={(e) => onLanguageChange(e.target.value)}
      className="px-2 py-1 text-sm bg-[#3a4aa0] rounded border border-[#4a5ab0] focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};