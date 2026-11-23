import { partnerDemoMode } from '@constants/index';
import PreachingPartnerCalendar from '@features/ministry/preaching_partner/add_to_calendar';
import { Fragment } from 'react';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMyRequests from '@features/ministry/preaching_partner/my_requests/useMyRequests';
import Card from '@components/card';
import Divider from '@components/divider';
import InfoNote from '@components/info_note';
import Markup from '@components/text_markup';
import PreachingPartnerConfirmDialog from '@features/ministry/preaching_partner/confirm_dialog';
import PreachingPartnerEditor from '@features/ministry/preaching_partner/request_editor';
import PreachingPartnerGroup from '@features/ministry/preaching_partner/request_group';
import PreachingPartnerRow from '@features/ministry/preaching_partner/request_row';

const MyRequests = () => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const {
    groups,
    calendarRequest,
    handleCalendar,
    handleCloseCalendar,
    editRequest,
    cancelRequest,
    handleEdit,
    handleCloseEditor,
    handleCancel,
    handleCloseCancel,
    handleConfirmCancel,
    handleSeeCongregation,
  } = useMyRequests();

  return (
    <>
      {groups.length === 0 && (
        <InfoNote variant="card">
          <Markup
            content={t('tr_noPartnerRequests')}
            className="body-small-regular"
            color="var(--accent-400)"
            anchorClick={handleSeeCongregation}
          />
        </InfoNote>
      )}

      {groups.length > 0 && (
        <Card sx={{ gap: tablet688Up ? '24px' : '16px' }}>
          {groups.map((group, index) => (
            <Fragment key={group.date}>
              {index > 0 && <Divider color="var(--accent-200)" />}

              <PreachingPartnerGroup date={group.date}>
                {group.requests.map((request) => (
                  <PreachingPartnerRow
                    key={request.request_uid}
                    request={request}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                    onCalendar={handleCalendar}
                  />
                ))}
              </PreachingPartnerGroup>
            </Fragment>
          ))}
        </Card>
      )}

      {calendarRequest && (
        <PreachingPartnerCalendar
          open
          onClose={handleCloseCalendar}
          request={calendarRequest}
        />
      )}

      {editRequest && (
        <PreachingPartnerEditor
          open={!!editRequest}
          onClose={handleCloseEditor}
          request={editRequest}
        />
      )}

      {cancelRequest && (
        <PreachingPartnerConfirmDialog
          open={!!cancelRequest}
          onClose={handleCloseCancel}
          onConfirm={handleConfirmCancel}
          title={t('tr_cancelArrangement')}
          description={t(
            partnerDemoMode
              ? 'tr_cancelArrangementDesc'
              : 'tr_partnerLiveCancelDesc'
          )}
          confirmLabel={t('tr_cancelArrangement')}
        />
      )}
    </>
  );
};

export default MyRequests;
