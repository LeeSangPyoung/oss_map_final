import { ConfigProvider, Input, message, Upload, Button } from 'antd';
import React, { useState } from 'react';
import { useMapbase } from '~/store/useMapbase';
import { UploadOutlined } from '@ant-design/icons';

type FileUploadResponse = string;

export default function SearchLonLat() {
  const [messageApi, contextHolder] = message.useMessage();
  const { panTo } = useMapbase();
  const [valueSearch, setValueSearch] = useState('');

  const processCoordinates = (value: string, messageApi: any) => {
    const coordinates = value.split(',').map(val => parseFloat(val.trim()));

    if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
      const [longitude, latitude] = coordinates;

      if (longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90) {
        panTo([longitude, latitude]);
        messageApi.success(`Navigated to coordinates: ${longitude}, ${latitude}`);
      } else {
        messageApi.error('Invalid Lat or Long values.');
      }
    } else {
      messageApi.error('Please enter coordinates in the correct format: "longitude, latitude".');
    }
  };

  const processFileContent = (fileContent: string) => {
    const processedContent = fileContent.replace(")]}'\n", '');
    const data = JSON.parse(processedContent);
    return data[1][0][1] + ',' + data[1][0][2];
  };

  const handleFileSelect = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const fileContent = event.target?.result;

      if (typeof fileContent === 'string') {
        const processedContent: FileUploadResponse = processFileContent(fileContent);
        setValueSearch(processedContent);
        processCoordinates(processedContent, messageApi);
      }
    };

    reader.onerror = () => {
      message.error('Failed to read the file. Please try again.');
    };

    reader.readAsText(file); // Read file as plain text
    return false; // Prevent any default behavior
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    processCoordinates(valueSearch, messageApi);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-0 overflow-hidden rounded-xl border">
      <Input
        placeholder="Input Lat, Long"
        className="h-[42px] w-[230px] grow text-ellipsis rounded-none border-none pl-4 focus:ring-0"
        value={valueSearch}
        onChange={handleChangeValue}
      />
      <Upload accept=".txt,.csv,.json" beforeUpload={handleFileSelect} showUploadList={false}>
        <ConfigProvider wave={{ disabled: true }}>
          <Button icon={<UploadOutlined />} className="h-[42px] rounded-none border-none bg-white" />
        </ConfigProvider>
      </Upload>
      {contextHolder}
    </form>
  );
}
