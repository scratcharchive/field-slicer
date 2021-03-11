import { useHitherJob } from 'labbox'
import { inv, matrix, Matrix, multiply } from 'mathjs'
export type Point3 = [number, number, number]
export type Vector3 = [number, number, number]
export type Vector4 = [number, number, number, number]
export type Matrix44 = [Vector4, Vector4, Vector4, Vector4]

export const identityMatrix44: Matrix44 = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
]

export type FieldModel = {
    fieldModelId: string
    fieldModelLabel: string
    transformation: Matrix44 // Maps [0,1]^3 into the bounding box
    components: string[]
    dataUri: string // offers the ability to sample the cube
}

export type Slice = {
    transformation: Matrix44 // includes thickness
    nx: number
    ny: number
}

export const createSlice = (a: {center: Point3, dx: Vector3, dy: Vector3, nx: number, ny: number}): Slice => {
    // (0.5, 0.5, 0.5) => (center - dx * nx/2 - dy * ny/2)
    const { center, dx, dy, nx, ny } = a
    const transformation: Matrix44 = [
        [dx[0], dy[0], 0, center[0] - 0.5 * nx * dx[0] - 0.5 * ny * dy[0]],
        [dx[1], dy[1], 0, center[1] - 0.5 * nx * dx[1] - 0.5 * ny * dy[1]],
        [dx[2], dy[2], 0, center[2] - 0.5 * nx * dx[2] - 0.5 * ny * dy[2]],
        [0, 0, 0, 1],
    ]
    return {
        transformation,
        nx,
        ny
    }
}

export type SampledSlice = {
    slice: Slice
    components: string[]
    data: (number[][])[]
}

const matrixToMatrix44 = (m: Matrix): Matrix44 => {
    return [
        [m.get([0, 0]), m.get([0, 1]), m.get([0, 2]), m.get([0, 3])],
        [m.get([1, 0]), m.get([1, 1]), m.get([1, 2]), m.get([1, 3])],
        [m.get([2, 0]), m.get([2, 1]), m.get([2, 2]), m.get([2, 3])],
        [m.get([3, 0]), m.get([3, 1]), m.get([3, 2]), m.get([3, 3])]
    ]
}

const multMatrix44 = (A: Matrix44, B: Matrix44): Matrix44 => {
    const ret = multiply(matrix(A), matrix(B))
    return matrixToMatrix44(ret)
}

const invMatrix44 = (A: Matrix44): Matrix44 => {
    const ret = inv(matrix(A))
    return matrixToMatrix44(ret)
}

const createZeros1 = (n1: number): number[] => {
    const ret: number[] = []
    for (let i1=0; i1<n1; i1++) {
        ret.push(0)
    }
    return ret
}

const createZeros2 = (n1: number, n2: number): number[][] => {
    const ret: number[][] = []
    for (let i1=0; i1<n1; i1++) {
        ret.push(createZeros1(n2))
    }
    return ret
}

const createZeros3 = (n1: number, n2: number, n3: number): number[][][] => {
    const ret: number[][][] = []
    for (let i1=0; i1<n1; i1++) {
        ret.push(createZeros2(n2, n3))
    }
    return ret
}

const useSampleDataObjectSlices = (dataUri: string, slices: Slice[], componentIndices: number[]): ((number[][])[])[] | undefined => {
    // todo
    const {result, job} = useHitherJob('createjob_sample_data_object_slices', {data_uri: dataUri, slices: slices, component_indices: componentIndices}, {useClientCache: true})
    return result ? result as number[][][][] : undefined
}

export const useSampledSlices = (fieldModel: FieldModel, slices: Slice[], components: string[]): SampledSlice[] | undefined => {
    const slicesTransformed = slices.map(s => ({
        ...s,
        transformation: multMatrix44(invMatrix44(fieldModel.transformation), s.transformation) // coordinates -> space -> coordinates
    }))
    const componentIndices = components.map(c => (fieldModel.components.indexOf(c)))
    const sliceData: (number[][][])[] | undefined = useSampleDataObjectSlices(fieldModel.dataUri, slicesTransformed, componentIndices)
    const sampledSlices: SampledSlice[] | undefined = sliceData ? (
        slices.map((s, ii) => ({
            slice: s,
            components,
            data: sliceData[ii]
        }))
    ) : undefined
    return sampledSlices
}

export default FieldModel