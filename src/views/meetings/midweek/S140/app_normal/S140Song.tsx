import { Text, View } from '@react-pdf/renderer';
import { S140SongType } from './index.types';
import IconSong from '@views/components/icons/IconSong';
import styles from './index.styles';
import { applyRTL } from '@views/utils/pdf_utils';

const S140Song = ({ song, lang }: S140SongType) => {
  const stylesSmart = applyRTL(styles, lang);

  return (
    <View style={stylesSmart.songContainer}>
      <IconSong />
      <Text style={stylesSmart.songText}>{song}</Text>
    </View>
  );
};

export default S140Song;
