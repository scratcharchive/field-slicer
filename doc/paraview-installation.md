# Paraview installation

## On linux

Go to the paraview downloads page: https://www.paraview.org/download/ and download the most recent .tar.gz file for Linux. Extract this to a directory on your computer, for example in your home directory:

```bash
~/ParaView-5.9.0-MPI-Linux-Python3.8-64bit
```

Now add the paraview bin directory to your bath (this can go in your `.bashrc`):

```bash
# make sure you fill in the correct path
export PATH=$HOME/<ParaView-path>/bin:$PATH
```

Verify that it is installed properly:

```bash
paraview --version
```