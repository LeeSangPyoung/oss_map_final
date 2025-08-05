import { Input, List } from 'antd';

export function AutoCompleteSearch({ query, onChange, suggestions, handleSuggestionClick, onSearch }) {
  return (
    <div className="absolute left-12 top-12 w-[20%]">
      <Input placeholder="Search location" value={query} onChange={onChange} onPressEnter={onSearch} className="mb-3" />
      {/* {suggestions?.length > 0 && (
        <List
          size="small"
          bordered
          dataSource={suggestions}
          renderItem={location => (
            <List.Item onClick={() => handleSuggestionClick(location)} style={{ cursor: 'pointer' }}>
              {location.name}
            </List.Item>
          )}
        />
      )} */}
    </div>
  );
}
