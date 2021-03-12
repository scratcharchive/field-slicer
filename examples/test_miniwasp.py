#!/usr/bin/env python3

import numpy as np
import field_slicer as fs
from generate_miniwasp_fields import generate_miniwasp_fields

def main():
    w = fs.load_workspace()
    H, E = generate_miniwasp_fields()
    [nc, N1, N2, N3] = H
    transformation = np.array([
        [1/N1, 0, 0, 0],
        [0, 1/N2, 0, 0],
        [0, 0, 1/N3, 0]
    ])
    f = fs.FieldModel(label='miniwasp-H', data=H, components=['x', 'y', 'z'], transformation=transformation)
    w.add_field_model(f)
    f = fs.FieldModel(label='miniwasp-E', data=E, components=['x', 'y', 'z'], transformation=transformation)
    w.add_field_model(f)

if __name__ == '__main__':
    main()