import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React, { FunctionComponent } from 'react';

interface Props {
    label: string
    value: string
    onSetValue: (v: string) => void
    options: {
        label: string
        value: string
        disabled?: boolean
    }[]
}

const RadioChoices: FunctionComponent<Props> = ({ label, value, onSetValue, options }) => {
    return (
        <RadioGroup value={value} onChange={(evt) => onSetValue(evt.target.value)} row>
            {
                options.map(opt => (
                    <FormControlLabel
                        key={opt.label}
                        value={opt.value}
                        control={<Radio />}
                        label={opt.label}
                        disabled={opt.disabled ? true : false}
                    />
                ))
            }
        </RadioGroup>
    );
}

export default RadioChoices;