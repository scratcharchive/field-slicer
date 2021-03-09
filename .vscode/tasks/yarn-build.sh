# This file was automatically generated. Do not edit directly. See devel/templates.

#!/bin/bash

set -ex

yarn install
yarn build
rm -rf src/python/field_slicer/build
cp -r build src/python/field_slicer/
