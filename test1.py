#!/usr/bin/env python3

import numpy as np
import field_slicer as fs

def main():
    w = fs.load_workspace()
    print(w.get_field_models())
    N1, N2, N3 = (100, 100, 30)
    data = np.zeros((3, N1, N2, N3), dtype=np.float32)
    for i1 in range(N1):
        for i2 in range(N2):
            for i3 in range(N3):
                xx = i1 / N1
                yy = i2 / N2
                zz = i3 / N3
                rxy = np.sqrt((xx-0.5)**2 + (yy-0.5)**2) / 0.5
                rr = np.sqrt((xx-0.5)**2 + (yy-0.5)**2 + (zz-0.5)**2) / 0.5
                data[:, i1, i2, i3] = np.cos(xx * 12) - np.sin(yy * zz * 50) + 10 / (1 + (rxy/2)*10) + rr**2
                # data[:, i1, i2, i3] = np.cos(xx * zz * 120) - np.sin(yy * zz * 50) + 10 / (1 + (rxy/2)*10) + rr**2
    transformation = np.array([
        [1/N1, 0, 0, 0],
        [0, 1/N2, 0, 0],
        [0, 0, 1/N3, 0],
        [0, 0, 0, 1],
    ])
    f = fs.FieldModel(label='new test', data=data, components=['x', 'y', 'z'], transformation=transformation)
    w.add_field_model(f)
    print(w.get_field_models())

if __name__ == '__main__':
    main()