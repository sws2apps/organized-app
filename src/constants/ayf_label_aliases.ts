import { AssignmentAYFOnlyType, AssignmentCode } from '@definition/assignment';

const {
  MM_Talk,
  MM_StartingConversation,
  MM_FollowingUp,
  MM_MakingDisciples,
  MM_ExplainingBeliefs,
} = AssignmentCode;

// Workbook labels that differ from the translated assignment names, keyed by JW language code
const SPANISH: AssignmentAYFOnlyType[] = [
  { label: 'Empecemos conversaciones', value: MM_StartingConversation },
  { label: 'Hagamos revisitas', value: MM_FollowingUp },
  { label: 'Hagamos discípulos', value: MM_MakingDisciples },
  { label: 'Expliquemos nuestras creencias', value: MM_ExplainingBeliefs },
];

export const AYF_LABEL_ALIASES: Record<string, AssignmentAYFOnlyType[]> = {
  S: SPANISH,
  LSE: SPANISH,
  BL: [
    { label: 'Започване на разговори', value: MM_StartingConversation },
    { label: 'Развиване на интереса', value: MM_FollowingUp },
    { label: 'Правене на ученици', value: MM_MakingDisciples },
    { label: 'Обясни вярванията си', value: MM_ExplainingBeliefs },
    { label: 'Доклад', value: MM_Talk },
  ],
  CHS: [{ label: '再次交谈', value: MM_FollowingUp }],
  ELI: [{ label: 'Starting a Conversation', value: MM_StartingConversation }],
  HI: [
    { label: 'बातचीत शुरू करना', value: MM_StartingConversation },
    { label: 'वापसी भेंट करना', value: MM_FollowingUp },
    { label: 'बाइबल अध्ययन चलाना', value: MM_MakingDisciples },
    { label: 'समझाना कि आप क्या मानते हैं', value: MM_ExplainingBeliefs },
    { label: 'समझाइए कि आप क्या मानते हैं', value: MM_ExplainingBeliefs },
    { label: 'भाषण', value: MM_Talk },
  ],
  IL: [{ label: 'Panagsarungkar', value: MM_FollowingUp }],
  M: [
    { label: 'Începe o conversație', value: MM_StartingConversation },
    { label: 'Fă vizite ulterioare', value: MM_FollowingUp },
    { label: 'Fă discipoli', value: MM_MakingDisciples },
    { label: 'Explică-ți convingerile', value: MM_ExplainingBeliefs },
    { label: 'Cuvântare', value: MM_Talk },
  ],
  Q: [{ label: 'התחל בשיחה', value: MM_StartingConversation }],
  ST: [{ label: 'Piiblikursuse juhatamine', value: MM_MakingDisciples }],
  TG: [{ label: 'Pagdalaw-Muli', value: MM_FollowingUp }],
  TH: [
    { label: 'A haamata i te hoê aparauraa', value: MM_StartingConversation },
    { label: 'A hoˈi e farerei', value: MM_FollowingUp },
    { label: 'A faariro ei pǐpǐ', value: MM_MakingDisciples },
    { label: 'A faataa i ta oe mau tiaturiraa', value: MM_ExplainingBeliefs },
  ],
  TNK: [{ label: 'Ampianara Olo', value: MM_MakingDisciples }],
  TW: [
    { label: 'Hyɛ Nkɔmmɔ Ase', value: MM_StartingConversation },
    { label: 'Hyɛ Nkɔmmɔ', value: MM_StartingConversation },
    { label: 'Yɛ Sankɔhwɛ', value: MM_FollowingUp },
    { label: 'Yɛ Asuafo', value: MM_MakingDisciples },
    { label: 'Kyerɛkyerɛ Wo Gyidi Mu', value: MM_ExplainingBeliefs },
  ],
  VT: [{ label: 'Bài giảng', value: MM_Talk }],
  YW: [
    { label: 'Gutangiza ikiganiro', value: MM_StartingConversation },
    { label: 'Gusubira gusura', value: MM_FollowingUp },
    { label: 'Kongera kuganira n’umuntu', value: MM_FollowingUp },
    { label: 'Guhindura abantu abigishwa', value: MM_MakingDisciples },
    { label: 'Sobanura imyizerere yawe', value: MM_ExplainingBeliefs },
    { label: 'Disikuru', value: MM_Talk },
  ],
  Z: [{ label: 'Tal', value: MM_Talk }],
};
