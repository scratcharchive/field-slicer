import codecs
import os.path

import setuptools

setuptools.setup(
    name='field-slicer',
    version='0.1.8',
    author='Jeremy Magland',
    author_email="jmagland@flatironinstitute.org",
    description="",
    url="https://github.com/flatironinstitute/field-slicer",
    packages=setuptools.find_packages(),
    include_package_data=True,
    scripts=[
        "bin/field-slicer",
        "bin/field-slicer-services"
    ],
    install_requires=[
        'numpy',
        'scipy',
        'labbox==0.1.22'
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ]
)
