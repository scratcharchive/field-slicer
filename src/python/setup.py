import setuptools

setuptools.setup(
    packages=setuptools.find_packages(),
    include_package_data=True,
    scripts=[
        "bin/field-slicer",
        "bin/field-slicer-services"
    ],
    install_requires=[
        'numpy',
        'scipy',
        'labbox>=0.1.35'
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
    ]
)
