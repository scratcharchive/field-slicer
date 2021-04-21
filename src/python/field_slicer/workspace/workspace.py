import numpy as np
from typing import List, Union
import uuid
import kachery_p2p as kp

def parse_workspace_uri(workspace_uri: str):
    if not workspace_uri.startswith('workspace://'):
        raise Exception(f'Invalid workspace uri: {workspace_uri}')
    a = workspace_uri.split('/')
    return a[2], a[3]

class FieldModel:
    def __init__(self, *, label: str, transformation=np.eye(4, 4), data: np.ndarray, components: List[str]):
        if (len(components) != data.shape[0]):
            raise Exception('Incorrect number of components')
        self._label = label
        self._transformation = transformation
        self._data = data
        self._components = components
    @property
    def label(self):
        return self._label
    @property
    def transformation(self):
        return self._transformation
    def get_data_uri(self):
        return kp.store_npy(self._data)
    @property
    def data(self):
        return self._data
    @property
    def components(self):
        return self._components

class Workspace:
    def __init__(self, *, workspace_uri: str) -> None:
        if not workspace_uri.startswith('workspace://'):
            default_feed = kp.load_feed('field-slicer-default', create=True)
            workspace_uri = f'workspace://{default_feed.get_feed_id()}/{workspace_uri}'
        self._workspace_uri = workspace_uri
        feed_id, workspace_name = parse_workspace_uri(self._workspace_uri)
        self._feed = kp.load_feed(f'feed://{feed_id}')
        self._workspace_name = workspace_name
        workspace_subfeed = self._feed.get_subfeed(dict(workspaceName=self._workspace_name))
        self._field_models = _get_field_models_from_subfeed(workspace_subfeed)
    def get_uri(self):
        return self._workspace_uri
    def get_feed_uri(self):
        return self._feed.get_uri()
    def get_workspace_name(self):
        return self._workspace_name
    def add_field_model(self, field_model: FieldModel):
        field_model_id = 'f-' + _random_id()
        if field_model_id in self._field_models:
            raise Exception(f'Duplicate field_model ID: {field_model_id}')
        x = {
            'fieldModelId': field_model_id,
            'fieldModelLabel': field_model.label,
            'transformation': field_model.transformation.tolist(),
            'components': field_model.components,
            'dataUri': field_model.get_data_uri(),
            'dataShape': [d for d in field_model.data.shape]
        }
        print(x)
        workspace_subfeed = self._feed.get_subfeed(dict(workspaceName=self._workspace_name))
        _import_field_model(workspace_subfeed, x)
        self._field_models[field_model_id] = x
        return field_model_id
    def delete_field_model(self, field_model_id: str):
        if field_model_id not in self._field_models:
            raise Exception(f'Field model not found: {field_model_id}')
        _delete_field_model(feed=self._feed, workspace_name=self._workspace_name, field_model_id=field_model_id)
        del self._field_models[field_model_id]
    def get_field_model(self, field_model_id: str):
        return self._field_models[field_model_id]
    def get_field_models(self):
        return self._field_models


def load_workspace(workspace_uri: str='default'):
    return Workspace(workspace_uri=workspace_uri)

def _random_id():
    return str(uuid.uuid4())[-12:]

def _get_field_models_from_subfeed(subfeed: kp.Subfeed):
    subfeed.set_position(0)
    le_field_models = {}
    while True:
        msg = subfeed.get_next_message(wait_msec=0)
        if msg is None: break
        a = msg
        if a.get('type', '') == 'addFieldModel':
            fm = a.get('fieldModel', {})
            fmid = fm.get('fieldModelId', '')
            le_field_models[fmid] = fm
        elif a.get('type', '') == 'DELETE_field_models':
            for fmid in a.get('fieldModelIds', []):
                if fmid in le_field_models:
                    del le_field_models[fmid]
    return le_field_models

def _import_field_model(subfeed: kp.Subfeed, le_field_model):
    le_field_models = _get_field_models_from_subfeed(subfeed)
    id = le_field_model['fieldModelId']
    if id in le_field_models:
        print(f'Field model with ID {id} already exists. Not adding.')
        return
    print(f'Adding field model: {id}')
    subfeed.submit_message({
        'type': 'addFieldModel',
        'fieldModel': le_field_model
    })

def _delete_field_model(*, feed: kp.Feed, workspace_name: str, field_model_id: str):
    subfeed = feed.get_subfeed(dict(workspaceName=workspace_name))
    le_field_models = _get_field_models_from_subfeed(subfeed)
    if field_model_id not in le_field_models:
        print(f'Cannot remove field model. Field model not found: {field_model_id}')
    subfeed.append_message({
        'type': 'deleteFieldModelS',
        'fieldModelIds': [field_model_id]
    })
