import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Wrapper,
    LabelAndTextWrapper,
    UnAuthScreensContentWrapper,
} from '../common/wrapper';
import { WarningText, SubHeading } from '../common/text';
import { Button, Input, Header } from '../common';
import { fonts, helpers } from '../../utils';
import accounts from '../../utils/accounts';
import {
    setIsResponseModalOpen,
    setLoadingForApi,
    setMainTextForSuccessModal,
    setResponseImage,
    setSubTextForSuccessModal,
} from '../../redux/slices/modalHandling';
import ImportIcon from '../../assets/images/modalIcons/import.svg';
import AccountCreate from '../../assets/images/modalIcons/accountCreate.svg';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;
const { isUserNameValid } = helpers;
const { AccountCreation } = accounts;

const passwordErrorMessages = {
    minimumCharacterWarning: 'Password should not be less than 8 characters',
    didnotMatchWarning: 'Password did not match!',
    passwordValidation: `Password must contain at least one lower case,
         one upper case, one number and a special character`,
};

const { minimumCharacterWarning, didnotMatchWarning, passwordValidation } =
    passwordErrorMessages;

const CreateWallet: React.FunctionComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation().state as {
        prevRoute: string;
        seedToPass: string;
    };

    const operation =
        location.prevRoute === '/ImportWallet' ? 'Imported' : 'Created';

    const currSeed = location.seedToPass && location.seedToPass;

    const [walletName, setWalletName] = useState('');
    const [isValidWalletName, setIsValidWalletName] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (): boolean => {
        const regexRes = password.match(
            // eslint-disable-next-line max-len
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\\~!><@#$%?,;.^/&}{*)(_+:[}="|`'-])[a-zA-Z0-9\\.~!><@,;#$%?^}{/&*)(+:[}=|"`'\w-]{7,19}/
        );

        if (password.length < 8) {
            setPasswordError(minimumCharacterWarning);
            return false;
        }
        if (!(password === confirmPassword)) {
            setPasswordError(didnotMatchWarning);
            return false;
        }
        if (regexRes == null) {
            setPasswordError(passwordValidation);
            return false;
        }
        if (password === confirmPassword) {
            setPasswordError('');
            return true;
        }
        return true;
    };

    const [isLoading, setIsLoading] = useState(false);

    const createAccount = async (
        name: string,
        pass: string,
        seedPhrase: string
    ): Promise<boolean> => {
        console.log('create account ==>>', name, pass, seedPhrase);
        const res = await AccountCreation(name, pass, seedPhrase);
        return res;
    };

    const showSuccessModalAndNavigateToDashboard = (): void => {
        if (operation === 'Imported') {
            dispatch(setIsResponseModalOpen(true));
            dispatch(setResponseImage(ImportIcon));
            dispatch(setMainTextForSuccessModal(`Successfully ${operation}!`));
            dispatch(setSubTextForSuccessModal(''));
            navigate('/');
        } else {
            dispatch(setIsResponseModalOpen(true));
            dispatch(setResponseImage(AccountCreate));
            dispatch(setMainTextForSuccessModal(`Successfully ${operation}!`));
            dispatch(setSubTextForSuccessModal(''));
            navigate('/');
        }

        setTimeout(() => {
            dispatch(setIsResponseModalOpen(false));
        }, 2500);
    };

    const handleContinue = async (): Promise<void> => {
        try {
            // if (!isUserNameValid(walletName) || walletName.length < 3) {
            //     setIsValidWalletName(true);
            //     validatePassword();
            //     setIsLoading(false);
            //     return;
            // }
            // if (!validatePassword()) {
            //     setIsLoading(false);
            //     return;
            // }
            const resultt = await createAccount(walletName, password, currSeed);
            console.log('account created ==>>', resultt);
            dispatch(setLoadingForApi(false));
            setIsLoading(false);
            showSuccessModalAndNavigateToDashboard();
        } catch (err) {
            console.log('error n create wallet', err);
        }
    };

    const walletNameText = {
        className: mainHeadingfontFamilyClass,
        mb: '10px',
    };

    const styledInputName = {
        className: subHeadingfontFamilyClass,
        placeholder: 'Wallet Name',
        height: '15px',
        value: walletName,
        onChange: (t: string) => {
            setIsValidWalletName(false);
            if (t.length < 20) setWalletName(t.replace(/[^A-Z0-9]/gi, ''));
        },
    };

    const styledInputPassword = {
        placeholder: 'Password',
        className: subHeadingfontFamilyClass,
        value: password,
        height: '15px',
        onChange: (t: string) => {
            setPasswordError('');
            if (t.length < 20) setPassword(t);
        },
        hideHandler: () => setShowPassword(!showPassword),
        hideState: showPassword,
    };

    const styledInputConfirmPass = {
        placeholder: 're-enter password',
        className: subHeadingfontFamilyClass,
        value: confirmPassword,
        height: '15px',
        onChange: (t: string) => {
            setPasswordError('');
            if (t.length < 20) setConfirmPassword(t);
        },
        hideHandler: () => setShowConfirmPassword(!showConfirmPassword),
        hideState: showConfirmPassword,
    };

    const btn = {
        text: 'Continue',
        width: '300px',
        disabled: !(walletName && password && confirmPassword) && true,
        handleClick: async () => {
            setIsLoading(true);
            await handleContinue();
        },
        isLoading,
    };

    return (
        <Wrapper>
            <Header
                centerText="Authentication"
                backHandler={() => console.log('object')}
            />
            <UnAuthScreensContentWrapper>
                <LabelAndTextWrapper>
                    <SubHeading {...walletNameText}>Wallet Name</SubHeading>
                    <Input id="wallet-name" isCorrect {...styledInputName} />
                    {isValidWalletName && (
                        <WarningText
                            id="warning-text"
                            className={subHeadingfontFamilyClass}
                        >
                            Name should not be less than 3 characters and can
                            only contain alphanumeric data
                        </WarningText>
                    )}
                </LabelAndTextWrapper>

                <LabelAndTextWrapper marginTop="10px">
                    <SubHeading
                        className={mainHeadingfontFamilyClass}
                        marginTop="0px"
                        mb="10px"
                    >
                        Password
                    </SubHeading>
                    <Input
                        id="password"
                        {...styledInputPassword}
                        typePassword
                        isCorrect
                        rightIcon
                    />
                    {passwordError === minimumCharacterWarning && (
                        <WarningText
                            id="warning-text-1"
                            mb="10px"
                            className={subHeadingfontFamilyClass}
                        >
                            {minimumCharacterWarning}
                        </WarningText>
                    )}
                    {passwordError === passwordValidation && (
                        <WarningText
                            id="warning-text-2"
                            mb="10px"
                            className={subHeadingfontFamilyClass}
                        >
                            {passwordValidation}
                        </WarningText>
                    )}
                    {passwordError === didnotMatchWarning && (
                        <WarningText
                            id="warning-text-3"
                            mb="10px"
                            className={subHeadingfontFamilyClass}
                        >
                            {didnotMatchWarning}
                        </WarningText>
                    )}
                </LabelAndTextWrapper>

                <LabelAndTextWrapper marginTop="0">
                    <SubHeading
                        className={mainHeadingfontFamilyClass}
                        marginTop="0"
                        mb="10px"
                    >
                        Confirm Password
                    </SubHeading>
                    <Input
                        id="confirm-password"
                        {...styledInputConfirmPass}
                        typePassword
                        rightIcon
                        isCorrect
                    />

                    {passwordError === didnotMatchWarning && (
                        <WarningText
                            id="warning-text"
                            mb="5px"
                            className={subHeadingfontFamilyClass}
                        >
                            {didnotMatchWarning}
                        </WarningText>
                    )}
                </LabelAndTextWrapper>

                <SubHeading
                    mb="0"
                    textLightColor
                    marginTop="5px"
                    className={subHeadingfontFamilyClass}
                >
                    This password will be used as the transaction password for
                    the wallet, Metadot does not save passwords and cannot
                    retrieve them for you. Please keep your password safe!
                </SubHeading>
            </UnAuthScreensContentWrapper>
            <div
                className="btn-wrapper"
                style={{ marginLeft: '0', marginBottom: '10px' }}
            >
                <Button id="auth-continue" {...btn} />
            </div>
        </Wrapper>
    );
};

export default CreateWallet;
