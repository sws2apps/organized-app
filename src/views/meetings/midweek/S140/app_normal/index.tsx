import { Page, Text, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { Week } from '@definition/week_type';
import { S140Type } from '../shared/index.types';
import { useAppTranslation } from '@hooks/index';
import registerFonts from '@views/registerFonts';
import IconDiamond from '@views/components/icons/IconDiamond';
import IconLiving from '@views/components/icons/IconLiving';
import IconMinistry from '@views/components/icons/IconMinistry';
import S140AYF from './S140AYF';
import S140Hall from './S140Hall';
import S140Header from './S140Header';
import S140LC from './S140LC';
import S140PartTime from './S140PartTime';
import S140Person from './S140Person';
import S140Section from './S140Section';
import S140Song from './S140Song';
import S140Source from './S140Source';
import S140WeekHeader from './S140WeekHeader';
import styles from './index.styles';
import { applyRTL } from '@views/utils/pdf_utils';

registerFonts();

const TemplateS140AppNormal = ({
  data,
  class_count,
  cong_name,
  fullname,
  lang,
}: S140Type) => {
  const { t } = useAppTranslation();

  const stylesSmart = applyRTL(styles, lang);

  const minLabel = t('tr_minLabel', { lng: lang });

  return (
    <Document title={t('tr_midweekMeetingPrint')} lang={lang}>
      <Page size="A4" style={stylesSmart.page}>
        <S140Header cong_name={cong_name} lang={lang} />

        {data.map((meetingData) => (
          <View
            key={`week-${meetingData.weekOf}`}
            style={stylesSmart.weekContainer}
            wrap={false}
          >
            <S140WeekHeader
              title={meetingData.schedule_title}
              secondary={
                meetingData.week_type === Week.CO_VISIT &&
                meetingData.week_type_name
              }
              lang={lang}
            />

            {meetingData.no_meeting && (
              <View style={stylesSmart.rowContainer}>
                <Text style={stylesSmart.weekInfoLabel}>
                  {meetingData.week_type_name}
                </Text>
              </View>
            )}

            {!meetingData.no_meeting && (
              <>
                {/* Opening Song & Opening Prayer */}
                {meetingData.full && (
                  <View style={stylesSmart.rowContainer}>
                    <S140PartTime
                      time={meetingData.timing.pgm_start}
                      color="#3B4CA3"
                      backgroundColor="#F2F5FF"
                      lang={lang}
                    />

                    <S140Source
                      node={
                        <S140Song song={meetingData.song_first} lang={lang} />
                      }
                      secondary={`${t('tr_prayer', { lng: lang })}:`}
                      lang={lang}
                    />

                    <S140Person
                      primary={meetingData.opening_prayer_name}
                      lang={lang}
                    />
                  </View>
                )}

                {/* Chairman */}
                <View style={stylesSmart.rowContainer}>
                  <S140PartTime
                    time={
                      meetingData.full && meetingData.timing.opening_comments
                    }
                    color={meetingData.full && '#3B4CA3'}
                    backgroundColor={meetingData.full && '#F2F5FF'}
                    lang={lang}
                  />

                  <S140Source
                    source={
                      meetingData.full
                        ? t('tr_openingComments', { lng: lang })
                        : ' '
                    }
                    secondary={`${t('tr_chairman', { lng: lang })}:`}
                    lang={lang}
                  />

                  <S140Person
                    primary={meetingData.chairman_A_name}
                    lang={lang}
                  />
                </View>

                {/* TGW */}
                {(meetingData.treasures || meetingData.students) && (
                  <S140Section
                    color="#3C7F8B"
                    icon={<IconDiamond />}
                    section={t('tr_treasuresPart', { lng: lang })}
                    lang={lang}
                    secondary={
                      <View style={stylesSmart.sectionHallContainer}>
                        {meetingData.aux_class && (
                          <S140Hall
                            name={t('tr_auxClass', { lng: lang })}
                            counselor={meetingData.chairman_B_name}
                            group={meetingData.aux_room_fsg}
                            lang={lang}
                          />
                        )}

                        <S140Hall
                          name={t('tr_mainHall', { lng: lang })}
                          lang={lang}
                        />
                      </View>
                    }
                  >
                    {meetingData.treasures && (
                      <>
                        {/* TGW Talk */}
                        <View style={stylesSmart.rowContainer}>
                          <S140PartTime
                            time={meetingData.timing.tgw_talk}
                            color="#2A6B77"
                            backgroundColor="rgba(60, 127, 139, 0.08)"
                            lang={lang}
                          />

                          <S140Source
                            source={meetingData.tgw_talk_src}
                            duration={meetingData.tgw_talk_time}
                            color="#2A6B77"
                            lang={lang}
                          />

                          <S140Person
                            primary={meetingData.tgw_talk_name}
                            lang={lang}
                          />
                        </View>

                        {/* TGW Gems */}
                        <View
                          style={{
                            ...stylesSmart.rowContainer,
                            backgroundColor: '#ECF6F8',
                          }}
                        >
                          <S140PartTime
                            time={meetingData.timing.tgw_gems}
                            color="#2A6B77"
                            backgroundColor="rgba(60, 127, 139, 0.08)"
                            lang={lang}
                          />

                          <S140Source
                            source={meetingData.tgw_gems_src}
                            duration={meetingData.tgw_gems_time}
                            color="#2A6B77"
                            lang={lang}
                          />

                          <S140Person
                            primary={meetingData.tgw_gems_name}
                            lang={lang}
                          />
                        </View>
                      </>
                    )}

                    {/* TGW Bible Reading */}
                    {meetingData.students && (
                      <View style={stylesSmart.rowContainer}>
                        <S140PartTime
                          time={meetingData.timing.tgw_bible_reading}
                          color="#2A6B77"
                          backgroundColor="rgba(60, 127, 139, 0.08)"
                          lang={lang}
                        />

                        <S140Source
                          source={meetingData.tgw_bible_reading_src}
                          duration={`4 ${minLabel}`}
                          color="#2A6B77"
                          lang={lang}
                        />

                        {meetingData.aux_class && (
                          <S140Person
                            primary={meetingData.tgw_bible_reading_B_name}
                            lang={lang}
                          />
                        )}

                        <S140Person
                          primary={meetingData.tgw_bible_reading_A_name}
                          lang={lang}
                        />
                      </View>
                    )}
                  </S140Section>
                )}

                {/* AYF */}
                {meetingData.students && (
                  <S140Section
                    color="#C28200"
                    icon={<IconMinistry />}
                    section={t('tr_applyFieldMinistryPart', { lng: lang })}
                    lang={lang}
                  >
                    <S140AYF
                      meetingData={meetingData}
                      class_count={class_count}
                      fullname={fullname}
                      lang={lang}
                    />
                  </S140Section>
                )}

                {/* LC */}
                {meetingData.living && (
                  <S140Section
                    color="#B82B10"
                    icon={<IconLiving />}
                    section={t('tr_livingPart', { lng: lang })}
                    lang={lang}
                  >
                    {/* Middle song */}
                    {meetingData.full && (
                      <View style={stylesSmart.rowContainer}>
                        <S140PartTime
                          time={meetingData.timing.lc_middle_song}
                          color="#942926"
                          backgroundColor="rgba(184, 43, 16, 0.08)"
                          lang={lang}
                        />

                        <S140Source
                          node={
                            <S140Song
                              song={meetingData.lc_middle_song}
                              lang={lang}
                            />
                          }
                          lang={lang}
                        />
                      </View>
                    )}

                    {/* LC Parts */}
                    <S140LC meetingData={meetingData} lang={lang} />

                    {/* When CO visits: Concluding Comments */}
                    {meetingData.week_type === Week.CO_VISIT && (
                      <>
                        {/* Concluding Comments */}
                        <View style={stylesSmart.rowContainer}>
                          <S140PartTime
                            time={meetingData.timing.concluding_comments}
                            color="#942926"
                            backgroundColor="rgba(184, 43, 16, 0.08)"
                            lang={lang}
                          />

                          <S140Source
                            source={t('tr_concludingComments', { lng: lang })}
                            lang={lang}
                          />

                          <S140Person
                            primary={meetingData.chairman_A_name}
                            lang={lang}
                          />
                        </View>

                        {/* Talk by CO */}
                        <View
                          style={{
                            ...stylesSmart.rowContainer,
                            backgroundColor: '#FFF3F1',
                          }}
                        >
                          <S140PartTime
                            time={meetingData.timing.co_talk}
                            color="#942926"
                            backgroundColor="rgba(184, 43, 16, 0.08)"
                            lang={lang}
                          />

                          <S140Source
                            source={meetingData.lc_co_talk || ''}
                            lang={lang}
                          />

                          <S140Person
                            primary={meetingData.co_name}
                            lang={lang}
                          />
                        </View>
                      </>
                    )}

                    {/* Normal Week */}
                    {meetingData.cbs && (
                      <>
                        {/* CBS */}
                        <View
                          style={{
                            ...stylesSmart.rowContainer,
                            backgroundColor:
                              (meetingData.lc_count + 1) % 2 === 0
                                ? ''
                                : '#FFF3F1',
                          }}
                        >
                          <S140PartTime
                            time={meetingData.timing.cbs}
                            color="#942926"
                            backgroundColor="rgba(184, 43, 16, 0.08)"
                            lang={lang}
                          />

                          <S140Source
                            source={meetingData.lc_cbs_title}
                            duration={meetingData.lc_cbs_time}
                            secondary={meetingData.lc_cbs_label}
                            color="#942926"
                            lang={lang}
                          />

                          <S140Person
                            primary={meetingData.lc_cbs_conductor_name}
                            secondary={meetingData.lc_cbs_reader_name}
                            direction={fullname ? 'column' : 'row'}
                            lang={lang}
                          />
                        </View>

                        {/* Concluding Comments */}
                        {meetingData.full && (
                          <View style={stylesSmart.rowContainer}>
                            <S140PartTime
                              time={meetingData.timing.concluding_comments}
                              color="#942926"
                              backgroundColor="rgba(184, 43, 16, 0.08)"
                              lang={lang}
                            />

                            <S140Source
                              source={t('tr_concludingComments', { lng: lang })}
                              lang={lang}
                            />

                            <S140Person
                              primary={meetingData.chairman_A_name}
                              lang={lang}
                            />
                          </View>
                        )}
                      </>
                    )}

                    {/* Closing Song & Closing Prayer */}
                    {meetingData.full && (
                      <View style={stylesSmart.rowContainer}>
                        <S140PartTime
                          time={meetingData.timing.pgm_end}
                          color="#942926"
                          backgroundColor="rgba(184, 43, 16, 0.08)"
                          isClosingSong={true}
                          lang={lang}
                        />

                        <S140Source
                          node={
                            <S140Song
                              song={meetingData.lc_concluding_song}
                              lang={lang}
                            />
                          }
                          secondary={`${t('tr_prayer', { lng: lang })}:`}
                          lang={lang}
                        />

                        <S140Person
                          primary={meetingData.lc_concluding_prayer}
                          lang={lang}
                        />
                      </View>
                    )}
                  </S140Section>
                )}
              </>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default TemplateS140AppNormal;
