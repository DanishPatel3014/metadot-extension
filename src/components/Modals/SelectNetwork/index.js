import React from 'react';
import { Modal } from '@mui/material';
import { Box } from '@mui/system';

import CloseIcon from '@mui/icons-material/Close';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import { fonts } from '../../../utils';

import {
  BackButton,
  CloseIconDiv,
  Title,
  TitleDiv,
} from './StyledComponents';

const { mainHeadingfontFamilyClass } = fonts;

function SelectNetwork(props) {
  const {
    open, handleClose, modalState, resetState, style, handleClickForKusama, handleClickForOthers,
  } = props;
  const { firstStep, renderMethod, currentData } = modalState;
  console.log({ firstStep, renderMethod, currentData });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="select-network-modal-style">
        <CloseIconDiv
          onClick={() => {
            resetState();
            handleClose();
          }}
        >
          <CloseIcon />
        </CloseIconDiv>

        <TitleDiv>
          {!modalState.firstStep && (
            <BackButton
              onClick={() => {
                // setSelectedNetwrok('');
                resetState();
              }}
            >
              <KeyboardArrowLeftIcon />
            </BackButton>
          )}

          <Title className={mainHeadingfontFamilyClass}>
            Available Networks
          </Title>
        </TitleDiv>

        {modalState.currentData.map((data) => {
          const Content = data.name !== 'Polkadot Network' ? modalState.renderMethod(data, handleClickForOthers) : modalState.renderMethod(data, handleClickForKusama);
          return Content;
        })}
      </Box>
    </Modal>
  );
}

export default SelectNetwork;
