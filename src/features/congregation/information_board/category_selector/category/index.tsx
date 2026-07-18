import { Box } from '@mui/material';
import { CategoryProps } from './index.types';
import { cloneElement } from 'react';
import Typography from '@components/typography';
import MiniChip from '@components/mini_chip';

const Category = (props: CategoryProps) => {
  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={props.title}
      onClick={props.onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
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
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 8px 8px 8px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {cloneElement(props.icon, {
              color: props.isActive ? 'var(--accent-dark)' : 'var(--grey-400)',
            })}
            <Typography
              className={props.isActive ? 'h4' : 'body-regular'}
              color={props.isActive ? 'var(--accent-dark)' : 'var(--grey-400)'}
            >
              {props.title}
            </Typography>
          </Box>
          {props.entries.length !== 0 && (
            <Box
              sx={{
                padding: '2px 10px 2px 10px',
                borderRadius: 'var(--radius-xxl)',
                backgroundColor: props.isActive
                  ? 'var(--accent-main)'
                  : 'var(--accent-150)',
              }}
            >
              <Typography
                className="label-small-medium"
                color="var(--always-white)"
              >
                {props.entries.length}
              </Typography>
            </Box>
          )}
        </Box>
        {props.isCollapsed! && props.entries.length !== 0 && (
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
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                padding: '0 0 8px 8px',
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
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Category;
