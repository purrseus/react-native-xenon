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
  const createPostBody = (method: string, body: Record<string, any>) => ({
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  const fetchApi = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Xenon.Wrapper>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Button
            title="Fetch Pikachu"
            onPress={() => {
              fetchApi('https://pokeapi.co/api/v2/pokemon/pikachu');
            }}
          />

          <Button
            title="Fetch users"
            onPress={() => {
              fetchApi('https://jsonplaceholder.typicode.com/users?_start=5&_limit=5&_embed=posts');
            }}
          />

          <Button
            title="Create a post"
            onPress={() => {
              fetchApi(
                'https://jsonplaceholder.typicode.com/posts',
                createPostBody('POST', {
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                }),
              );
            }}
          />

          <Button
            title="Update a post"
            onPress={() => {
              fetchApi(
                'https://jsonplaceholder.typicode.com/posts/1',
                createPostBody('PUT', {
                  title: 'foo',
                  body: 'bar',
                  userId: 1,
                }),
              );
            }}
          />

          <Button
            title="Patch a post"
            onPress={() => {
              fetchApi(
                'https://jsonplaceholder.typicode.com/posts/1',
                createPostBody('PATCH', {
                  title: 'foo',
                }),
              );
            }}
          />

          <Button
            title="Delete a post"
            onPress={() => {
              fetchApi('https://jsonplaceholder.typicode.com/posts/1', {
                method: 'DELETE',
              });
            }}
          />

          <Button
            title="Fetch with error"
            onPress={() => {
              fetchApi('https://jsonplaceholder.typicode.com/invalid-endpoint');
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
