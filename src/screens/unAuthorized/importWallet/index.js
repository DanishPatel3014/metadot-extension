/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-throw-literal */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@material-ui/core';

import {
  Option, OptionDiv, UploadFile, FileChosen, UploadFileDiv,
} from './styledComponents';
import {
  AuthWrapper,
  Header,
  Button,
  MainHeading,
  SubHeading,
  SubMainWrapperForAuthScreens,
  WarningText,
} from '../../../components';
import CustomUploadFile from './customUploadFile';
import { fonts, colors } from '../../../utils';
import accounts from '../../../utils/accounts';
import { setSeed } from '../../../redux/slices/activeAccount';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;
const { primaryText, darkBackground1 } = colors;
const {
  decrypt, encrypt, KeyringInitialization, validatingSeedPhrase,
} = accounts;

const invalidSeedMessages = {
  minimumWords: 'At least 12 words required!',
  maxWords: 'Only 12 words required!',
  seedDoesnotExist: 'Seed does not exists!',
};

function ImportWallet() {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts);

  console.log('ahsanahmed ==>>', params);

  const [selectedType, setSelectedType] = useState('seed');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [invalidSeedMessage, setInvalidSeedMessage] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const dSeed = decrypt(params.seed, 'Dell1234');
    let derivedSeed = '';
    let i = 0;
    do {
      derivedSeed = `${dSeed}//${i}`;
      i += 1;
      console.log('some very serious testing', accounts, encrypt(derivedSeed, '123'), accounts[encrypt(derivedSeed, 'Dell1234')]);
    } while (accounts[encrypt(derivedSeed, '123')]);
    setSeedPhrase(derivedSeed);
  }, [accounts, params, password]);

  const handleChange = (input) => {
    setInvalidSeedMessage('');
    setSeedPhrase(input);
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  const validateSeed = async () => {
    const { minimumWords, maxWords, seedDoesnotExist } = invalidSeedMessages;

    let isErrorOccur = '';

    try {
      if (seedPhrase.split(' ').length > 12) {
        isErrorOccur = maxWords;
        setInvalidSeedMessage(maxWords);
        return maxWords;
      }

      if (seedPhrase.split(' ').length < 12) {
        isErrorOccur = minimumWords;
        setInvalidSeedMessage(minimumWords);
        return minimumWords;
      }
      await KeyringInitialization();
      const res = validatingSeedPhrase(seedPhrase);
      res
        .then((r) => {
          console.log('r value', r);
          if (r) {
            console.log('r in if ');
            const tmpPassword = '123';
            const encryptedSeed = encrypt(seedPhrase, tmpPassword);
            dispatch(setSeed(encryptedSeed));
            console.log('Hi there going to create wallet');
            history.push('/createWallet');
          } else if (!isErrorOccur) {
            console.log('r in else if ');
            setInvalidSeedMessage(seedDoesnotExist);
          }
        }).catch((e) => console.log('err', e));

      return true;
    } catch (err) {
      console.log('error in import wallet', err);
      const res = validatingSeedPhrase(seedPhrase);
      res
        .then((r) => {
          console.log('r value', r);
          if (r) {
            console.log('r in if ');
            const tmpPassword = '123';
            const encryptedSeed = encrypt(seedPhrase, tmpPassword);

            dispatch(setSeed(encryptedSeed));

            console.log('Hi there going to create wallet');
            history.push('/createWallet');
          } else if (!isErrorOccur) {
            console.log('r in else if ');
            setInvalidSeedMessage(seedDoesnotExist);
          }
        }).catch((e) => console.log('err', e));

      return err;
    }
  };

  const downloadSeed = () => {
    const seed = 'seed phrase';
    const data = new Blob([seed], { type: 'text/plain' });
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'seed.txt');
    tempLink.click();
  };

  const mainHeading = {
    marginTop: '29px',
    className: mainHeadingfontFamilyClass,
  };

  const subHeading = {
    marginTop: '12px',
    className: subHeadingfontFamilyClass,
  };

  const selectTypeHeading = {
    className: mainHeadingfontFamilyClass,
    fontWeight: 'bold',
    lineHeight: '21px',
    fontSize: '18px',
  };

  const option1 = {
    id: 'seed-phrase',
    onClick: () => setSelectedType('seed'),
    selected: selectedType === 'seed',
    className: mainHeadingfontFamilyClass,
  };

  const option2 = {
    id: 'upload-file',
    onClick: () => setSelectedType('json'),
    className: mainHeadingfontFamilyClass,
    selected: selectedType === 'json',
  };

  const input = {
    id: 'seed-input',
    style: {
      padding: '13px 15px',
      background: darkBackground1,
      color: primaryText,
      width: '100%',
      borderRadius: '8px',
      fontSize: '0.8rem',
      lineHeight: '1.7em',
      border: '0.5px solid rgba(250, 250, 250, 0.5)',
    },
    className: subHeadingfontFamilyClass,
    onChange: (e) => handleChange(e.target.value.replace(/[^A-Z\s]/ig, '')),
    value: seedPhrase,
    rows: 5,
    placeholder: 'Place your seed here',
  };

  const warningText = {
    className: subHeadingfontFamilyClass,
    visibility: invalidSeedMessage ? 'visible' : 'hidden',
  };

  const btn = {
    id: 'import',
    text: 'Import',
    width: '300px',
    handleClick: validateSeed,
    disabled: seedPhrase.length === 0,
  };

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);
  const [fileName, setFileName] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      console.log(text);
    };
    reader.readAsText(e.target.files[0]);
    setFileName(e.target.files[0]);
    setIsFilePicked(true);
  };

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <AuthWrapper>
      <Header centerText="Import Wallet" backHandler={() => console.log('goBack')} />
      <div>
        <Input onChange={passwordChangeHandler} />
        <MainHeading {...mainHeading}>Restore your wallet : </MainHeading>
        <SubHeading textLightColor {...subHeading}>
          To restore your wallet enter your Seed phrase.
        </SubHeading>
      </div>
      <SubMainWrapperForAuthScreens flexDirection="column" mt="40px">
        {/* following code block is important and will
         use it in upcoming versions of the extension */}

        {/* <MainHeading {...selectTypeHeading}>Select Type : </MainHeading>
        <OptionDiv>
          <Option {...option1}>
            Seed Phrase
          </Option>
          {/* <div className="normalTooltip">
          <Option {...option2}>
            Upload File
            {/* <span className="normalTooltiptext">Coming Soon</span> *
          </Option>

        </OptionDiv> */}
        {selectedType === 'seed' && (
          <div style={{ marginTop: '1rem' }}>
            <Input
              {...input}
              autoFocus
              multiline
              disableUnderline
            />
            <WarningText {...warningText}>{invalidSeedMessage}</WarningText>
          </div>
        )}

        {/* following code block is important and will
         use it in upcoming versions of the extension */}
        {/* {selectedType === 'json' && (
        <>
          <CustomUploadFile />
          <button
            onClick={downloadSeed}
            style={{
              float: 'left',
              marginTop: '1rem',
            }}
          >
            Download Functionality

          </button>
        </>
        )} */}
      </SubMainWrapperForAuthScreens>
      {selectedType === 'seed' && (
        <div style={{ marginLeft: '0' }} className="btn-wrapper">
          <Button {...btn} />
        </div>
      )}
    </AuthWrapper>
  );
}

export default ImportWallet;
