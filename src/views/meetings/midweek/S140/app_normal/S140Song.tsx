import { Text, View } from '@react-pdf/renderer';
import { S140SongType } from './index.types';
import IconSong from '@views/components/icons/IconSong';
import styles from './index.styles';

const S140Song = ({ song }: S140SongType) => {
  return (
    <View style={styles.songContainer}>
      <IconSong />
      <Text style={styles.songText}>{song}</Text>
    </View>
  );
};

export default S140Song;
