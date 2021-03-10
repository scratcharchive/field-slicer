import React, { FunctionComponent, useMemo, useState } from 'react';
import { SampledSlice } from '../../../pluginInterface/FieldModel';
import SampledSliceView from './SampledSliceView';
import SliceSlider from './SliceSlider';

type Props = {
    sampledSlices: SampledSlice[] | undefined
}

const SampledSlicesView: FunctionComponent<Props> = ({sampledSlices}) => {
    const [currentSliceIndex, setCurrentSliceIndex] = useState(0)
    const numSlices = sampledSlices ? sampledSlices.length : 0
    const valueRange = useMemo(() => {
        const range = {min: 0, max: 0}
        let first = true
        for (let sampledSlice of (sampledSlices || [])) {
            for (let i = 0; i < sampledSlice.data.length; i++) {
                for (let j = 0; j < sampledSlice.data[i].length; j++) {
                    const v = sampledSlice.data[i][j][0]
                    range.min = first ? v : Math.min(range.min, v)
                    range.max = first ? v : Math.max(range.max, v)
                    first = false
                }
            }
        }
        return range
    }, [sampledSlices])

    const width = 300

    return (
        <div style={{margin: 30}}>
            <SampledSliceView
                width={width}
                height={300}
                sampledSlice={sampledSlices ? sampledSlices[currentSliceIndex] : undefined}
                valueRange={valueRange}
            />
            <SliceSlider
                width={width}
                numSlices={numSlices}
                currentSlice={currentSliceIndex}
                onCurrentSliceChanged={setCurrentSliceIndex}
            />
        </div>
    )
}

export default SampledSlicesView