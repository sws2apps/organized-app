import { Box, Stack } from '@mui/material';
import { CategoryProps } from './index.types';
import { cloneElement } from 'react';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';

const Category = (props: CategoryProps) => {
  return (
    <Stack
      direction="row"
      role="button"
      tabIndex={0}
      aria-label={props.title}
      onClick={props.onClick}
      sx={{
        borderRadius: 'var(--radius-s)',
        backgroundColor: props.isActive ? 'var(--accent-150)' : 'none',
        cursor: props.isActive ? 'default' : 'pointer',

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },
      }}
    >
      <Box
        sx={{
          width: '4px',
          flexShrink: 0,
          borderRadius: '4px 0 0 4px',
          backgroundColor: props.isActive
            ? 'var(--accent-main)'
            : 'transparent',
        }}
      />

      <Stack
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ padding: '8px' }}
        >
          <Stack direction="row" alignItems="center" spacing="8px">
            {cloneElement(props.icon, {
              color: props.isActive ? 'var(--accent-dark)' : 'var(--grey-400)',
            })}

            <Typography
              className={props.isActive ? 'h4' : 'body-regular'}
              color={props.isActive ? 'var(--accent-dark)' : 'var(--grey-400)'}
            >
              {props.title}
            </Typography>
          </Stack>

          {!!props.entries.length && (
            <Box
              sx={{
                padding: '2px 10px',
                borderRadius: 'var(--radius-xxl)',
                backgroundColor: props.isActive
                  ? 'var(--accent-main)'
                  : 'var(--accent-150)',
              }}
            >
              <Typography
                className="label-small-medium"
                color={
                  props.isActive ? 'var(--always-white)' : 'var(--accent-dark)'
                }
              >
                {props.entries.length}
              </Typography>
            </Box>
          )}
        </Stack>

        {props.isCollapsed && !!props.entries.length && (
          <Box
            sx={{
              position: 'relative',

              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '32px',
                height: '100%',
                pointerEvents: 'none',
                background: props.isActive
                  ? 'linear-gradient(270deg, var(--accent-150) 0%, rgba(0,0,0,0) 100%)'
                  : 'linear-gradient(270deg, var(--white) 0%, rgba(0,0,0,0) 100%)',
              },
            }}
          >
            <Stack
              direction="row"
              spacing="4px"
              sx={{
                p: '0 0 8px 8px',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',

                '&::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {props.entries.map((entry) => (
                <Box
                  key={entry}
                  sx={{
                    flex: '0 0 auto',
                    maxWidth: 160,
                  }}
                >
                  <MiniChip
                    label={entry}
                    variant={props.isActive ? 'main' : 'grey'}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Category;
