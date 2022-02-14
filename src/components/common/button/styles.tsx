import React from 'react';
import MUIButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { ButtonInterface } from './types';

import { colors, fonts, dimension } from '../../../utils';

const { primaryBackground } = colors;
const { buttonFontSize } = fonts;
const { _height } = dimension.button;

const buttonPropsInterfaceWrapper: React.FunctionComponent<ButtonInterface> = ({
    children,
    onClick,
}) => {
    return <MUIButton onClick={onClick}>{children}</MUIButton>;
};

export const Button = styled(buttonPropsInterfaceWrapper)`
    width: ${(props) => props.width || '288px'};
    height: ${(props) => props.height || _height};
    filter: drop-shadow(0px 10px 10px rgba(46, 155, 155, 0.07));
    box-sizing: border-box;
    border-radius: ${(props) => props.br || '40px'};
    background: ${(props) =>
        !props.cancel ? primaryBackground : 'transparent'};
    font-size: ${buttonFontSize};
    text-transform: capitalize;
    font-weight: 500;
    border: ${(props) => props.border || `1px solid ${primaryBackground}`};
    &:hover {
        background-color: ${(props) =>
            !props.cancel ? primaryBackground : 'transparent'};
    }
    &:disabled {
        color: rgba(250, 250, 250, 0.8);
        background: rgba(46, 155, 155, 0.5);
        box-shadow: 0px 10px 10px rgba(46, 155, 155, 0.02);
        border: none;
    }
`;
