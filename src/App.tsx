import React from "react";

// тестовая структура
export const param = [
  {
    id: 1,
    name: "Назначение",
    type: "string",
  },
  {
    id: 2,
    name: "Длина",
    type: "string",
  },
];

export const paramValues = [
  {
    paramId: 1,
    value: "повседневное",
  },
  {
    paramId: 2,
    value: "макси",
  },
];

// Чтобы добавить типы нужно добавить значение тут и case в switch, в компоненте ParamField, чтобы сохранять структуру с нужным типом данных.
// Варианты типов будут выводиться в select, в компоненте ParamField
export type SupportTypes = string;
const supportTypes = ["string"];

export interface Param {
  id: number;
  name: string;
  type: string;
}
export interface ParamValue {
  paramId: number;
  value: SupportTypes;
}
export interface Model {
  paramValues: ParamValue[];
}

interface ParamEditorProps {
  params: Param[];
  model: Model;
  setParamsValue: (paramValues: ParamValue[]) => void;
}
interface ParamEditorState {
  renderModel: JSX.Element | null;
}

class ParamEditor extends React.Component<ParamEditorProps, ParamEditorState> {
  constructor(props: ParamEditorProps) {
    super(props);
    this.state = { renderModel: null };

    this.getModel = this.getModel.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  getModel(): Model {
    // вероятно, я не понял пример, но было написано что метод должен возвращать объект Model, но не совсем понятно куда и зачем
    return this.props.model;
  }

  handleClick() {
    this.setState({
      renderModel: <div>Model: {JSON.stringify(this.getModel())}</div>,
    });
  }

  render() {
    return (
      <>
        {this.props.params.map((param) => (
          <ParamField
            key={param.id}
            model={this.props.model}
            param={param}
            setParamsValue={this.props.setParamsValue}
          />
        ))}
        <div>
          <button onClick={this.handleClick}>getModel</button>
        </div>
        <div>{this.state.renderModel}</div>
      </>
    );
  }
}

interface ParamFieldProps {
  param: Param;
  setParamsValue: (paramValues: ParamValue[]) => void;
  model: Model;
}

interface ParamFieldState {
  selectValue: SupportTypes;
}

class ParamField extends React.Component<ParamFieldProps, ParamFieldState> {
  constructor(props: ParamFieldProps) {
    super(props);
    this.state = { selectValue: supportTypes[0] };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setParamsValue(
      this.props.model.paramValues.map((paramValue) => {
        if (paramValue.paramId !== this.props.param.id) {
          return paramValue;
        }
        switch (this.state.selectValue) {
          case "string":
            return {
              paramId: paramValue.paramId,
              value: e.target.value,
            };
          default:
            return paramValue;
        }
      })
    );
  };
  render() {
    const value = this.props.model.paramValues
      .find((paramObj) => paramObj.paramId === this.props.param.id)
      ?.value.toString();
    return (
      <div>
        <label htmlFor="param">{this.props.param.name}</label>
        <input
          type="text"
          name="param"
          onChange={this.handleChange}
          value={value}
        />
        <select value={this.props.param.type}>
          {supportTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

interface AppState {
  Param: Param[];
  Model: Model;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.handleParamValueChange = this.handleParamValueChange.bind(this);
    this.state = { Param: param, Model: { paramValues: paramValues } };
  }

  handleParamValueChange(paramValues: ParamValue[]) {
    this.setState((prevState) => {
      return { ...prevState, Model: { paramValues: paramValues } };
    });
  }

  render() {
    console.log(this.state);
    return (
      <ParamEditor
        model={this.state.Model}
        params={this.state.Param}
        setParamsValue={this.handleParamValueChange}
      />
    );
  }
}

export default App;
