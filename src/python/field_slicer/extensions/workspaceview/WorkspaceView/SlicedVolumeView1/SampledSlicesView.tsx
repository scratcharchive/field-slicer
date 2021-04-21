import React, { FunctionComponent, useMemo, useState } from 'react';
import { SampledSlice } from '../../../pluginInterface/FieldModel';
import SampledSliceView from './SampledSliceView';
import SliceSlider from './SliceSlider';
import ComponentSelector from './ComponentSelector'
import BrightnessSlider from './BrightnessSlider';

type Props = {
    sampledSlices: SampledSlice[] | undefined
}

const SampledSlicesView: FunctionComponent<Props> = ({sampledSlices}) => {
    const [currentSliceIndex, setCurrentSliceIndex] = useState<number | undefined>(undefined)
    const numSlices = sampledSlices ? sampledSlices.length : 0

    const {N1, N2}  = useMemo(() => {
        const N1 = sampledSlices ? sampledSlices[0].data.length : 0
        const N2 = sampledSlices ? sampledSlices[0].data[0].length : 0
        return {N1, N2}
    }, [sampledSlices])

    const valueRange = useMemo(() => {
        const range = {min: 0, max: 0}
        let first = true
        for (let sampledSlice of (sampledSlices || [])) {
            for (let i = 0; i < sampledSlice.data.length; i++) {
                for (let j = 0; j < sampledSlice.data[i].length; j++) {
                    for (let c = 0; c < sampledSlice.data[i][j].length; c++) {
                        const v = sampledSlice.data[i][j][c]
                        range.min = first ? v : Math.min(range.min, v)
                        range.max = first ? v : Math.max(range.max, v)
                        first = false
                    }
                }
            }
        }
        return range
    }, [sampledSlices])

    const [currentComponent, setCurrentComponent] = useState<string | undefined>(undefined)
    const [brightness, setBrightness] = useState<number>(50)

    const width = 300

    const defaultSliceIndex = sampledSlices ? Math.floor(sampledSlices.length / 2) : 0

    const defaultComponent = sampledSlices ? sampledSlices[currentSliceIndex || defaultSliceIndex].components[0] : ''

    const valueRangeAdjusted = useMemo(() => {
        const factor = Math.exp((brightness - 50) / 50 * 4)
        return {
            min: valueRange.min / factor,
            max: valueRange.max / factor
        }
    }, [valueRange, brightness])

    return (
        <div style={{margin: 30}}>
            <SampledSliceView
                width={width}
                height={300}
                sampledSlice={sampledSlices ? sampledSlices[currentSliceIndex || defaultSliceIndex] : undefined}
                component={ currentComponent || defaultComponent}
                valueRange={valueRangeAdjusted}
            />
            <SliceSlider
                width={width}
                numSlices={numSlices}
                currentSlice={currentSliceIndex || defaultSliceIndex}
                onCurrentSliceChanged={setCurrentSliceIndex}
            />
            <ComponentSelector
                components={sampledSlices ? sampledSlices[currentSliceIndex || defaultSliceIndex].components : []}
                currentComponent={currentComponent}
                onCurrentComponentChanged={setCurrentComponent}
            />
            <BrightnessSlider
                width={width}
                brightness={brightness}
                onBrightnessChanged={setBrightness}
            />
            <div>
                {
                    sampledSlices ? (
                        <pre>
                            {sampledSlices?.length} sampled slices ({N1} x {N2})<br />
                            Current slice index: {currentSliceIndex}<br />
                            {sampledSlices[currentSliceIndex || defaultSliceIndex].data.length}
                        </pre>
                    ) : <span />
                }
            </div>
        </div>
    )
}

export default SampledSlicesView