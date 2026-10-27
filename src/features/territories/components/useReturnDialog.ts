import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { territoriesShowHouseholdsState } from '@states/territories';
import { territoryAssigneesState } from '@features/territories/assignees';
import { territoryCampaignsState } from '@features/territories/campaigns';
import {
  campaignOverlaps,
  campaignSnapshot,
} from '@features/territories/campaign_dates';
import { parseDate } from '@features/territories/helpers';
import {
  parseTerritoryHouseholds,
  territoryReturnDateError,
  territoryHolderAvailable,
} from '@utils/territory_assignments';
import type { CampaignChoice } from '@features/territories/components/campaign_field';
import { holderForReturn } from '@features/territories/group_holder';
import type { ReturnDialogProps } from '@features/territories/components/return_dialog';

const useReturnDialog = ({
  territory,
  own = false,
  onClose,
  onReturn,
  onAssignAgain,
}: ReturnDialogProps) => {
  const campaigns = useAtomValue(territoryCampaignsState);
  const assignees = useAtomValue(territoryAssigneesState);
  const showHouseholds = useAtomValue(territoriesShowHouseholdsState);

  const open = territory?.assignments.find((item) => !item.returnedOn);
  const flagged = open?.campaign;

  const [households, setHouseholds] = useState(
    territory ? String(territory.households) : ''
  );
  const [returnedOn, setReturnedOn] = useState<Date | null>(new Date());
  const [completed, setCompleted] = useState(true);
  const [note, setNote] = useState(open?.note ?? '');
  const [returnedBy, setReturnedBy] = useState(open?.publisher ?? '');
  const [assignAgain, setAssignAgain] = useState(false);
  const [campaign, setCampaign] = useState<CampaignChoice>({
    checked: !!flagged,
    value: flagged,
  });

  if (!territory) return undefined;

  const changedBy =
    returnedBy && returnedBy !== open?.publisher ? returnedBy : undefined;

  // the same publisher, for the same group; an old group record without one
  // goes out again through the assign dialog
  const publisher = changedBy ?? open?.publisher;
  const holder = holderForReturn(open, publisher, assignees);

  const canAssignAgain =
    !!onAssignAgain && !!holder && territoryHolderAvailable(holder, assignees);
  const reassign = assignAgain && canAssignAgain;

  const dateError = territoryReturnDateError(territory.assignments, returnedOn);

  const count = showHouseholds
    ? parseTerritoryHouseholds(households, territory.households)
    : territory.households;

  const chosenCampaign = campaign.checked ? campaign.value : undefined;
  const selectedCampaign = own ? flagged : chosenCampaign;
  const linkedCampaign = campaigns.find(
    (item) => item.id === selectedCampaign?.id
  );
  const assigned = parseDate(open?.assignedOn);
  // unflagged work that still ran into a campaign can be filed under it
  const overlapping =
    !flagged && assigned && returnedOn
      ? campaigns.filter((item) => campaignOverlaps(item, assigned, returnedOn))
      : [];

  const chosen = () => {
    if (own) return undefined;
    if (!campaign.checked || !campaign.value) return null;

    return campaign.value.id === flagged?.id
      ? flagged
      : campaignSnapshot(campaign.value);
  };

  const handleReturn = () => {
    if (!returnedOn || !!dateError || count === undefined) return;

    const returned = onReturn(
      territory.id,
      count,
      returnedOn,
      chosen(),
      note.trim(),
      own ? undefined : changedBy,
      completed
    );

    if (!returned) return;

    if (reassign && holder) onAssignAgain?.(territory.id, holder, returnedOn);

    onClose();
  };

  return {
    open,
    households,
    setHouseholds,
    returnedOn,
    setReturnedOn,
    completed,
    setCompleted,
    note,
    setNote,
    returnedBy,
    setReturnedBy,
    assignAgain,
    setAssignAgain,
    campaign,
    setCampaign,
    flagged,
    canAssignAgain,
    reassign,
    dateError,
    count,
    selectedCampaign,
    linkedCampaign,
    overlapping,
    showHouseholds,
    handleReturn,
  };
};

export default useReturnDialog;
