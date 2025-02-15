/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { colors, fonts } from '../../../../utils';

const { primaryText, darkBackground1 } = colors;
const { mainHeadingFontSize, buttonFontSize, subHeadingFontSize } = fonts;

export const MainDiv = styled.div`
    border: 0.8px solid primaryBackground;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    padding: 1rem 0.5rem;
    box-sizing: border-box;
    border-radius: 6px;
`;

export const MainText1 = styled.p`
    font-size: ${mainHeadingFontSize};
    line-height: 21px;
    margin-top: ${(props) => props.marginTop && props.marginTop};
    color: rgba(250, 250, 250, 0.85);
    text-align: ${(props) => props.textAlign}; 
`;

export const VerticalContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${(props) => (props.mb ? props.mb : '0px')};
  margin-top: ${(props) => props.marginTop && props.marginTop};
`;

export const MainText = styled.p`
  height: 14px;
  font-size: ${(props) => (props.fs ? props.fs : '16px')};
  line-height: ${(props) => (props.lh ? props.lh : '19px')};
  font-weight: 500;
  letter-spacing: ${(props) => (props.ls ? props.ls : '0.01em')};
  color: ${(props) => (props.color ? props.color : primaryText)};
  width: 100%;
  text-align: start;
  margin: ${(props) => (props.m ? props.m : '0px')};
  margin-bottom: ${(props) => (props.mb ? props.mb : '12px')};
  margin-top: ${(props) => (props.mt && props.mt)};
`;

export const CloseIconDiv = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  color: ${primaryText};
  cursor: pointer;
`;

// ---------------------------------------
