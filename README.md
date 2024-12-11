# react-native-xenon

A comprehensive tool for analyzing HTTP(S) requests and logs in React Native apps. Designed for use across all environments, it offers an intuitive interface for efficient debugging and issue resolution.

## Installation

Install the Xenon with `yarn` or `npm`.

```sh
yarn add react-native-xenon
```

or

```sh
npm install react-native-xenon
```

## Usage

Add `Xenon.Component` in your app root component.

```tsx
import Xenon from 'react-native-xenon';

function App() {
  return (
    <>
      {/* Your other components here */}
      <Xenon.Component />
    </>
  );
}
```

Present the debugger by calling the `show` method.

```tsx
Xenon.show();
```

And hide it by calling the `hide` method.

```tsx
Xenon.hide();
```

## Props

| **Prop**                  | **Description**                                                                        | **Required** | **Type**  | **Default** |
| ------------------------- | -------------------------------------------------------------------------------------- | ------------ | --------- | ----------- |
| `autoInspectNetwork`      | Determines whether the network inspector is automatically enabled upon initialization. | No           | `boolean` | `true`     |
| `autoInspectConsole` | Determines whether the console inspector is automatically enabled upon initialization. | No           | `boolean` | `true`     |
| `bubbleSize`              | Defines the size of the interactive bubble used in the UI                              | No           | `number`  | `40`        |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This project is [MIT](./LICENSE) licensed.
