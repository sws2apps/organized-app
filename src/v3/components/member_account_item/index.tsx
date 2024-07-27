import { Box } from '@mui/material';
import CustomTypography from '@components/typography';
import { StyledBoxWrapper } from './member_account_item.styled';
import { MemberAccountItemProps } from './member_account_item.types';

/**
 * Renders a member account item with member name, and role.
 * @param {MemberAccountItemProps} props - The props for the component.
 * @param {string} props.name - The name of the member.
 * @param {string} [props.role] - The role of the member.
 * @returns {JSX.Element} - JSX element representing the member account item.
 * @example
 * // Renders a member account item with a role:
 * <MemberAccountItem name="John" role="Coordinator" />
 */
const MemberAccountItem = (props: MemberAccountItemProps): JSX.Element => {
  return (
    <StyledBoxWrapper>
      <Box>
        <CustomTypography className="h4" style={{ fontWeight: '550' }}>
          {props.name}
        </CustomTypography>
        <CustomTypography
          className="body-small-regular"
          color="var(--grey-350)"
        >
          {props.role}
        </CustomTypography>
      </Box>
    </StyledBoxWrapper>
  );
};

export default MemberAccountItem;
