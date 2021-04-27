# field-slicer

View 3D surfaces and slices of 3D vector fields

## Installation and basic usage

[Installation and basic usage](./doc/start-web-server.md)

## Generating the miniwasp test data

1. Install the package as above
1. Install docker
1. Clone this repository: `git clone https://github.com/flatironinstitute/field-slicer`


Run the example:
```bash
cd examples
python test_miniwasp.py
```

This will create a few .vtk files (e.g., surf.vtk, surfx.vtk, ...)

You can open these in [paraview](./doc/paraview-installation.md), for example:

```bash
paraview surf.vtk
# Then in the GUI, click the eye icon next to surf.vtk
```