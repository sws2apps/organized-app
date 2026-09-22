import { Fragment } from 'react';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useMyRequests from './useMyRequests';
import Card from '@components/card';
import Divider from '@components/divider';
import InfoNote from '@components/info_note';
import Markup from '@components/text_markup';
import PreachingPartnerConfirmDialog from '../confirm_dialog';
import PreachingPartnerEditor from '../request_editor';
import PreachingPartnerGroup from '../request_group';
import PreachingPartnerRow from '../request_row';

const MyRequests = () => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const {
    groups,
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
                  />
                ))}
              </PreachingPartnerGroup>
            </Fragment>
          ))}
        </Card>
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
          description={t('tr_cancelArrangementDesc')}
          confirmLabel={t('tr_yes')}
        />
      )}
    </>
  );
};

export default MyRequests;
