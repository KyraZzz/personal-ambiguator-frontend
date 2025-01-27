import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Step,
    Stepper,
    StepLabel,
    Button,
    Typography,
    makeStyles
  } from '@material-ui/core';
import { alpha, styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';

const steps = ['Stop live updating', 
               'Adjust parameters and evaluate', 
               'Re-adjust parameters'];
const content = ['The machine is updating the scores live from the webcam! Click `EDIT IMAGE` to stop.', 
                 'See how the edits affect the image and then click `EVALUATE` to see how they affect the scores.', 
                 'Click `EDIT IMAGE` to go back to adjusting parameters or `LIVE MODE` to start again.'];

const useStyles = makeStyles((theme) => ({
  step: {
    backgroundColor: alpha('rgb(25, 79, 156)', 0.0),
    marginLeft: 10,
  },
  steplabel: {
    fontFamily: 'monospace',
  },
  steptext: {
    color: '#f8f8f2',
    backgroundColor: alpha('rgb(25, 79, 156)', 0.7),
    fontFamily: 'monospace',
    fontSize: '1.2rem',
    border: '2px solid rgb(25, 79, 156)',
    borderRadius: '5px',
    padding: '5px',
    marginLeft: 35,
  },
  button: {
    color: '#f8f8f2',
    backgroundColor: '#000000',
    fontFamily: 'monospace',
    "&:hover": {
      backgroundColor: '#000000',
    },
    "&:disabled": {
      backgroundColor: '#888888',
    },
    marginBottom: 10,
    marginLeft: 35
  },
  feedback: {
    color: '#000000',
    fontFamily: 'monospace',
  },
}));

const QontoStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: alpha('rgb(25, 79, 156)', 0.2),
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#194f9c',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#4f8467',
    zIndex: 1,
    fontSize: 25,
  },
  '& .QontoStepIcon-circle': {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

const QontoStepIcon = ({ active, completed, className }) => {
  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
};

const HorizontalNonLinearStepper = ({activeStep, setActiveStep, completed, setCompleted}) => {
  const classes = useStyles();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has not been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep} className={classes.step}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]} >
            <StepLabel StepIconComponent={QontoStepIcon} classes={{label: classes.steplabel}}>
              {/*onClick={handleStep(index)}*/}
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === totalSteps() ? (
          <React.Fragment>
            <Typography className={classes.steptext} sx={{ mt: 2, mb: 1 }}>
              You understand how the app works now! Feel free to play around or navigate back to review the instructions.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                className={classes.button}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              {/*
              <Box sx={{ flex: '1 1 auto' }} />
              <Button className={classes.button} onClick={handleReset}>Reset</Button>
              <Box sx={{ flex: '1 1 auto' }} />
              */}
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography className={classes.steptext} sx={{ mt: 2, mb: 1 }}>{content[activeStep]}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2}}>
              <Button
                className={classes.button}
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }}/>
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" className={classes.feedback}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button
                    onClick={handleComplete}
                    className={classes.button}
                    disabled={activeStep === 0 || activeStep === 1}
                  >
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete'}
                  </Button>
                ))}
              <Box sx={{ flex: '1 1 auto' }}/>
              <Button 
                className={classes.button}
                onClick={handleNext}
                disabled={!completed[activeStep] || isLastStep()}
              >
                Next
              </Button>
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}

export default HorizontalNonLinearStepper;
