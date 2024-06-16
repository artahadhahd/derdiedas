import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Home() {
  const [word, setWord] = React.useState<Word>();
  const [menu, setMenu] = React.useState(true);
  const [keys, setKeys] = React.useState<readonly string[]>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalEntry, setModalEntry] = React.useState('');
  const [indices, setIndices] = React.useState<Set<number>>(new Set);

  React.useEffect(() => {
    AsyncStorage.getAllKeys().then((keys) => setKeys(keys)).catch(console.log);
  }, [menu]);

  React.useEffect(() => {
    if (word == undefined) {
      // setCount(0);
      reset().then().catch(console.log);
    }
  }, [word]);

  async function getRandom(): Promise<Word | null> {
    const rand = Math.floor(Math.random() * keys.length);
    if (indices.size >= keys.length) {
      return null;
    }
    if (indices?.has(rand)) {
      return getRandom();
    }
    indices?.add(rand);
    setIndices(indices);
    const noun = keys.at(rand);
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

  const updateWord = async () => {
    const newWord = await getRandom();
    if (newWord != null) { // && count < keys.length) {
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
    setIndices(new Set);
    for (const key of keys) {
      if (word?.key_ == key) {
        continue;
      }
      const noun = await AsyncStorage.getItem(key);
      if (noun != null) {
        const data = JSON.parse(noun) as Data;
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
    const getColor = (gen: string): string => {
      switch (gen) {
        case 'der': return '#98b2c1';
        case 'die': return '#FF8D9C';
        default: return 'white';
      }
    };
    return (
      <>
        <Modal
          animationType='fade'
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={[{backgroundColor: 'black'}]}
        >
          <SafeAreaView style={[styles.center, {backgroundColor: getColor(modalEntry)}]}>
            <Text style={{fontSize: 30}}>{modalEntry} {word?.key_}</Text>
            <Pressable onPress={() => {
              setModalVisible(false);
            }}>
              <Text style={{color: 'gray'}}>Continue</Text>
            </Pressable>
          </SafeAreaView>
        </Modal>


        <Pressable onPress={async () => {
          if (word?.data.gender != gender) {
            setModalVisible(true);
            if (word != undefined) {
              setModalEntry(word?.data.gender);
            }
          } else {
            await updateWord();
          }
          setTimeout(() => {
            if (!modalVisible) {
              setModalVisible(false);
            }
          }, 3000);
          }} style={({pressed}) => [styles.sbutton, styles.center, {backgroundColor: pressed ? getColor(gender) : '#dedede'}]}>
          <Text>{gender}</Text>
        </Pressable>
      </>
    )
  }

  function DerDieDas() {
    return (
      <>
      <View style={{flexDirection: 'row'}}>
        <SButton gender='der' />
        <SButton gender='die' />
        <SButton gender='das' />
      </View>
      </>
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
    false: {

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