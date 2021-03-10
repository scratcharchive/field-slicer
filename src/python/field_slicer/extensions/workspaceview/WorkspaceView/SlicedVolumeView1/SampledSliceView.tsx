import React, { FunctionComponent } from 'react';
import CanvasWidget from '../../../common/CanvasWidget';
import { useLayer, useLayers } from '../../../common/CanvasWidget/CanvasWidgetLayer';
import { SampledSlice } from '../../../pluginInterface/FieldModel';
import { createMainLayer, MainLayerProps } from './mainLayer';

type Props = {
    width: number
    height: number
    sampledSlice: SampledSlice | undefined
    valueRange: {min: number, max: number}
}

const SampledSliceView: FunctionComponent<Props> = ({width, height, sampledSlice, valueRange}) => {
    const mainLayerProps: MainLayerProps = {
        width: 300,
        height: 300,
        sampledSlice: sampledSlice,
        valueRange: valueRange
    }
    const mainLayer = useLayer(createMainLayer, mainLayerProps)
    const layers = useLayers([mainLayer])

    return (
        <CanvasWidget
            layers={layers}
            width={300}
            height={300}
        />
    )
}

export default SampledSliceView