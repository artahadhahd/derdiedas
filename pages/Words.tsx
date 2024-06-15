import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View, Image, Dimensions, Modal} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
// import { storage } from "../MMKV";

const derColor = '#98b2c1';
const dieColor = '#FF8D9C';

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Words() {
    const [noun, setNoun] = React.useState('');
    const [shouldUpdate, setUpdate] = React.useState(true);

    const [gender, setGender] = React.useState<string | null>(null);
    const [items, _setItems] = React.useState([
      {label: 'Der', value: 'der'},
      {label: 'Die', value: 'die'},
      {label: 'Das', value: 'das'},
    ]);
    
    const [words, setWords] = React.useState<Word[]>();
    
    // whether *one* modal has to be shown
    const [modalVisible, setModalVisible] = React.useState(false);
    // item selected in modal
    const [modalEntry, setModalEntry] = React.useState<string>();

    // todo: use mmkv
    React.useEffect(() => {
        AsyncStorage.getAllKeys().then(async (nouns: readonly string[]) => {
            let words: Word[] = [];
            for (const noun of nouns) {
                const data = await AsyncStorage.getItem(noun);
                if (data != null) {
                    words.push({key_: noun, data: JSON.parse(data) as Data});
                }
            }
            setWords(words);
        });
        setUpdate(false);
    }, [shouldUpdate]);

    const addWord = async (noun: string, gender: string | null) => {
        if (gender != null && noun != "") {
            await AsyncStorage.setItem(capitalize(noun), JSON.stringify({gender: gender, used: false}));
            setNoun('');
            setUpdate(true);
        }
    };


    const deleteItem = async () => {
        setModalVisible(false);
        if (modalEntry != undefined) {
            await AsyncStorage.removeItem(modalEntry);
        }
        setUpdate(true);   
    };

    const Card = ({key_: key, data}: Word) => {
        const color = data.gender == 'der' ? derColor : data.gender == 'die' ? dieColor : '#dedede';
        return (
        <View style={[styles.card, {backgroundColor: color}]}>
            <Text style={styles.cardText}>{data.gender} {key}</Text>
            <Modal
                animationType='none'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.center}>
                    <View style={styles.confirmation}>
                        <Text style={{margin: 10}}>Are you sure you want to delete '{modalEntry}'?</Text>
                        <Pressable onPress={async () => await deleteItem()} style={[styles.confirmationButton, styles.center, {backgroundColor: '#cd3f24'}]}>
                            <Text style={{color: 'white'}}>Yes</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalVisible(false)} style={[styles.confirmationButton, styles.center]}>
                            <Text style={{color: 'gray'}}>No</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable onPress={() => {
                setModalVisible(true);
                setModalEntry(key);
            }}>
                <Image style={styles.delete} source={require("../assets/delete.png")} />
            </Pressable>
        </View>)
    };

    return (
        <SafeAreaView style={{height: '100%'}}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Dropdown
                    data={items}
                    labelField={"label"} valueField={"value"}
                    onChange={(item) => setGender(item.value) }
                    
                    style={styles.dropDown}
                    placeholder=""
                />

                <TextInput 
                    onChangeText={setNoun}
                    value={noun}
                    placeholder="Enter a noun here"
                    inputMode="text"
                    style={styles.input}
                />

                <Pressable style={styles.addButton} onPress={async () => await addWord(noun, gender)}>
                    <Image source={require("../assets/add.png")} style={styles.buttonText} />
                </Pressable>

            </View>
            <FlatList data={words} renderItem={({item}) => <Card key_={item.key_} data={item.data} />} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        margin: 10,
        borderWidth: 0.2,
        padding: 20,
        borderRadius: 5,
        width: Dimensions.get('window').width - 50 - 75 - 60,
        // width: '50%',
        borderColor: 'gray'
    },
    dropDownContainer: {
        padding: 10,
    },
    dropDown: {
        padding: 10,
        marginTop: 10,
        marginLeft: 10,
        height: 60,
        width: 75,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    addButtonContainer: {
        padding: 10,
        width: 100,
        top: 50,
    },
    addButton: {
        borderRadius: 5,
        // backgroundColor: '#022B3A',
        backgroundColor: '#03254e',
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    buttonText: {
        // color: 'white',
        width: 20,
        height: 20
    },
    card: {
        display: 'flex',
        flexDirection: 'row',
        height: 'auto',
        width: 'auto',
        // backgroundColor: '#1F7A8C',
        backgroundColor: '#dedede',
        margin: 5,
        padding: 20,
        borderRadius: 5,
        justifyContent: 'space-between',
        borderWidth: 0.8,
        borderColor: 'gray'
    },
    cardText: {
        // color: '#E5E5E5',
        color: 'black',
    },
    delete: {
        width: 15,
        height: 15,
        alignSelf: 'flex-end'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmation: {
        backgroundColor: '#dddddd',
        padding: 20,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1
    },
    confirmationButton: {
        padding: 5,
        margin: 5,
        backgroundColor: '#cccccc',
        borderRadius: 5,
        height: 50,
        maxHeight: 40,
    },
});