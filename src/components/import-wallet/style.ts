import styled from 'styled-components';
import { colors, fonts } from '../../utils';

const { primaryText, darkBackground1 } = colors;
const { subHeadingFontSize } = fonts;

export const OptionDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 0;
`;

export const Option = styled.p`
    width: 133px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: { selected: boolean }) =>
        props.selected ? 'rgba(33, 154, 154, 0.3);' : '#212121'};
    margin-right: 20px;
    font-weight: 500;
    font-size: ${subHeadingFontSize};
    line-height: 16px;
    letter-spacing: 0.02em;
    color: ${primaryText};
    opacity: 0.8;
    border-radius: 20px;
    font-size: 0.8rem;
    cursor: pointer;
`;

export const UploadFileDiv = styled.div`
    margin-top: 30px;
    margin-left: 0.6rem;
    width: 80%;
`;

export const UploadFile = styled.label`
    background-color: ${darkBackground1};
    color: ${primaryText};
    padding: 0.6rem 1rem;
    width: 254px;
    height: 14px;
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.02em;
    border-radius: 8px;
    border: 0.5px solid rgba(250, 250, 250, 0.5);
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
`;
