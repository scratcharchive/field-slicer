#!/usr/bin/env python3

from typing import cast
import numpy as np
import field_slicer as fs
from field_slicer._devel.miniwasp_hither import miniwasp_hither
from field_slicer._devel.example4_hither import example4_hither
import hither2 as hi
import kachery_p2p as kp
# from generate_miniwasp_fields import generate_miniwasp_fields

def test1():
    import kachery_p2p as kp

    w = fs.load_workspace()
    print(w.get_uri())
    
    geom_uri = 'sha1://fce1fb4c8637a36edb34669e1ac612700ce7151e/lens_r01.go3'
    job_cache = hi.JobCache(feed_name='job-cache')
    with hi.Config(use_container=True, show_console=True, job_cache=None):
        j: hi.Job = miniwasp_hither.run(geom_uri=geom_uri, omega=3.141592*2/330.0, ppw=50)
        H, E = j.wait().return_value
        H = cast(np.ndarray, H)
        E = cast(np.ndarray, E)
    
    print(H.shape, E.shape)

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

def example4():
    import kachery_p2p as kp
    geom_uri = 'sha1://fce1fb4c8637a36edb34669e1ac612700ce7151e/lens_r01.go3'
    job_cache = hi.JobCache(feed_name='job-cache')
    with hi.Config(use_container=True, show_console=True, job_cache=None):
        j: hi.Job = example4_hither.run(geom_uri=geom_uri, omega=3.141592*2/330.0, ppw=50)
        x = j.wait().return_value
        return x

def main():
    x = example4()
    for k, v in x.items():
        fname = f'{k}.vtk'
        print(f'Writing {fname} ({x[k]})')
        kp.load_file(x[k], dest=fname)
    

    

if __name__ == '__main__':
    main()