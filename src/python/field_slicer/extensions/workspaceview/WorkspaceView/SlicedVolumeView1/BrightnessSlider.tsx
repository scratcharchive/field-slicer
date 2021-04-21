
import Slider from '@material-ui/core/Slider';
import React, { FunctionComponent, useCallback } from 'react';

function valuetext(value: number) {
  return `Brightness ${value}`;
}

type Props = {
  width: number
  brightness: number
  onBrightnessChanged: (x: number) => void
}

const BrightnessSlider: FunctionComponent<Props> = ({ brightness, onBrightnessChanged, width }) => {

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, value: number | number[]) => {
      onBrightnessChanged(value as any as number)
    },
    [onBrightnessChanged],
  )

  return (
    <div style={{width}}>
      <Slider
        value={brightness}
        onChange={handleChange}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={100}
      />
    </div>
  );
}

export default BrightnessSlider