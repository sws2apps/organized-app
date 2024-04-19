import { promiseGetRecoil } from 'recoil-outside';
import appDb from '@shared/indexedDb/appDb';
import { JWLangState } from '@states/app';
import { coordinatorRoleState, lmmoRoleState } from '@states/settings';
import { sourceSchema } from '@services/dexie/schema';
import { SourceWeekLocaleType } from '@definition/sources';

type SourcesSaveType = { srcData: SourceWeekLocaleType; keepOverride: boolean; forPocket?: boolean };

export const dbSourcesSave = async ({ srcData, keepOverride, forPocket }: SourcesSaveType) => {
  const JWLang = await promiseGetRecoil(JWLangState);
  const lmmoRole = await promiseGetRecoil(lmmoRoleState);
  const coordinatorRole = await promiseGetRecoil(coordinatorRoleState);

  const source_lang = JWLang.toUpperCase();
  const isUpdateMidweek = !forPocket || (forPocket && !lmmoRole);
  const isUpdateWeekend = !forPocket || (forPocket && !coordinatorRole);

  const findSource = await appDb.sources.get(srcData.weekOf);

  if (!findSource) {
    const newSource = structuredClone(sourceSchema);
    newSource.weekOf = srcData.weekOf;

    await appDb.sources.put(newSource);
  }

  const source = await appDb.sources.get(srcData.weekOf);

  if (isUpdateMidweek) {
    source.mwb_week_date_locale[source_lang] = srcData.mwb_week_date_locale || '';
    source.mwb_weekly_bible_reading[source_lang] = srcData.mwb_weekly_bible_reading || '';
    source.mwb_song_first = srcData.mwb_song_first || '';
    source.mwb_tgw_talk[source_lang] = srcData.mwb_tgw_talk || '';
    source.mwb_tgw_bread[source_lang] = srcData.mwb_tgw_bread || '';
    source.mwb_ayf_count = srcData.mwb_ayf_count || 1;
    source.mwb_ayf_part1_type[source_lang] = srcData.mwb_ayf_part1_type || '';
    source.mwb_ayf_part1_time = srcData.mwb_ayf_part1_time || '';
    source.mwb_ayf_part1[source_lang] = srcData.mwb_ayf_part1 || '';
    source.mwb_ayf_part2_type[source_lang] = srcData.mwb_ayf_part2_type || '';
    source.mwb_ayf_part2_time = srcData.mwb_ayf_part2_time || '';
    source.mwb_ayf_part2[source_lang] = srcData.mwb_ayf_part2 || '';
    source.mwb_ayf_part3_type[source_lang] = srcData.mwb_ayf_part3_type || '';
    source.mwb_ayf_part3_time = srcData.mwb_ayf_part3_time || '';
    source.mwb_ayf_part3[source_lang] = srcData.mwb_ayf_part3 || '';
    source.mwb_ayf_part4_type[source_lang] = srcData.mwb_ayf_part4_type || '';
    source.mwb_ayf_part4_time = srcData.mwb_ayf_part4_time || '';
    source.mwb_ayf_part4[source_lang] = srcData.mwb_ayf_part4 || '';
    source.mwb_song_middle = srcData.mwb_song_middle || '';
    source.mwb_lc_count = srcData.mwb_lc_count || 1;
    source.mwb_lc_part1_time = srcData.mwb_lc_part1_time || '';
    source.mwb_lc_part1[source_lang] = srcData.mwb_lc_part1 || '';
    source.mwb_lc_part1_content[source_lang] = srcData.mwb_lc_part1_content || '';
    source.mwb_lc_part2_time = srcData.mwb_lc_part2_time || '';
    source.mwb_lc_part2[source_lang] = srcData.mwb_lc_part2 || '';
    source.mwb_lc_part2_content[source_lang] = srcData.mwb_lc_part2_content || '';

    source.mwb_lc_count_override = {
      value: keepOverride ? source.mwb_lc_count_override.value : srcData.mwb_lc_count_override,
      updatedAt: keepOverride ? source.mwb_lc_count_override.updatedAt : new Date().toISOString(),
    };
    source.mwb_lc_part1_time_override = {
      value: keepOverride ? source.mwb_lc_part1_time_override.value : srcData.mwb_lc_part1_time_override,
      updatedAt: keepOverride ? source.mwb_lc_count_override.updatedAt : new Date().toISOString(),
    };
    source.mwb_lc_part1_override = {
      value: keepOverride ? source.mwb_lc_part1_override.value : srcData.mwb_lc_part1_override,
      updatedAt: keepOverride ? source.mwb_lc_part1_override.updatedAt : new Date().toISOString(),
    };
    source.mwb_lc_part1_content_override = {
      value: keepOverride ? source.mwb_lc_part1_content_override.value : srcData.mwb_lc_part1_content_override,
      updatedAt: keepOverride ? source.mwb_lc_part1_override.updatedAt : new Date().toISOString(),
    };

    source.mwb_lc_part2_time_override = {
      value: keepOverride ? source.mwb_lc_part2_time_override.value : srcData.mwb_lc_part2_time_override,
      updatedAt: keepOverride ? source.mwb_lc_count_override.updatedAt : new Date().toISOString(),
    };
    source.mwb_lc_part2_override = {
      value: keepOverride ? source.mwb_lc_part2_override.value : srcData.mwb_lc_part2_override,
      updatedAt: keepOverride ? source.mwb_lc_part2_override.updatedAt : new Date().toISOString(),
    };
    source.mwb_lc_part2_content_override = {
      value: keepOverride ? source.mwb_lc_part2_content_override.value : srcData.mwb_lc_part2_content_override,
      updatedAt: keepOverride ? source.mwb_lc_part2_override.updatedAt : new Date().toISOString(),
    };

    source.mwb_lc_cbs[source_lang] = srcData.mwb_lc_cbs || '';
    source.mwb_lc_cbs_time_override = {
      value: keepOverride ? source.mwb_lc_cbs_time_override.value : srcData.mwb_lc_cbs_time_override,
      updatedAt: keepOverride ? source.mwb_lc_cbs_time_override.updatedAt : new Date().toISOString(),
    };

    source.mwb_song_conclude = srcData.mwb_song_conclude || '';
    source.mwb_song_conclude_override = {
      value: keepOverride ? source.mwb_song_conclude_override.value : srcData.mwb_song_conclude_override,
      updatedAt: keepOverride ? source.mwb_song_conclude_override.updatedAt : new Date().toISOString(),
    };

    source.mwb_co_talk_title = {
      value: keepOverride ? source.mwb_co_talk_title.value : srcData.mwb_co_talk_title || '',
      updatedAt: keepOverride ? source.mwb_co_talk_title.updatedAt : new Date().toISOString(),
    };
  }

  if (isUpdateWeekend) {
    source.w_co_talk_title = {
      value: keepOverride ? source.w_co_talk_title.value : srcData.w_co_talk_title || '',
      updatedAt: keepOverride ? source.w_co_talk_title.updatedAt : new Date().toISOString(),
    };
    source.w_study_date_locale[source_lang] = srcData.w_study_date_locale || '';
    source.w_study_title[source_lang] = srcData.w_study_title || '';
    source.w_study_opening_song = srcData.w_study_opening_song || '';
    source.w_study_concluding_song = srcData.w_study_concluding_song || '';
  }

  source.keepOverride = keepOverride ? source.keepOverride : new Date().toISOString();

  await appDb.sources.put(source);
};
