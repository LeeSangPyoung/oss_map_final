import { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Radio, message } from 'antd';
import { createLayerApi, updateLayerConfigApi, deleteLayerApi } from '../services/useGetLayers';

const { Option } = Select;

const LayerConfigModal = ({ isOpen, onClose, layerList }) => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState('create');
  console.log(layerList);
  const handleModeChange = (value: string) => {
    setMode(value);
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then(async values => {
      console.log('values', values);
      try {
        if (mode === 'create') {
          createLayerApi(values);
        } else if (mode === 'update') {
          updateLayerConfigApi(values);
          // message.success('Layer updated successfully!');
        } else if (mode === 'delete') {
          deleteLayerApi(values.id);
          // message.success('Layer deleted successfully!');
        }
        form.resetFields();
        onClose();
      } catch (error) {
        message.error('An error occurred. Please try again.');
      }
    });
  };

  const renderFields = () => {
    switch (mode) {
      case 'create':
        return (
          <>
            <Form.Item name="name" label="Layer Name" rules={[{ required: true, message: 'Please input layer name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="minzoom" label="Min Zoom">
              <InputNumber min={0} max={20} />
            </Form.Item>
            <Form.Item name="maxzoom" label="Max Zoom">
              <InputNumber min={0} max={20} />
            </Form.Item>
            <Form.Item name="selectable" label="Selectable" initialValue={false}>
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 'update':
        return (
          <>
            <Form.Item name="id" label="Select Layer" rules={[{ required: true, message: 'Please select a layer!' }]}>
              <Select
                options={layerList.map(layer => ({
                  value: layer.id,
                  label: layer.label,
                }))}
              />
            </Form.Item>
            <Form.Item name="type" label="Type">
              <Input />
            </Form.Item>
            <Form.Item name="minZoom" label="Min Zoom">
              <InputNumber min={0} max={20} />
            </Form.Item>
            <Form.Item name="maxZoom" label="Max Zoom">
              <InputNumber min={0} max={20} />
            </Form.Item>
            <Form.Item name="selectable" label="Selectable" initialValue={false}>
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        );
      case 'delete':
        return (
          <Form.Item name="id" label="Select Layer" rules={[{ required: true, message: 'Please select a layer!' }]}>
            <Select
              options={layerList.map(layer => ({
                value: layer.id,
                label: layer.label,
              }))}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={`${mode?.charAt(0).toUpperCase() + mode.slice(1)} Layer`}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={mode === 'delete' ? 'Delete' : 'Save'}
      okButtonProps={{ danger: mode === 'delete' }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Select Mode">
          <Select defaultValue={mode} onChange={handleModeChange}>
            <Option value="create">Create</Option>
            <Option value="update">Update</Option>
            <Option value="delete">Delete</Option>
          </Select>
        </Form.Item>
        {renderFields()}
      </Form>
    </Modal>
  );
};

export default LayerConfigModal;
