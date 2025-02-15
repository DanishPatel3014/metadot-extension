/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import Button from '../../button';
import {
  CloseIconDiv,
  MainText1,
  MainText2,
  SubText2,
  VerticalContentDiv,
  MainLinks,
} from './StyledComponent';
import ManifestFile from '../../../getManifestFile.json';
import { fonts } from '../../../utils';
import { setAuthScreenModal, setConfirmSendModal } from '../../../redux/slices/modalHandling';
import logo from '../../../assets/images/logo.svg';
import './StyledComponent/style.css';

const { mainHeadingfontFamilyClass, subHeadingfontFamilyClass } = fonts;

function About({
  open, handleClose, style,
}) {
  const [jsonData, setJsonData] = React.useState({});
  useEffect(() => {
    const fetchJSON = async () => {
      const response = await fetch(ManifestFile.mainfest_file,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      const json = await response.json();
      console.log('asdasdasdasda-------', json.version);
      setJsonData(json.version);
      return json.version;
    };

    fetchJSON();
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      id="modal"
    >
      <Box id="box" sx={style} className="txDetails-modal-style">
        <CloseIconDiv
          id="close-icon"
          onClick={() => {
            handleClose();
          }}
        >
          <CloseIcon />
        </CloseIconDiv>
        <VerticalContentDiv marginTop="30px">
          <MainText1 textAlign="center" className={mainHeadingfontFamilyClass}>About Metadot Wallet</MainText1>
          <div>
            <img src={logo} alt="logo" height="50" />
          </div>
          <MainText2 textAlign="start" marginTop="25px" className={mainHeadingfontFamilyClass}>
            Version:
            {' '}
            {jsonData}
          </MainText2>
          <SubText2 textAlign="start" marginTop="15px" className={subHeadingfontFamilyClass}>
            Metadot is built for Polkadot, committed to
            providing an easy‑to‑use and one‑stop compatible framework.
          </SubText2>
          <MainLinks>
            <Link to="/" className={subHeadingfontFamilyClass}>Privacy Policy</Link>
            <Link to="/" className={subHeadingfontFamilyClass}>Terms of Use</Link>
          </MainLinks>
        </VerticalContentDiv>

      </Box>
    </Modal>
  );
}

export default About;
