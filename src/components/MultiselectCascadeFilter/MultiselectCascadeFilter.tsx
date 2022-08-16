import React, { ReactElement, useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";


export interface MultiselectCascadeFilterProps {
  n_items: number;
  data: string[][];
  singleSelect?: boolean[];
  showInactiveItems?: boolean;
  preserveInactiveSelections?: boolean;
  padding?: string;
  margin?: string;
  containerClass?: string;
  multiselectClass?: string;
  labels?: string[];
  hasSelectAll?: boolean[];
  showLabel?: boolean;
  shouldToggleOnHover?: boolean[];
  overrideStrings?: {
    [key: string]: string;
  };
  disabled?: boolean[];
  disableSearch?: boolean[];
  ClearIcon?: boolean[];
  debounceDuration?: number;
  closeOnChangedValue?: boolean[];
  renderLabel?: (x: string) => ReactElement;
  onChange?: (e: DataArrayType) => void;
}

export interface Option {
  value: string;
  label: string;
  key?: string;
  disabled?: boolean;
}

export interface IDefaultItemRendererProps {
  checked: boolean;
  option: Option;
  disabled?: boolean;
  onClick: () => void;
}

export interface DataArrayType {
  [key: number | string]: Option[];
}

export interface handleFunction {
  clearFilters(): void;
  selectAllFilters():void;
}


const MultiselectCascadeFilter = React.forwardRef<
  handleFunction,
  MultiselectCascadeFilterProps
>((props, ref) => {
  function _initialzeStates(howMany: number[]) {
    let t = {} as DataArrayType;
    howMany.map((x) => (t[x] = []));
    return t;
  }

  const range = Array.from(Array(props.n_items).keys());
  const [selectedFilt, setFilterSelect] = useState<DataArrayType>(
    _initialzeStates(range)
  );
  const [filtered, setFiltered] = useState<DataArrayType>(
    _initialzeStates(range)
  );

  React.useImperativeHandle(ref, () => ({
    clearFilters: () => {
      setFilterSelect(_initialzeStates(range));
      _filterWithoutDisable(props.data, _initialzeStates(range), -1);
    },
    selectAllFilters: () => {
		selectAllFilters_func(props.data)
    },
  }));

  const RadioRender = ({
    checked,
    option,
    onClick,
    disabled,
  }: IDefaultItemRendererProps) => (
    <div className={`item-renderer ${disabled ? "disabled" : ""}`}>
      <input
        type="radio"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span>{option.label}</span>
    </div>
  );

  const DefaultRender = ({
    checked,
    option,
    onClick,
    disabled,
  }: IDefaultItemRendererProps) => (
    <div className={`item-renderer ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        onChange={onClick}
        checked={checked}
        tabIndex={-1}
        disabled={disabled}
      />
      <span>{option.label}</span>
    </div>
  );

  function _filterWithoutDisable(
    data: string[][],
    selects: DataArrayType,
    h: number
  ) {
    let fil_data = {} as DataArrayType;
    let range_loop = [];
    if (h > -1) {
      range_loop = range.filter((x) => x != h);
    } else {
      range_loop = range;
    }
    range_loop
      .filter((x) => x != h)
      .map((x) => {
        let temp = data;
        range
          .filter((k) => k != x)
          .map((p) => {
            if (selects[p].length > 0) {
              temp = temp.filter((y) =>
                selects[p].map((x) => x.value).includes(y[p])
              );
            } 
          });
        fil_data[x] = [...new Set(temp.map((item) => item[x]))].map((j) => ({
          value: j,
          label: j,
        }));
        if (!props.preserveInactiveSelections) {
          let active_set = [...new Set(temp.map((item) => item[x]))];
          selects[x] = selects[x].filter((k) =>
            active_set.includes(k["value"])
          );
        }
      });

    if (filtered && h > -1) {
      fil_data[h] = filtered[h];
     
    }

    setFiltered(fil_data);
    setFilterSelect(selects);
    props.onChange && props.onChange(selects);
  }

  function _filterWithDisable(
    data: string[][],
    selects: DataArrayType,
    h: number
  ) {
    let fil_data = {} as DataArrayType;
    let range_loop = [] as number[];
    if (h > -1) {
      range_loop = range.filter((x) => x != h);
    } else {
      range_loop = range;
    }
    range_loop
      .filter((x) => x != h)
      .map((x) => {
        let temp = data;
        let temp_orig = [...new Set(data.map((t) => t[x]))];
        range
          .filter((k) => k != x)
          .map((p) => {
            if (selects[p].length > 0) {
              temp = temp.filter((y) =>
                selects[p].map((x) => x.value).includes(y[p])
              );
            } 
          });
        let active_set = [...new Set(temp.map((item) => item[x]))];
        fil_data[x] = temp_orig
          .map((j) => {
            if (active_set.includes(j)) {
              return {
                value: j,
                label: j,
                disabled: false,
              };
            } else {
              return {
                value: j,
                label: j,
                disabled: true,
              };
            }
          })
          .sort((a, b) => Number(a.disabled) - Number(b.disabled));

        if (!props.preserveInactiveSelections) {
          selects[x] = selects[x].filter((k) =>
            active_set.includes(k["value"])
          );
        }
      });

    if (filtered && h > -1) {
      fil_data[h] = filtered[h];
      
    }
    setFiltered(fil_data);
    setFilterSelect(selects);
    props.onChange && props.onChange(selects);
  }

  function onFilter(e: Option[], h: number) {
    if (props.singleSelect) {
      if (props.singleSelect[h]) {
        e = e.slice(-1);
      }
    }

    if (props.showInactiveItems == true) {
      _filterWithDisable(props.data, { ...selectedFilt, [h]: e }, h);
    } else {
      _filterWithoutDisable(props.data, { ...selectedFilt, [h]: e }, h);
    }
  }

  function selectAllFilters_func(data: string[][]){
    let fil_data = {} as DataArrayType;
   
    range
      .map((x) => {
        fil_data[x] = [...new Set(data.map((item) => item[x]))].map((j) => ({
          value: j,
          label: j,
        }));        
      });
  
    setFiltered(fil_data);
    setFilterSelect(fil_data);
    props.onChange && props.onChange(fil_data);
  }

  useEffect(() => {
    _filterWithoutDisable(props.data, _initialzeStates(range), -1);
  }, []);

  return (
    <div>
      {range.map((x) => {
        return (
          <div
            key={x}
            style={{ padding: props.padding, margin: props.padding }}
            className={props.containerClass && props.containerClass}
          >
            {props.labels && !props.renderLabel && (
              <label>{props.labels[x]}</label>
            )}
            {props.renderLabel &&
              props.labels &&
              props.renderLabel(props.labels[x])}
            <MultiSelect
              key={x}
              options={filtered && filtered[x]}
              value={selectedFilt && selectedFilt[x]}
              onChange={(e: Option[]) => onFilter(e, x)}
              className={props.multiselectClass && props.multiselectClass}
              labelledBy="Select"
              ItemRenderer={
                props.singleSelect && props.singleSelect[x]
                  ? RadioRender
                  : DefaultRender
              }
              hasSelectAll={props.hasSelectAll && props.hasSelectAll[x]}
              shouldToggleOnHover={
                props.shouldToggleOnHover && props.shouldToggleOnHover[x]
              }
              overrideStrings={props.overrideStrings}
              disabled={props.disabled && props.disabled[x]}
              disableSearch={props.disableSearch && props.disableSearch[x]}
              ClearIcon={props.ClearIcon && props.ClearIcon[x]}
              debounceDuration={props.debounceDuration}
              closeOnChangedValue={
                props.closeOnChangedValue && props.closeOnChangedValue[x]
              }
            />
          </div>
        );
      })}
    </div>
  );
});

export default MultiselectCascadeFilter;
