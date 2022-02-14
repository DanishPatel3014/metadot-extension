import React, { useState } from 'react';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { MainDiv, MainText, MainText1, CloseIconDiv } from './styles';

import { Button, Input } from '../common';
import { fonts } from '../../utils';
import { WarningText } from '../common/text';
import { VerticalContentDiv } from '../common/wrapper';
import { DeriveModalInterface } from './types';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;

const DeriveModal: React.FunctionComponent<DeriveModalInterface> = ({
    open,
    handleClose,
    style,
    publicKey,
}) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const derivationValidate = (
        parentAddress: string,
        suri: string,
        parentPassword: string
    ): void => {
        try {
            navigate('/creatDerivedAccount', {
                state: {
                    parentPassword,
                    parentAddress,
                },
            });
        } catch (err) {
            console.log('error due to wrong ', err);
            setPasswordError('Invalid password!');
        }
    };

    const styledInput = {
        placeholder: 'Enter Password',
        value: password,
        className: subHeadingfontFamilyClass,
        fontSize: '9px',
        height: '20px',
        onChange: (t: string) => {
            setPassword(t);
            setPasswordError('');
        },
        hideHandler: () => setShowPassword(!showPassword),
        hideState: showPassword,
        mt: '0.03rem',
    };

    const input = {
        id: 'seed-input',
        className: subHeadingfontFamilyClass,
        onChange: () => null,
        value: '//0',
        fontSize: '9px',
    };

    const warningText = {
        id: 'warning-text',
        className: subHeadingfontFamilyClass,
        visibility: !!passwordError,
    };

    const btnF = {
        text: 'Create Derive Account',
        width: '240px',
        height: '40px',
        fontSize: '0.8rem',
        handleClick: () => derivationValidate(publicKey, '//0', password),
    };

    return (
        <Modal key={publicKey} open={open} onClose={handleClose}>
            <Box sx={style} className="txDetails-modal-style">
                <CloseIconDiv
                    id="close-icon"
                    onClick={() => {
                        handleClose();
                    }}
                >
                    <CloseIcon />
                </CloseIconDiv>
                <MainDiv>
                    <MainText1
                        marginTop="10px"
                        textAlign="center"
                        className={mainHeadingfontFamilyClass}
                    >
                        Derived Account
                    </MainText1>

                    <VerticalContentDiv marginTop="15px" marginBottom="10px">
                        <MainText
                            fs="14px"
                            mb="15px"
                            className={mainHeadingfontFamilyClass}
                        >
                            Password
                        </MainText>

                        <Input
                            id="auth-password"
                            typePassword
                            rightIcon
                            {...styledInput}
                        />
                        <WarningText {...warningText}>
                            {passwordError}
                        </WarningText>
                    </VerticalContentDiv>

                    <VerticalContentDiv>
                        <MainText
                            fs="14px"
                            mb="15px"
                            className={mainHeadingfontFamilyClass}
                        >
                            Derivation Path
                        </MainText>
                        <Input rightIconLock disabled {...input} />
                    </VerticalContentDiv>

                    <div className="btn-center" style={{ marginTop: '30px' }}>
                        <Button id="create-derive-account" {...btnF} />
                    </div>
                </MainDiv>
            </Box>
        </Modal>
    );
};

export default DeriveModal;
