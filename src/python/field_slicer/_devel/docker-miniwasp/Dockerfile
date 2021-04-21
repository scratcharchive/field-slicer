FROM ubuntu:18.04

#########################################
### Python                                                               
RUN apt update && apt -y install git wget build-essential
RUN apt install -y python3 python3-pip
RUN ln -s python3 /usr/bin/python
RUN ln -s pip3 /usr/bin/pip
RUN DEBIAN_FRONTEND=noninteractive apt install -y python3-tk

#########################################
### Numpy
RUN pip install numpy

#########################################
### Make sure we have python3 and a working locale
RUN rm /usr/bin/python && ln -s python3 /usr/bin/python && rm /usr/bin/pip && ln -s pip3 /usr/bin/pip
ENV LANG='en_US.UTF-8' LANGUAGE='en_US:en' LC_ALL='en_US.UTF-8'
RUN apt install -y locales && locale-gen en_US.UTF-8

#########################################
### gfortran
RUN apt update && apt install -y gfortran

#########################################
RUN mkdir /home/root
ENV HOME=/home/root
ENV LD_LIBRARY_PATH=$HOME/lib
RUN mkdir /repos

# lapack, blas
RUN apt update && apt install -y liblapack-dev libopenblas-dev

# python dependencies for hither
RUN pip install click simplejson requests

# FMM3D - 4/21/21
RUN git clone https://github.com/flatironinstitute/FMM3D /repos/FMM3D \
    && cd /repos/FMM3D \
    && git checkout f2bbe71529d25441d805f3246860411a9a97b3c0 \
    && make install
RUN cd /repos/FMM3D && make python

# fmm3dbie - 4/21/21
RUN git clone https://gitlab.com/fastalgorithms/fmm3dbie /repos/fmm3dbie \
    && cd /repos/fmm3dbie \
    && git checkout 8f8179f3c1949d48e2b2ac1962f76a111e554b9b \
    && make install
RUN cd /repos/fmm3dbie && make python

# miniwasp - 4/21/21
RUN git clone https://github.com/mrachh/miniwasp /repos/miniwasp \
    && cd /repos/miniwasp \
    && git checkout b133c681d2216ab526fc3f768ee8e21c97995613 \
    && make python

LABEL version="0.1.0"