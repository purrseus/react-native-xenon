/* eslint-disable no-console */
import axios from 'axios';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <>
      <View style={styles.container}>
        <Button
          title="Fetch: Get pokemon"
          onPress={() => {
            fetch('https://pokeapi.co/api/v2/pokemon/ditto')
              .then(res => res.json())
              .then(console.log);
          }}
        />

        <Button
          title="Fetch: Get posts"
          onPress={() => {
            fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
              .then(res => res.json())
              .then(console.log);
          }}
        />

        <Button
          title="Fetch: Create post"
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
              .then(res => res.json())
              .then(console.log);
          }}
        />

        <Button
          title="Axios: Get pokemon"
          onPress={() => {
            axios('https://pokeapi.co/api/v2/pokemon/ditto').then(console.log);
          }}
        />

        <Button
          title="Axios: Get posts"
          onPress={() => {
            axios('https://jsonplaceholder.typicode.com/posts?userId=1').then(console.log);
          }}
        />

        <Button
          title="Axios: Create post"
          onPress={() => {
            axios
              .post('https://jsonplaceholder.typicode.com/posts', {
                title: 'foo',
                body: 'bar',
                userId: 1,
              })
              .then(console.log);
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
      </View>
      <Xenon.Component />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    rowGap: 8,
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
