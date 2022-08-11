
# react-multi-select-cascading-dropdowns

A package to create multiple cascading dropdown filters for dashboard style bi-directional dependent filter implementations
Based on react-multi-select-component

## ✨ Features

- ✌ Written w/ TypeScript

## 🔧 Installation

```bash
npm i react-multi-select-cascading-dropdowns   # npm
yarn add react-multi-select-cascading-dropdowns # yarn
```

- Sample Usage example

```tsx
const Example = () => {
  
  const ref = React.createRef();
  
  const data_labels=['Fruit/Veg', 'Name', 'Color']
  const data=[
  ["fruit","apple","red"],
  ["fruit","grape","purple"],
  ["fruit","banana","yellow"],
  ["veg","broccoli","green"],
  ["veg","pumpkin","orange"],
  ["veg","chilli","red"],
  ]
  useEffect(() => {}, []);

  function onChangeData(e) {
    console.log(e);
  }

  function onClick() {
    ref.current.clearFilters();
  }

  function onClickSelect() {
    ref.current.selectAllFitlers();
  }

  return (
    <div>
      <button onClick={onClick}>Clear All Filters</button>
      <button onClick={onClickSelect}>Select All Filters</button>
      <MultiselectCascadeFilter
        ref={ref}
        data={data}
        n_items={3}
        onChange={onChangeData}
        showInactiveItems={true}
        preserveInactiveSelections={false}
        showLabel={true}
        padding={'10px'}
        margin={'20px'}
        labels={data_labels}       
        singleSelect={[true, false, false, false, false]}
        hasSelectAll={[false, true, true, true, true]}
        shouldToggleOnHover={[false, false, false, false, false]}
        debounceDuration={10}
        closeOnChangedValue={[false, false, false, false, false]}
      />
    </div>
  );
};

export default Example;
```

## 📝 Changelog

For every release changelog/migration-guide will be available in [releases](https://github.com/hc-oss/react-multi-select-component/releases)

## Credits

- This project uses select dropdowns from [react-multi-select-component](https://github.com/hc-oss/react-multi-select-component)
- [TypeScript](https://github.com/microsoft/typescript)

## 📜 License

MIT &copy; [Rahul K](https://github.com/lab-rk)
