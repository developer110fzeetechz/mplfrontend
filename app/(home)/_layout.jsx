import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
// import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { widthPerWidth } from '../../helper/dimensions';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSocket } from '../../context/socketContext';
import { getUserDetails } from '../../helper/Storage';
import { useAuth } from '../../context/AuthContext';
export default function _layout() {
    const {socket} = useSocket()
const user= getUserDetails()
const {userRole}=useAuth()
console.log(user)

    // useEffect(() => {
    //     if(socket){
    //         socket.emi('onlineUsers', (userId) => {
    //             console.log('users is Online', userId)
    //         })
            
    //     }
    // },[socket])

    return (

        <Tabs>
            <TabSlot accessibilityViewIsModal={View} />
            <TabList style={styles.tablistLayout}>
                <TabTrigger name="home" href="/" style={styles.iconStyle}>
                    {/* <Text>Home</Text> */}
                    <FontAwesome size={30} name="home" color="black" />
                </TabTrigger>
                    {userRole==="admin" &&
                <TabTrigger name="registerdTeam" href="/registerdTeam" style={styles.iconStyle}>
                    {/* <Text>Home</Text> */}
                    <AntDesign name="team" size={24} color="black" />
                </TabTrigger>
                    }
                <TabTrigger name="auctionTable" href="/auctionTable" style={styles.iconStyle}>
                    <Image
                        source={require('../../assets/auction.png')}
                        style={{ width: 30, height: 30 }}
                    />
                </TabTrigger>
                {
                    userRole &&  <TabTrigger name="onlineUsers" href="/onlineUsers" style={styles.iconStyle}>
                 
                    <FontAwesome6 name="users-line" size={24} color="black" />
                </TabTrigger>  
                }
               
                 <TabTrigger name="profile" href="/profile" style={styles.iconStyle}>
                    {/* <Text>Home</Text> */}
                    <AntDesign name="user" size={24} color="black" />
                </TabTrigger>

            </TabList>
        </Tabs>
    )
}

const styles = StyleSheet.create({
    iconStyle: {
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'black',
    },
    tablistLayout:{
        backgroundColor: "#3C3D37",
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: widthPerWidth(95),
        alignSelf: "center",
        borderRadius: 50,
        gap: 30
    }
})