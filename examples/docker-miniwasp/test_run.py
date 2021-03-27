import os
import numpy as np
import hither2 as hi2
import kachery_p2p as kp
import field_slicer as fs
from test1.generate_miniwasp_fields import generate_miniwasp_fields

if __name__ == '__main__':
    # a = test1()
    w = fs.load_workspace()
    thisdir = os.path.dirname(os.path.realpath(__file__))
    image = hi2.LocalDockerImage(name='miniwasp', dockerfile=f'{thisdir}/Dockerfile')
    a = hi2.run_function_in_container_with_kachery_support(function=generate_miniwasp_fields, image=image, kwargs={})
    H = kp.load_npy(a['H'])
    E = kp.load_npy(a['E'])

    print('------- H in test_run', H.dtype, H[0, 0, 0, 0])
    print('------- E in test_run', E.dtype, E[0, 0, 0, 0])

    [nc, N1, N2, N3] = H.shape
    transformation = np.array([
        [1/N1, 0, 0, 0],
        [0, 1/N2, 0, 0],
        [0, 0, 1/N3, 0]
    ])
    f = fs.FieldModel(label='miniwasp-H', data=H, components=['x', 'y', 'z'], transformation=transformation)
    w.add_field_model(f)
    f = fs.FieldModel(label='miniwasp-E', data=E, components=['x', 'y', 'z'], transformation=transformation)
    w.add_field_model(f)