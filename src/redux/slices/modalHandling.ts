import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SuccessCheckIcon from '../../assets/images/modalIcons/success.svg';

const initialState = {
    mainText: 'Success!',
    subText: 'The process is executed successully!',
    responseImage: SuccessCheckIcon,
    isResponseModalOpen: false,
    loadingForApi: false, // because this is a blacklisted reducer
    authScreenModal: false, // because this is a blacklisted reducer
    confirmSendModal: false, // because this is a blacklisted reducer
    derivedAccountModal: false, // because this is a blacklisted reducer
    isAuthorizedForSigning: false, // because this is a blacklisted reducer
};

export const modalHandling = createSlice({
    name: 'modalHandling',
    initialState,
    reducers: {
        setMainTextForSuccessModal: (state, action: PayloadAction<string>) => {
            return { ...state, mainText: action.payload };
        },
        setSubTextForSuccessModal: (state, action: PayloadAction<string>) => {
            return { ...state, subText: action.payload };
        },
        setResponseImage: (state, action: PayloadAction<string>) => {
            return { ...state, responseImage: action.payload };
        },
        setIsResponseModalOpen: (state, action: PayloadAction<boolean>) => {
            return { ...state, isResponseModalOpen: action.payload };
        },
        setLoadingForApi: (state, action: PayloadAction<boolean>) => {
            return { ...state, loadingForApi: action.payload };
        },
        setAuthScreenModal: (state, action: PayloadAction<boolean>) => {
            return { ...state, authScreenModal: action.payload };
        },
        setConfirmSendModal: (state, action: PayloadAction<boolean>) => {
            return { ...state, confirmSendModal: action.payload };
        },
        setIsAuthorizedForSigning: (state, action: PayloadAction<boolean>) => {
            return { ...state, isAuthorizedForSigning: action.payload };
        },
        setDerivedAccountModal: (state, action: PayloadAction<boolean>) => {
            return { ...state, derivedAccountModal: action.payload };
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setMainTextForSuccessModal,
    setSubTextForSuccessModal,
    setIsResponseModalOpen,
    setLoadingForApi,
    setAuthScreenModal,
    setIsAuthorizedForSigning,
    setConfirmSendModal,
    setResponseImage,
    setDerivedAccountModal,
} = modalHandling.actions;

export default modalHandling.reducer;
