<div align="center">

# React Native Xenon

### A comprehensive tool for analyzing HTTP(S) requests and logs in React Native apps. :microscope:

</div>

<div align="center">

[![GitHub Actions Workflow Status][github-actions-status-badge]][github-actions-status-link]
[![NPM Version][npm-version-badge]][npm-version-link]
[![React Native][react-native-badge]][react-native-link]
[![Runs With Expo][expo-badge]][expo-link]
[![Types Included][typescript-badge]][typescript-link]
<br />
[![GitHub License][github-license-badge]][github-license-link]
[![NPM Downloads Per Month][npm-downloads-per-month-badge]][npm-downloads-per-month-link]
[![Buy Me A Coffee][buy-me-a-coffee-badge]][buy-me-a-coffee-link]

</div>

## Features

- HTTP/HTTPS request monitoring with support for **XHR** and **Fetch API**
- **WebSocket** connection tracking
- **Console** logging interception (log, info, warn, error, etc.)
- **Draggable bubble** interface for quick access
- Request/response inspection with **detailed information**
- Real-time monitoring capabilities
- Works with both **React Native** and **Expo** projects

## Installation

### React Native

Install the Xenon with **yarn** or **npm**. You will also need to install `react-native-safe-area-context` if you haven't already.

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
| `idleBubbleOpacity`         | `number`  | Defines the opacity level of the bubble when it is idle. Defaults to `0.5`.                                |

## Methods

| **Method**    | **Return Type** | **Description**                                                                             |
| ------------- | --------------- | ------------------------------------------------------------------------------------------- |
| `isVisible()` | `boolean`       | Checks whether the debugger is currently visible.                                           |
| `show()`      | `void`          | Makes the debugger visible. If it is already visible, this method has no additional effect. |
| `hide()	`      | `void`          | Hides the debugger. If it is already hidden, this method has no additional effect.          |

## Examples

To try out Xenon, you can run the example project:

```sh
# Clone the repo
git clone https://github.com/purrseus/react-native-xenon.git
cd react-native-xenon

# Install dependencies
yarn install

# Start the Expo development server
yarn example start
```

See the [example](./example) directory for more information.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This project is [MIT](./LICENSE) licensed.

<!-- badges -->

[github-actions-status-badge]: https://img.shields.io/github/actions/workflow/status/purrseus/react-native-xenon/ci.yml?style=for-the-badge&logo=github&label=%20&labelColor=1B1B1D
[github-actions-status-link]: ./.github/workflows/ci.yml
[npm-version-badge]: https://img.shields.io/npm/v/react-native-xenon?style=for-the-badge&color=CC3F3E&labelColor=1B1B1D&logo=npm&label=%20&logoColor=CC3F3E
[npm-version-link]: https://www.npmjs.com/package/react-native-xenon
[react-native-badge]: https://img.shields.io/badge/%20React%20Native-67DAFB?style=for-the-badge&logo=react&logoColor=67DAFB&labelColor=1B1B1D
[react-native-link]: https://reactnative.dev
[expo-badge]: https://img.shields.io/badge/Expo-FFFFFF?style=for-the-badge&logo=expo&labelColor=1B1B1D&logoColor=FFFFFF
[expo-link]: https://expo.dev
[typescript-badge]: https://img.shields.io/badge/TypeScript-3077C6?style=for-the-badge&logo=typescript&logoColor=3077C6&labelColor=1B1B1D
[typescript-link]: https://www.typescriptlang.org
[github-license-badge]: https://img.shields.io/badge/License-MIT-44CD11?style=for-the-badge&labelColor=1B1B1D
[github-license-link]: ./LICENSE
[npm-downloads-per-month-badge]: https://img.shields.io/npm/dm/react-native-xenon?style=for-the-badge&labelColor=1B1B1D
[npm-downloads-per-month-link]: https://www.npmjs.com/package/react-native-xenon
[buy-me-a-coffee-badge]: https://img.shields.io/badge/%20-Buy%20me%20a%20coffee-FEDD03?style=for-the-badge&logo=buymeacoffee&labelColor=1B1B1D
[buy-me-a-coffee-link]: https://www.buymeacoffee.com/thiendo261
