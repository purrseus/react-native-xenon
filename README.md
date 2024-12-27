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

| **Prop**                    | **Type**  | **Description**                                                                                            |
| --------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| `autoInspectNetworkEnabled` | `boolean` | Determines whether the network inspector is automatically enabled upon initialization. Defaults to `true`. |
| `autoInspectConsoleEnabled` | `boolean` | Determines whether the console inspector is automatically enabled upon initialization. Defaults to `true`. |
| `bubbleSize`                | `number`  | Defines the size of the interactive bubble used in the UI. Defaults to `40`.                               |

## Methods

| **Method**    | **Return type** | **Description**                                                                             |
| ------------- | --------------- | ------------------------------------------------------------------------------------------- |
| `isVisible()` | `boolean`       | Checks whether the debugger is currently visible.                                           |
| `show()`      | `void`          | Makes the debugger visible. If it is already visible, this method has no additional effect. |
| `hide()	`      | `void`          | Hides the debugger. If it is already hidden, this method has no additional effect.          |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This project is [MIT](./LICENSE) licensed.
