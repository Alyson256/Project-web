import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts';

export function PrivacyWarning() {
  const { t } = useLanguage();
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-xl mb-4">
      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm font-medium leading-relaxed">{t('dash.privacy_warning_text')}</p>
    </div>
  );
}
