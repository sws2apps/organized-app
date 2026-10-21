import listPreview from '@assets/img/hall_cleaning/list.webp';
import cardsPreview from '@assets/img/hall_cleaning/cards.webp';
import rotationPreview from '@assets/img/hall_cleaning/rotation.webp';
import turnsPreview from '@assets/img/hall_cleaning/turns.webp';
import { useAppTranslation } from '@hooks/index';
import ExportTemplateSelector from '@features/meetings/export_template_selector';
import type { CleaningLayoutPreviewProps } from './index.types';

const previewImages = {
  list: listPreview,
  cards: cardsPreview,
  turns: turnsPreview,
  rotation: rotationPreview,
};

export default function CleaningLayoutPreview({
  layouts,
  value,
  onChange,
  onPreviewChange,
}: CleaningLayoutPreviewProps) {
  const { t } = useAppTranslation();
  return (
    <ExportTemplateSelector
      images={layouts.map((option) => ({
        id: option.value,
        name: option.label,
        desc: '',
        src: previewImages[option.value],
        small: previewImages[option.value],
      }))}
      showDescriptions={false}
      selected={value}
      onChange={onChange}
      label={t('tr_hallCleaningLayout')}
      onPreviewChange={onPreviewChange}
    />
  );
}
