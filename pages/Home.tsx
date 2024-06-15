import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


async function getRandom(list: readonly string[]): Promise<Word | null> {
  const rand = Math.floor(Math.random() * list.length);
  const noun = list.at(rand);
  if (noun != undefined) {
    const gender = await AsyncStorage.getItem(noun);
    if (gender != null) {
      return {
        key_: noun, data: JSON.parse(gender)
      };
    }
  }
  return null;
}



export default function Home() {
  const [word, setWord] = React.useState<Word>();
  const [menu, setMenu] = React.useState<boolean>(true);

  const updateWord = async () => {
    const list = await AsyncStorage.getAllKeys();
    const word = await getRandom(list);
    if (word != null) {
      setWord(word);
    }
  };

  const start = async () => {
    setMenu(false);
    updateWord();
  };

  function RestartButton() {
    return (
    <View style={{alignItems: 'center'}}>
      <View style={{width: '75%', flexDirection: 'row-reverse'}}>
        <Pressable style={[styles.backButton, styles.center]} onPress={() => setMenu(true)}>
          <Image style={{width: 30, height: 30}} source={require("../assets/restart.png")} />
        </Pressable>
      </View>
    </View>)
  }

  if (menu) {
    return (
      <View style={styles.center}>
        <Image source={require("../assets/der-die-das.png")} style={styles.logo} />
        <TouchableOpacity onPress={async () => await start()} style={styles.startButton}>
          <Text style={{color: 'white'}}>Start</Text>
        </TouchableOpacity>

      </View>
    )
  }

  function SButton({gender}: Gender) {
    const getColor = (): string => {
      switch (gender) {
        case 'der': return '#98b2c1';
        case 'die': return '#FF8D9C';
        case 'das': return 'white';
      }
    };
    return (
      <Pressable onPress={async () => {
        if (word?.data.gender != gender) {
          console.log("you fucked up lmao");
        } else {
          await updateWord();
        }
      }} style={({pressed}) => [styles.sbutton, styles.center, {backgroundColor: pressed ? getColor() : '#dedede'}]}>
        <Text>{gender}</Text>
      </Pressable>
    )
  }


  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>

      <View style={styles.center}>
        <View style={[styles.card, styles.center]}>
          <Text style={styles.noun}>{word?.key_}</Text>
          {word == null && <Text>You don't have any items yet.</Text>}

          <View style={{flexDirection: 'row'}}>
            <SButton gender='der' />
            <SButton gender='die' />
            <SButton gender='das' />
          </View>
        </View>
        <RestartButton />
      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
      width: '75%',
      maxHeight: '75%',
      backgroundColor: '#dedede',
      borderRadius: 5,
      borderWidth: 0.5,
      borderColor: 'gray',
    },
    backButton: {
      // position: 'absolute',
      padding: 20,
      margin: 10,
      width: 30,
      height: 30,
      maxHeight: 30,
      borderRadius: 100,
      // backgroundColor: '',
      borderWidth: 0.5,
      borderColor: 'gray'
    },
    noun: {
      fontSize: 40,
      padding: 40,
    },
    sbutton: {
      padding: 10,
      margin: 2,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'gray',
    },


    logo: {
        width: 200,
        height: 200,
    },
    startButton: {
        // backgroundColor: '#1F7A8C',
        backgroundColor: '#03254e',
        height: 40,
        width: 150,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
});