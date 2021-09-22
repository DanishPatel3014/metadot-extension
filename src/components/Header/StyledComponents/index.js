import styled from 'styled-components';
import { colors, fonts } from '../../../utils';

const { primaryTextColor } = colors;
const { headerHeadingFontSize } = fonts;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

export const HeaderHeading = styled.h3`
  color: ${primaryTextColor};
  font-size: ${headerHeadingFontSize};
  margin: 0 auto;
  padding: 10px;
`;
