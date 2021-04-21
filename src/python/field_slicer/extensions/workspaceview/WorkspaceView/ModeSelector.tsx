import Slider from '@material-ui/core/Slider';
import React, { FunctionComponent, useCallback } from 'react';
import RadioChoices from './SlicedVolumeView1/RadioChoices';

function valuetext(value: number) {
  return `Slice ${value}`;
}

type Props = {
  currentMode: 'real' | 'imag' | 'abs'
  onCurrentModeChanged: (mode: 'real' | 'imag' | 'abs') => void
}

const ModeSelector: FunctionComponent<Props> = ({ currentMode, onCurrentModeChanged }) => {

  const handleSetValue = useCallback((v: string) => {
      onCurrentModeChanged(v as ('real' | 'imag' | 'abs'))
  }, [onCurrentModeChanged])

  return (
    <div>
      <RadioChoices
        label=""
        value={currentMode}
        onSetValue={handleSetValue}
        options={
          ['real', 'imag', 'abs'].map(m => ({
            label: m,
            value: m,
            disabled: false
          }))
        }
      />
    </div>
  );
}

export default ModeSelector