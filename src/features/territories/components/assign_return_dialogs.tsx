import { useAppTranslation } from '@hooks/index';
import { AssignReturn } from '@features/territories/useAssignReturn';
import AssignDialog from '@features/territories/components/assign_dialog';
import ReturnDialog from '@features/territories/components/return_dialog';

const AssignReturnDialogs = ({
  actions,
  canAssign,
}: {
  actions: AssignReturn;
  // Only editors can assign, reassign, or change an assignment’s campaign.
  canAssign: boolean;
}) => {
  const { t } = useAppTranslation();

  const { assignTarget, returnTarget } = actions;

  const doNotCalls = assignTarget?.doNotCalls.length ?? 0;

  return (
    <>
      {/* both dialogs mount per territory so their fields start from it */}
      {canAssign && assignTarget && (
        <AssignDialog
          key={`${assignTarget.id}:${assignTarget.assignments
            .filter((item) => !item.returnedOn)
            .map((item) => item.id)
            .join(',')}`}
          title={t('tr_territoryAssign', { number: assignTarget.number })}
          subtitle={`${assignTarget.name} · ${assignTarget.city}`}
          requestedBy={assignTarget.requestedBy}
          doNotCalls={doNotCalls}
          territory={assignTarget}
          onClose={actions.closeAssign}
          onAssign={(holder, assignedOn, campaign, card, note) =>
            actions.handleAssign(
              assignTarget.id,
              holder,
              assignedOn,
              campaign,
              note,
              card
            )
          }
        />
      )}

      {returnTarget && (
        <ReturnDialog
          key={`${returnTarget.id}:${returnTarget.assignments
            .filter((item) => !item.returnedOn)
            .map((item) => item.id)
            .join(',')}`}
          territory={returnTarget}
          own={!canAssign}
          onClose={actions.closeReturn}
          onReturn={actions.handleReturn}
          onAssignAgain={canAssign ? actions.handleAssign : undefined}
        />
      )}
    </>
  );
};

export default AssignReturnDialogs;
