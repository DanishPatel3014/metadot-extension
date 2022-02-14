import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, Accounts } from '../types';

const initialState: Partial<Accounts> = {
    '5Dz1i42ygyhi4BxPnvKtRY4TBShTMC9T2FvaMB8CWxoU3QgG': {
        publicKey: '5Dz1i42ygyhi4BxPnvKtRY4TBShTMC9T2FvaMB8CWxoU3QgG',
        accountName: 'Ahsan',
    },
};

export const accountsSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        addAccount: (state, action: PayloadAction<Account>) => {
            return {
                ...state,
                [action.payload.publicKey]: action.payload,
            };
        },

        deleteAccount: (state, action: PayloadAction<string>) => {
            const copyState = { ...state };
            delete copyState[action.payload as keyof Accounts];
            return copyState;
        },
    },
});

export const { addAccount, deleteAccount } = accountsSlice.actions;

export default accountsSlice.reducer;