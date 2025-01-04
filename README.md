# react-native-xenon

A comprehensive tool for analyzing HTTP(S) requests and logs in React Native apps. Designed for use across all environments, it offers an intuitive interface for efficient debugging and issue resolution.

## Installation

Install the Xenon with `yarn` or `npm`. You will also need to install `react-native-safe-area-context` if you haven't already.

```sh
yarn add react-native-xenon react-native-safe-area-context
```

or

```sh
npm install react-native-xenon react-native-safe-area-context
```

### Expo

```sh
npx expo install react-native-xenon react-native-safe-area-context
```

> [!NOTE]
> You can skip installing `react-native-safe-area-context` if you have created a project using [the default template](https://docs.expo.dev/get-started/create-a-project). This library is installed as peer dependency for Expo Router library.

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
