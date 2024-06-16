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
  const [menu, setMenu] = React.useState(true);
  const [keys, setKeys] = React.useState<readonly string[]>([]);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    AsyncStorage.getAllKeys().then((keys) => setKeys(keys)).catch(console.log);
  }, []);

  React.useEffect(() => {
    if (word == undefined) {
      reset().then().catch(console.log);
      setCount(0);
    } else if (word.data.used) {
      updateWord().then().catch(console.log);
    } else if (!word.data.used) {
      setCount(count + 1);
    }
  }, [word]);

  const updateWord = async () => {
    const newWord = await getRandom(keys);
    if (newWord != null && count < keys.length) {
      setWord(newWord);
      await AsyncStorage.mergeItem(newWord.key_, JSON.stringify({gender: newWord.data.gender, used: true}));
    } else {
      setWord(undefined);
    }
  };

  const start = async () => {
    setKeys(await AsyncStorage.getAllKeys());
    await updateWord();
    setMenu(false);
  };

  const reset = async () => {
    if (word != null) {
      word.data.used = false;
    }
    for (const key of keys) {
      if (word?.key_ == key) {
        continue;
      }
      const noun = await AsyncStorage.getItem(key);
      if (noun != null) {
        const data = JSON.parse(noun) as Data;
        data.used = false;
        await AsyncStorage.mergeItem(key, JSON.stringify(data));
      }
    }
    setMenu(true);
  };

  function RestartButton() {
    return (
    <View style={{alignItems: 'center'}}>
      <View style={{width: '75%', flexDirection: 'row-reverse'}}>
        <Pressable style={[styles.backButton, styles.center]} onPress={async () => await reset()}>
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

  function DerDieDas() {
    return (
      <View style={{flexDirection: 'row'}}>
        <SButton gender='der' />
        <SButton gender='die' />
        <SButton gender='das' />
      </View>
    )
  }


  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>

      <View style={styles.center}>
        <View style={[styles.card, styles.center]}>
          {keys.length > 0 && <Text style={styles.noun}>{word?.key_}</Text>}
          {keys.length == 0 && <Text>You don't have any items yet.</Text>}
          {keys.length > 0 && <DerDieDas />}
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