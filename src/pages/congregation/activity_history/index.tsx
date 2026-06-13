import { useState, useMemo, MouseEvent } from 'react';
import { Box, Table, TableBody, TableContainer } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAtomValue } from 'jotai';
import { format } from 'date-fns';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import {
  shortDateFormatState,
  hour24FormatState,
  congNameState,
  JWLangLocaleState,
} from '@states/settings';
import PageTitle from '@components/page_title';
import NavBarButton from '@components/nav_bar_button';
import CustomFilterChip from '@components/filter_chip';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';
import TableHead from '@components/table/TableHead';
import IconButton from '@components/icon_button';
import { IconExport, IconInfo, IconBack } from '@components/icons';
import { Order } from '@components/table/index.types';
import { TemplateActivityLog } from '@views/index';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import useActivityHistory from './useActivityHistory';
import LogEntryRow from './log_entry_row';
import { AppLogFilterType } from '@definition/app_logs';

const ITEMS_PER_PAGE = 50;

const ActivityHistoryPage = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();
  const { isAdmin } = useCurrentUser();

  const { logs, filter, setFilter, isLoading, totalCount } =
    useActivityHistory();

  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState('updatedAt');

  const dateFormat = useAtomValue(shortDateFormatState);
  const is24h = useAtomValue(hour24FormatState);
  const congName = useAtomValue(congNameState);
  const locale = useAtomValue(JWLangLocaleState);

  const tableColumns = useMemo(
    () => [
      {
        id: 'actor_name',
        label: t('tr_name'),
        sx: { minWidth: '140px', width: '18%' },
      },
      {
        id: 'module',
        label: t('tr_area'),
        sx: { width: '10%', minWidth: '90px' },
      },
      { id: 'action', label: t('tr_action'), type: 'action' },
      {
        id: 'description',
        label: t('tr_change'),
        sx: { width: '35%' },
      },
      { id: 'date', label: t('tr_date') },
      { id: 'time', label: t('tr_time') },
      // Narrow column for copy icon — no header text
      { id: '_copy', label: '', sx: { width: '24px', padding: '0' } },
    ],
    [t]
  );

  const handleRequestSort = (_: MouseEvent<unknown>, property: string) => {
    if (property === '_copy') return;
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      let aVal = '';
      let bVal = '';

      switch (orderBy) {
        case 'actor_name':
          aVal = a.actor_name;
          bVal = b.actor_name;
          break;
        case 'module':
          aVal = a.module;
          bVal = b.module;
          break;
        case 'action':
          aVal = a.action;
          bVal = b.action;
          break;
        case 'description':
          aVal = a.description;
          bVal = b.description;
          break;
        default:
          aVal = a.updatedAt;
          bVal = b.updatedAt;
          break;
      }

      return order === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [logs, order, orderBy]);

  const totalPages = Math.max(1, Math.ceil(sortedLogs.length / ITEMS_PER_PAGE));
  const paginatedLogs = useMemo(
    () => sortedLogs.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE),
    [sortedLogs, page]
  );

  const handleFilterChange = (key: AppLogFilterType) => {
    setFilter(key);
    setPage(0);
  };

  const handleExport = async () => {
    if (isExporting || logs.length === 0) return;

    try {
      setIsExporting(true);

      const blob = await pdf(
        <TemplateActivityLog
          logs={sortedLogs}
          congregation={congName}
          lang={locale}
          dateFormat={dateFormat}
          is24h={is24h}
        />
      ).toBlob();

      const filename = `Action_History_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      saveAs(blob, filename);
    } catch (error) {
      console.error(error);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAdmin) return null;

  const canGoPrev = page > 0;
  const canGoNext = page < totalPages - 1;

  const cardHeight = tablet688Up
    ? 'calc(100dvh - 72px - 24px)'
    : 'calc(100dvh - 72px - 84px)';

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={t('tr_activityHistory')}
        buttons={
          <NavBarButton
            main
            text={t('tr_export')}
            icon={<IconExport />}
            onClick={handleExport}
            disabled={isExporting || logs.length === 0}
          />
        }
      />

      {/* Page card */}
      <Box
        sx={{
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'var(--white)',
          height: cardHeight,
        }}
      >
        {/* Header row: title + pagination (top-right) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            minHeight: '32px',
          }}
        >
          <Typography className="h3">
            {t('tr_entries')}: {sortedLogs.length}
          </Typography>

          {/* Pagination — sleek pill design in top-right corner */}
          {!isLoading && sortedLogs.length > ITEMS_PER_PAGE && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                border: '1px solid var(--accent-200)',
                borderRadius: 'var(--radius-s)',
                padding: '2px',
                backgroundColor: 'var(--accent-150)',
                overflow: 'hidden',
              }}
            >
              <IconButton
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={!canGoPrev}
                edge={false}
                sx={{
                  padding: '4px',
                  borderRadius: 'var(--radius-s)',
                }}
              >
                <IconBack
                  color={canGoPrev ? 'var(--accent-dark)' : 'var(--grey-300)'}
                  width={16}
                  height={16}
                />
              </IconButton>

              <Typography
                className="body-small-semibold"
                color="var(--grey-400)"
                sx={{
                  padding: '0 8px',
                  userSelect: 'none',
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                  minWidth: '44px',
                  textAlign: 'center',
                }}
              >
                {page + 1} {t('tr_of', { defaultValue: 'of' })} {totalPages}
              </Typography>

              <IconButton
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={!canGoNext}
                edge={false}
                sx={{
                  padding: '4px',
                  borderRadius: 'var(--radius-s)',
                }}
              >
                <IconBack
                  color={canGoNext ? 'var(--accent-dark)' : 'var(--grey-300)'}
                  width={18}
                  height={18}
                  sx={{ transform: 'rotate(180deg)' }}
                />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Filter chips row */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { key: 'all' as AppLogFilterType, label: t('tr_all') },
            { key: 'mine' as AppLogFilterType, label: t('tr_myActivity') },
            { key: 'admins' as AppLogFilterType, label: t('tr_admins') },
            {
              key: 'others' as AppLogFilterType,
              label: t('tr_otherUsers'),
            },
          ].map(({ key, label }) => (
            <CustomFilterChip
              key={key}
              label={label}
              selected={filter === key}
              onClick={() => handleFilterChange(key)}
            />
          ))}
        </Box>

        {/* Table container (scrollable) */}
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table
            stickyHeader
            size="small"
            sx={{
              tableLayout: 'fixed',
              '& .MuiTableHead-root .MuiTableCell-root': {
                backgroundColor: 'var(--white)',
                borderBottom: '1px solid var(--accent-200)',
              },
              '& .MuiTableCell-root': {
                padding: '8px 4px',
                boxSizing: 'content-box',
              },
              '& .MuiTableBody-root .MuiTableRow-root > .MuiTableCell-root': {
                borderBottom: '1px solid var(--accent-200)',
              },
            }}
          >
            <TableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columns={tableColumns}
            />

            {!isLoading && paginatedLogs.length > 0 && (
              <TableBody>
                {paginatedLogs.map((entry) => (
                  <LogEntryRow key={entry.id} entry={entry} />
                ))}
              </TableBody>
            )}
          </Table>

          {/* Loading state */}
          {isLoading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '32px 0',
              }}
            >
              <WaitingLoader />
            </Box>
          )}

          {/* Empty state */}
          {!isLoading && paginatedLogs.length === 0 && (
            <Box
              sx={{
                width: '100%',
                padding: '16px 8px 8px 8px',
                gap: '8px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IconInfo color="var(--grey-350)" />
              <Typography
                className="body-small-regular"
                color="var(--grey-350)"
              >
                {totalCount === 0 ? t('tr_noLogs') : t('tr_noLogsForFilter')}
              </Typography>
            </Box>
          )}
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ActivityHistoryPage;
