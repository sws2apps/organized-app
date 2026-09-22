import { Fragment } from 'react';
import { IconEdit } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useMyRequests from './useMyRequests';
import Card from '@components/card';
import Divider from '@components/divider';
import InfoNote from '@components/info_note';
import PreachingPartnerEditor from '../request_editor';
import PreachingPartnerGroup from '../request_group';
import PreachingPartnerRow from '../request_row';

const MyRequests = () => {
  const { t } = useAppTranslation();

  const { groups, editRequest, handleEdit, handleCloseEditor } =
    useMyRequests();

  if (groups.length === 0) {
    return <InfoNote variant="card" message={t('tr_noPartnerRequests')} />;
  }

  return (
    <>
      <Card sx={{ gap: '24px' }}>
        {groups.map((group, index) => (
          <Fragment key={group.date}>
            {index > 0 && <Divider color="var(--accent-200)" />}

            <PreachingPartnerGroup date={group.date}>
              {group.requests.map((request) => (
                <PreachingPartnerRow
                  key={request.request_uid}
                  request={request}
                  variant="accent"
                  actionLabel={t('tr_edit')}
                  actionIcon={<IconEdit />}
                  onAction={() => handleEdit(request)}
                />
              ))}
            </PreachingPartnerGroup>
          </Fragment>
        ))}
      </Card>

      {editRequest && (
        <PreachingPartnerEditor
          open={!!editRequest}
          onClose={handleCloseEditor}
          request={editRequest}
        />
      )}
    </>
  );
};

export default MyRequests;
