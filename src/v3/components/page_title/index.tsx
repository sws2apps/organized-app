import { Box, SxProps } from '@mui/system';
import { ReactElement } from 'react';
import { IconAdd, IconArrowBack } from '../icons';
import { Typography, Button } from '@components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Types } from './page_title.types';
import React from 'react';

interface PageTitleProps {
  pageTitle?: string;
  actionIcon?: ReactElement;
  actionClick?: () => void;
  actionText?: string;
  secondaryActionIcon?: ReactElement;
  secondaryActionClick?: () => void;
  secondaryActionText?: string;
  type?: Types;
}

const PageTitle = ({
  pageTitle = '',
  actionIcon,
  actionClick,
  actionText,
  secondaryActionIcon,
  secondaryActionClick,
  secondaryActionText,
  type = Types.NO_BTN,
}: PageTitleProps) => {
  const { t } = useTranslation();

  const mainBoxStyle: SxProps = {
    display: 'flex',
    width: '100%',
    padding: 'var(--radius-none, 0px)',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 'var(--radius-none, 0px)',
  };

  const titleBoxStyle: SxProps = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const titleTextStyle: SxProps = {
    color: 'var(--black, #222)',
  };

  const buttonBoxStyle: SxProps = {
    display: 'flex',
    minHeight: '44px',
    padding: '8px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-l, 8px)',
    alignContent: 'center',
  };

  const buttonTextStyle: SxProps = {
    color: 'var(--always-white, #FEFEFE)',
  };

  const getTypePageTitle = () => {
    switch (type) {
      case Types.WITH_BTN:
        return (
          <Button sx={buttonBoxStyle} variant="main" onClick={actionClick} startIcon={actionIcon} disableAutoStretch>
            <Typography className="button-caps" sx={buttonTextStyle}>
              {actionText}
            </Typography>
          </Button>
        );
      case Types.TWO_BUTTONS:
        return (
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <Button
              sx={buttonBoxStyle}
              variant="secondary"
              onClick={secondaryActionClick}
              startIcon={secondaryActionIcon}
              disableAutoStretch
            >
              <Typography className="button-caps" sx={{ ...buttonTextStyle, color: 'var(--accent-main, #5065D0)' }}>
                {secondaryActionText}
              </Typography>
            </Button>
            <Button sx={buttonBoxStyle} variant="main" onClick={actionClick} startIcon={actionIcon} disableAutoStretch>
              <Typography className="button-caps" sx={buttonTextStyle}>
                {actionText}
              </Typography>
            </Button>
          </Box>
        );
      case Types.NO_BTN:
        return null;
      default:
        return Types.NO_BTN;
    }
  };

  return (
    <Box sx={mainBoxStyle}>
      <Box sx={titleBoxStyle}>
        <IconArrowBack />
        <Typography variant="h1" sx={titleTextStyle}>
          {t(pageTitle)}
        </Typography>
      </Box>
      <Box>{getTypePageTitle()}</Box>
    </Box>
  );
};

PageTitle.propTypes = {
  pageTitle: PropTypes.string,
  actionIcon: PropTypes.element,
  actionClick: PropTypes.func,
  actionText: PropTypes.string,
  secondaryActionIcon: PropTypes.element,
  secondaryActionClick: PropTypes.func,
  secondaryActionText: PropTypes.string,
  type: PropTypes.oneOf(['with-btn', 'two-buttons', 'no-btn']),
};

PageTitle.defaultProps = {
  pageTitle: 'Page Title',
  actionIcon: <IconAdd />,
  actionClick: PropTypes.func,
  actionText: 'Action Button',
  secondaryActionIcon: <IconAdd />,
  secondaryActionClick: PropTypes.func,
  secondaryActionText: 'Secondary button',
  type: Types.NO_BTN,
};

export default PageTitle;
