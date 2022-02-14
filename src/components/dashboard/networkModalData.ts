import yellow from '../../assets/images/tokenImg/yellow.png';
import kusamaKsm from '../../assets/images/tokenImg/kusama-ksm.svg';
import constants from '../../constants/onchain';
import { NetworkConfigType } from './types';

const {
    POLKADOT_CONFIG,
    KUSAMA_CONFIG,
    KHALA_CONFIG,
    BIFROST_CONFIG,
    MOONRIVER_CONFIG,
    SHIDEN_CONFIG,
    KARURA_CONFIG,
    WESTEND_CONFIG,
    ASTAR_CONFIG,
    SHIBUYA_CONFIG,
    BITCOUNTRY_CONFIG,
} = constants;

const availableNetworks: NetworkConfigType[] = [
    {
        name: 'Polkadot Main Network',
        theme: POLKADOT_CONFIG.LOGO,
        moreOptions: false,
        rpcUrl: POLKADOT_CONFIG.RPC_URL,
        prefix: POLKADOT_CONFIG.PREFIX,
        disabled: true,
    },
    {
        name: 'Kusama Main Networks',
        theme: kusamaKsm,
        moreOptions: true,
        rpcUrl: KUSAMA_CONFIG.RPC_URL,
        icon: KUSAMA_CONFIG.LOGO,
        parachain: false,
        mainNetwork: true,
        testNet: null,
        disabled: true,
        prefix: KUSAMA_CONFIG.PREFIX,
    },
    {
        name: 'Test Networks',
        theme: yellow,
        moreOptions: true,
    },

    // Will use this setting in future
    // {
    //   name: 'Beta Networks',
    //   theme: green,
    //   moreOptions: true,
    //   rpcUrl: ASTAR_CONFIG.RPC_URL,
    //   icon: ASTAR_CONFIG.LOGO,
    //   parachain: false,
    //   mainNetwork: true,
    //   testNet: null,
    //   disabled: false,
    // },
];

const BetaNetworks = [
    {
        name: 'Astar',
        icon: ASTAR_CONFIG.LOGO,
        parachain: false,
        mainNetwork: true,
        testNet: null,
        rpcUrl: ASTAR_CONFIG.RPC_URL,
        disabled: false,
        tokenName: 'SDN',
        prefix: ASTAR_CONFIG.PREFIX,
    },
];

const KusamaMainNetworks: NetworkConfigType[] = [
    {
        name: KUSAMA_CONFIG.CHAIN_NAME,
        icon: KUSAMA_CONFIG.LOGO,
        parachain: false,
        mainNetwork: true,
        testNet: null,
        rpcUrl: KUSAMA_CONFIG.RPC_URL,
        disabled: false,
        tokenName: KUSAMA_CONFIG.TOKEN_NAME,
        prefix: KUSAMA_CONFIG.PREFIX,
    },
    {
        name: KARURA_CONFIG.CHAIN_NAME,
        icon: KARURA_CONFIG.LOGO,
        rpcUrl: KARURA_CONFIG.RPC_URL,
        parachain: true,
        mainNetwork: true,
        testNet: 'AcalaMandala',
        disabled: false,
        prefix: KARURA_CONFIG.PREFIX,
    },
    {
        name: MOONRIVER_CONFIG.CHAIN_NAME,
        icon: MOONRIVER_CONFIG.LOGO,
        parachain: true,
        mainNetwork: true,
        disabled: true,
    },
    {
        name: SHIDEN_CONFIG.CHAIN_NAME,
        icon: SHIDEN_CONFIG.LOGO,
        parachain: true,
        mainNetwork: true,
        testNet: 'Dusty',
        disabled: true,
    },
    {
        name: KHALA_CONFIG.CHAIN_NAME,
        icon: KHALA_CONFIG.LOGO,
        parachain: true,
        mainNetwork: true,
        testNet: 'Phala',
        disabled: true,
    },
    {
        name: BIFROST_CONFIG.CHAIN_NAME,
        icon: BIFROST_CONFIG.LOGO,
        parachain: false,
        mainNetwork: true,
        testNet: 'Asgard',
        disabled: true,
    },
];

const TestNetworks: NetworkConfigType[] = [
    {
        name: WESTEND_CONFIG.CHAIN_NAME,
        theme: WESTEND_CONFIG.LOGO,
        rpcUrl: WESTEND_CONFIG.RPC_URL,
        tokenName: WESTEND_CONFIG.TOKEN_NAME,
        prefix: WESTEND_CONFIG.PREFIX,
    },
    // {
    //   name: ROCOCO_CONFIG.CHAIN_NAME,
    //   theme: ROCOCO_CONFIG.LOGO,
    //   rpcUrl: ROCOCO_CONFIG.RPC_URL,
    //   tokenName: ROCOCO_CONFIG.TOKEN_NAME,
    //   prefix: ROCOCO_CONFIG.PREFIX,
    //   // disabled: false,
    // },
    {
        name: BITCOUNTRY_CONFIG.CHAIN_NAME,
        theme: BITCOUNTRY_CONFIG.LOGO,
        rpcUrl: BITCOUNTRY_CONFIG.RPC_URL,
        tokenName: BITCOUNTRY_CONFIG.TOKEN_NAME,
        prefix: 42,
    },
    {
        name: SHIBUYA_CONFIG.CHAIN_NAME,
        theme: SHIBUYA_CONFIG.LOGO,
        rpcUrl: SHIBUYA_CONFIG.RPC_URL,
        tokenName: SHIBUYA_CONFIG.TOKEN_NAME,
        prefix: SHIBUYA_CONFIG.PREFIX,
    },

    // will use the following settings in future
    // {
    //   name: ACALA_MANDALA_CONFIG.CHAIN_NAME,
    //   theme: ACALA_MANDALA_CONFIG.LOGO,
    //   rpcUrl: ACALA_MANDALA_CONFIG.RPC_URL,
    //   tokenName: ACALA_MANDALA_CONFIG.TOKEN_NAME,
    //   prefix: ACALA_MANDALA_CONFIG.PREFIX,
    // },
    // {
    //   name: DUSTY_CONFIG.CHAIN_NAME,
    //   theme: DUSTY_CONFIG.LOGO,
    //   disabled: false,
    //   rpcUrl: DUSTY_CONFIG.RPC_URL,
    //   tokenName: DUSTY_CONFIG.TOKEN_NAME,
    //   prefix: ACALA_MANDALA_CONFIG.PREFIX,
    // },
    // {
    //   name: MOONBASE_CONFIG.CHAIN_NAME,
    //   theme: MOONBASE_CONFIG.LOGO,
    //   disabled: true,
    // },
    // {
    //   name: ASGARD_CONFIG.CHAIN_NAME,
    //   theme: ASGARD_CONFIG.LOGO,
    //   disabled: true,
    // },
    // {
    //   name: PHALA_CONFIG.CHAIN_NAME,
    //   theme: PHALA_CONFIG.LOGO,
    //   disabled: true,
    //   rpcUrl: PHALA_CONFIG.RPC_URL,
    //   tokenName: PHALA_CONFIG.TOKEN_NAME,
    // },
];

export default {
    availableNetworks,
    KusamaMainNetworks,
    TestNetworks,
    BetaNetworks,
};
