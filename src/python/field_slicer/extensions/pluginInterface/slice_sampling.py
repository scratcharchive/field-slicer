from typing import List
import numpy as np
import hither2 as hi
import kachery_p2p as kp
from numpy.lib.function_base import meshgrid
from .serialize import serialize

@hi.function(
    'createjob_sample_data_object_slices', '0.1.0',
    register_globally=True
)
def createjob_sample_data_object_slices(labbox, data_uri, slices, component_indices: List[int], mode: str):
    # sample_data_object_slices(data_uri, slices, component_indices)
    with hi.Config(job_cache=labbox.get_job_cache()):
        return sample_data_object_slices.run(
            data_uri=data_uri,
            slices=slices,
            component_indices=component_indices,
            mode=mode
        )

@hi.function('sample_data_object_slices', '0.1.1')
@serialize
def sample_data_object_slices(data_uri, slices, component_indices: List[int], mode: str):
    X = kp.load_npy(data_uri)
    nx = slices[0]['nx']
    ny = slices[0]['ny']
    num_components = len(component_indices)
    ret = []
    for slice in slices:
        A = np.zeros((nx, ny, num_components), dtype=np.float32)
        transformation = np.array(slice['transformation'])
        # print(transformation)
        for ix in range(nx):
            for iy in range(ny):
                p = transformation @ [ix, iy, 0.5, 1]
                x_ind = int(np.floor(p[0]))
                y_ind = int(np.floor(p[1]))
                z_ind = int(np.floor(p[2]))
                # print(f'ix={ix}, nx={nx}, iy={iy}, ny={ny}, p={p}, x_ind={x_ind}, y_ind={y_ind}, z_ind={z_ind}, X.shape={X.shape}, val={X[:, x_ind, y_ind, z_ind]}')
                if (0 <= x_ind) and (x_ind < X.shape[1]) and (0 <= y_ind) and (y_ind < X.shape[2]) and (0 <= z_ind) and (z_ind < X.shape[3]):
                    for c in range(num_components):
                        if mode == 'real':
                            A[ix, iy, c] = np.real(X[component_indices[c], x_ind, y_ind, z_ind])
                        elif mode == 'imag':
                            A[ix, iy, c] = np.imag(X[component_indices[c], x_ind, y_ind, z_ind])
                        elif mode == 'abs':
                            A[ix, iy, c] = np.abs(X[component_indices[c], x_ind, y_ind, z_ind])
                        else:
                            pass
        ret.append(A.tolist())
    # print(ret)
    return ret
    