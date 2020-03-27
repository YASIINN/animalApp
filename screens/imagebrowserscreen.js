import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import {ImageBrowser} from 'expo-image-picker-multiple';
import CustomHeader from "../components/customHeader";
import {Container} from "native-base";

export default class ImageBrowserScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tthis: null,
            selectedImg: 0,
        }
    }

    imagesCallback = (callback) => {
        debugger
        const {navigation} = this.props;
        debugger
        navigation.setParams({loading: true});
        debugger
        callback.then(async (photos) => {
            debugger
            const cPhotos = [];
            for (let photo of photos) {
                const pPhoto = await this._processImageAsync(photo.uri);
                console.log("gelene", pPhoto)
                cPhotos.push({
                    base64: pPhoto.base64,
                    uri: pPhoto.uri,
                    name: photo.filename,
                    type: 'image/jpg'
                })
            }
            navigation.navigate('Gonderi', {photos: cPhotos});
        })
            .catch((e) => console.log(e))
            .finally(() => navigation.setParams({loading: false}));
    };

    async _processImageAsync(uri) {
        debugger
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [{resize: {width: 1000}}],
            {compress: 0.8, base64: true}
        );
        debugger
        console.log("dosyaya", file)
        return file;
    }

    updateHandler = (count, onSubmit) => {
        debugger
        this.props.navigation.setParams({
            headerTitle: `Selected ${count} files`,
            headerRight: onSubmit,
        });
        this.setState({
            selectedImg: count
        })
        debugger
    };
    onSubmit = () => {
        debugger
        this.props.route.params.headerRight()
        debugger
    }

    renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );

    render() {
        const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;

        return (

            <View style={[styles.flex, styles.container]}>
                <CustomHeader iconame={"arrow-back"}
                              righticon={"add"}
                              headerrightPress={() => {
                                  this.onSubmit()
                              }}
                              headertitle={this.state.selectedImg == 0 ? "Seçili Resim Yok" : this.state.selectedImg}
                              headerleftPress={() => {
                                  this.props.navigation.pop();
                              }}/>
                <ImageBrowser
                    max={10}
                    onChange={this.updateHandler}
                    callback={this.imagesCallback}
                    renderSelectedComponent={this.renderSelectedComponent}
                    emptyStayComponent={emptyStayComponent}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        position: 'relative'
    },
    emptyStay: {
        textAlign: 'center',
    },
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF'
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    }
});
