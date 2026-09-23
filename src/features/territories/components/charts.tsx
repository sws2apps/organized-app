import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { Typography } from '@components/index';
import Card from '@components/card';

export const ChartCard = ({
  title,
  hint,
  action,
  children,
  span = 4,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  span?: number;
}) => (
  <Box
    sx={{
      gridColumn: {
        mobile: 'span 1',
        tablet600: 'span 12',
        laptop: span === 12 ? 'span 12' : 'span 6',
        desktop: `span ${span}`,
      },
      minWidth: 0,
      display: 'flex',
    }}
  >
    <Card sx={{ gap: '16px', flexGrow: 1, minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography className="h2" color="var(--black)">
            {title}
          </Typography>
          {hint && (
            <Typography className="label-small-regular" color="var(--grey-350)">
              {hint}
            </Typography>
          )}
        </Box>
        {action && (
          // pulled up so the button's own padding doesn't push it below the title
          <Box sx={{ flexShrink: 0, margin: '-6px -8px 0 0' }}>{action}</Box>
        )}
      </Box>
      {children}
    </Card>
  </Box>
);

const MeterBar = ({
  value,
  max,
  color = 'var(--accent-main)',
}: {
  value: number;
  max: number;
  color?: string;
}) => (
  <Box
    sx={{
      height: '8px',
      borderRadius: 'var(--radius-max)',
      backgroundColor: 'var(--accent-150)',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        width: `${max > 0 ? (value / max) * 100 : 0}%`,
        height: '100%',
        borderRadius: 'var(--radius-max)',
        backgroundColor: color,
      }}
    />
  </Box>
);

export const StatRow = ({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) => (
  <Stack spacing="6px">
    <Stack
      direction="row"
      sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}
    >
      <Typography className="body-small-regular" color="var(--grey-400)" noWrap>
        {label}
      </Typography>
      <Typography className="body-small-semibold" color="var(--black)">
        {value}
      </Typography>
    </Stack>
    <MeterBar value={value} max={max} color={color} />
  </Stack>
);

const toneOf = (value: number) => {
  if (value > 70) return 'var(--green-main)';
  if (value > 45) return 'var(--orange-main)';
  return 'var(--red-main)';
};

export const Gauge = ({ value, label }: { value: number; label: string }) => {
  const size = 200;
  const radius = size / 2 - 16;
  const circumference = Math.PI * radius;
  const filled = (Math.min(100, Math.max(0, value)) / 100) * circumference;

  const tone = toneOf(value);

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size / 2 + 34,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <svg
        width={size}
        height={size / 2 + 12}
        viewBox={`0 0 ${size} ${size / 2 + 12}`}
      >
        <path
          d={`M 16 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 16} ${size / 2}`}
          fill="none"
          stroke="var(--accent-150)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        <path
          d={`M 16 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 16} ${size / 2}`}
          fill="none"
          stroke={tone}
          strokeWidth={16}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
        />
      </svg>

      <Box
        sx={{
          position: 'absolute',
          top: size / 2 - 42,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography className="h1" color="var(--black)">
          {value}%
        </Typography>
        <Typography className="label-small-regular" color="var(--grey-350)">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export const ColumnChart = ({
  values,
  labels,
}: {
  values: number[];
  labels: string[];
}) => {
  const height = 150;
  const max = Math.max(...values, 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Stack
        direction="row"
        spacing="6px"
        sx={{ alignItems: 'flex-end', height: `${height}px` }}
      >
        {values.map((value, index) => (
          <Box
            key={labels[index]}
            title={`${labels[index]}: ${value}`}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              height: '100%',
            }}
          >
            <Typography
              className="label-small-medium"
              color="var(--grey-400)"
              sx={{ textAlign: 'center', marginBottom: '4px' }}
            >
              {value}
            </Typography>
            <Box
              sx={{
                height: `${Math.max((value / max) * (height - 26), 3)}px`,
                borderRadius: 'var(--radius-s) var(--radius-s) 0 0',
                backgroundColor:
                  value === max ? 'var(--accent-main)' : 'var(--accent-300)',
              }}
            />
          </Box>
        ))}
      </Stack>

      <Stack direction="row" spacing="6px">
        {labels.map((label) => (
          <Typography
            key={label}
            className="label-small-regular"
            color="var(--grey-350)"
            sx={{ flex: 1, textAlign: 'center' }}
          >
            {label}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
};
