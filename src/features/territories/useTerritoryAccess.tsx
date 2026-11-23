import { applyTerritoryServerAccess } from '@services/app/territory_access';
import { userIDState } from '@states/app';
import {
  territoryLocalModeState,
  territoryServerAccessState,
} from '@states/territories';
import {
  currentPublisherState,
  territoryAssigneesState,
} from '@features/territories/assignees';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { personsActiveState } from '@states/persons';
import {
  fullnameOptionState,
  congIDState,
  territoryAccessState,
  territoryRestrictedCategoriesState,
  territoryRestrictedTypesState,
  userLocalUIDState,
} from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { getTranslation } from '@services/i18n/translation';
import type { TerritoryAccessContext } from '@definition/territory_access';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';

const useTerritoryAccess = (): TerritoryAccessContext => {
  const { isAdmin, isElder, isServiceCommittee, isPublisher, my_group } =
    useCurrentUser();
  const server = useAtomValue(territoryServerAccessState);
  const scope = `${useAtomValue(congIDState)}:${useAtomValue(userIDState)}`;
  const localMode = useAtomValue(territoryLocalModeState);
  const localPublisher = useAtomValue(currentPublisherState);
  const localAssignees = useAtomValue(territoryAssigneesState);
  const localMatches = localAssignees.filter(
    (item) => !item.group && item.name === localPublisher
  );
  const localPublisherId =
    localMatches.length === 1 ? localMatches[0].id : undefined;
  const persons = useAtomValue(personsActiveState);
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const uid = useAtomValue(userLocalUIDState);
  const option = useAtomValue(fullnameOptionState);
  const access = useAtomValue(territoryAccessState);
  const categories = useAtomValue(territoryRestrictedCategoriesState);
  const types = useAtomValue(territoryRestrictedTypesState);
  const eligiblePublisher =
    isPublisher &&
    persons.some(
      (person) =>
        person.person_uid === uid && !person.person_data.disqualified?.value
    );

  const publisher = useMemo(() => {
    if (localMode) return localPublisher;
    const names = persons.map((person) => ({
      id: person.person_uid,
      name: buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        option
      ),
    }));
    const name = names.find((person) => person.id === uid)?.name;

    // Legacy records contain names. An ambiguous name cannot grant access.
    const matchesGroup = groups.some(
      (group) =>
        (group.group_data.name ||
          getTranslation({
            key: 'tr_groupNumber',
            params: { groupNumber: group.group_data.sort_index + 1 },
          })) === name
    );
    return name &&
      !matchesGroup &&
      names.filter((person) => person.name === name).length === 1
      ? name
      : '';
  }, [persons, groups, uid, option, localMode, localPublisher]);

  const groupLead =
    !!uid &&
    my_group?.group_data.members.some(
      (member) =>
        member.person_uid === uid && (member.isOverseer || member.isAssistant)
    );
  const groupName =
    groupLead && my_group
      ? my_group.group_data.name ||
        getTranslation({
          key: 'tr_groupNumber',
          params: { groupNumber: my_group.group_data.sort_index + 1 },
        })
      : undefined;
  const groupHolder =
    groupName &&
    groups.filter(
      (group) =>
        (group.group_data.name ||
          getTranslation({
            key: 'tr_groupNumber',
            params: { groupNumber: group.group_data.sort_index + 1 },
          })) === groupName
    ).length === 1 &&
    !persons.some(
      (person) =>
        buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          option
        ) === groupName
    )
      ? groupName
      : undefined;

  return useMemo(
    () =>
      applyTerritoryServerAccess(
        {
          editor: isAdmin || isElder || isServiceCommittee,
          publisher: localPublisher,
          legacyIdentitySafe: !!publisher,
          publisherId: localMode ? localPublisherId : uid,
          groupId: !localMode && groupLead ? my_group?.group_id : undefined,
          eligiblePublisher,
          access,
          groupHolder,
          restricted: { categories, types },
        },
        !localMode && server?.scope === scope ? server : undefined
      ),
    [
      localMode,
      localPublisher,
      localPublisherId,
      uid,
      groupLead,
      my_group?.group_id,
      isAdmin,
      server,
      scope,
      isElder,
      isServiceCommittee,
      publisher,
      eligiblePublisher,
      access,
      groupHolder,
      categories,
      types,
    ]
  );
};

export default useTerritoryAccess;
