import { Fragment } from 'react';
import { useAppTranslation } from '@hooks/index';
import useMyRequests from './useMyRequests';
import Button from '@components/button';
import Card from '@components/card';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Divider from '@components/divider';
import IconLoading from '@components/icon_loading';
import InfoNote from '@components/info_note';
import Markup from '@components/text_markup';
import PreachingPartnerEditor from '../request_editor';
import PreachingPartnerGroup from '../request_group';
import PreachingPartnerRow from '../request_row';

const MyRequests = () => {
  const { t } = useAppTranslation();

  const {
    groups,
    editRequest,
    cancelRequest,
    isCancelling,
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
        <Card sx={{ gap: '24px' }}>
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
        <Dialog
          open={!!cancelRequest}
          onClose={handleCloseCancel}
          title={t('tr_cancelArrangement')}
          description={t('tr_cancelArrangementDesc')}
        >
          <DialogActions>
            <Button
              variant="secondary"
              onClick={handleCloseCancel}
              disabled={isCancelling}
            >
              {t('tr_cancel')}
            </Button>

            <Button
              variant="main"
              color="red"
              disabled={isCancelling}
              endIcon={isCancelling && <IconLoading />}
              onClick={handleConfirmCancel}
            >
              {t('tr_yes')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default MyRequests;
