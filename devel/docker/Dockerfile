FROM continuumio/miniconda3

WORKDIR /app

# Create the environment:
RUN conda create -n myenv python=3.8

# Make RUN commands use the new environment:
SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]

RUN conda install -c conda-forge nodejs
RUN npm install -g serve

COPY ./dist/field-slicer-0.1.9.tar.gz /field-slicer-0.1.9.tar.gz
RUN pip install /field-slicer-0.1.9.tar.gz

# Make sure the environment is activated and field-slicer is installed
RUN echo "Make sure field-slicer is installed:"
RUN python -c "import field_slicer"

ENV PYTHONUNBUFFERED=1
COPY ./inside_container/entrypoint.sh /entrypoint.sh
COPY ./inside_container/run.sh /run.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/run.sh"]