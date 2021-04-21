import Slider from '@material-ui/core/Slider';
import React, { FunctionComponent, useCallback } from 'react';
import RadioChoices from './RadioChoices';

function valuetext(value: number) {
  return `Slice ${value}`;
}

type Props = {
  components: string[]
  currentComponent: string | undefined
  onCurrentComponentChanged: (c: string) => void
}

const ComponentSelector: FunctionComponent<Props> = ({ components, currentComponent, onCurrentComponentChanged }) => {
  return (
    <div>
      <RadioChoices
        label=""
        value={currentComponent || ''}
        onSetValue={onCurrentComponentChanged}
        options={
          components.map(c => ({
            label: c,
            value: c,
            disabled: false
          }))
        }
      />
    </div>
  );
}

export default ComponentSelector