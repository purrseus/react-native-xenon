/* eslint-disable no-console */
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Xenon from 'react-native-xenon';

function Button({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <Xenon.Wrapper>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Button
            title="Fetch users"
            onPress={() => {
              fetch('https://jsonplaceholder.typicode.com/users?_start=5&_limit=5&_embed=posts')
                .then(response => response.json())
                .then(json => console.log(json));
            }}
          />

          <Button
            title="Create a post"
            onPress={() => {
              fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              })
                .then(response => response.json())
                .then(json => console.info(json));
            }}
          />

          <Button
            title="Update a post"
            onPress={() => {
              fetch('https://jsonplaceholder.typicode.com/posts/1', {
                method: 'PUT',
                body: JSON.stringify({
                  id: 1,
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              })
                .then(response => response.json())
                .then(json => console.warn(json));
            }}
          />

          <Button
            title="Patch a post"
            onPress={() => {
              fetch('https://jsonplaceholder.typicode.com/posts/1', {
                method: 'PATCH',
                body: JSON.stringify({
                  title: 'foo',
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              })
                .then(response => response.json())
                .then(json => console.warn(json));
            }}
          />

          <Button
            title="Delete a post"
            onPress={() => {
              fetch('https://jsonplaceholder.typicode.com/posts/1', {
                method: 'DELETE',
              })
                .then(response => response.json())
                .then(json => console.error(json));
            }}
          />

          <Button
            title="Echo Websocket"
            onPress={() => {
              const socket = new WebSocket('wss://echo.websocket.org');

              const message = `Hello Server! It's ${new Date().toISOString()}`;

              socket.onopen = () => {
                socket.send(message);
                console.log('WebSocket.send:', message);
              };

              socket.onmessage = event => {
                console.log('WebSocket.onmessage:', event.data);
                if (event.data === message) {
                  socket.close();
                }
              };
            }}
          />

          <Button
            title="Toggle Debugger"
            onPress={() => {
              Xenon.isVisible() ? Xenon.hide() : Xenon.show();
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Xenon.Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: 'white',
    gap: 8,
    padding: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});
