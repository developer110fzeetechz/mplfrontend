import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Dashboard from '../../components/Dashboard';
import { useAuth } from '../../context/AuthContext';
import useAxios from '../../helper/useAxios';
import { Appbar, Avatar, Button, Menu } from 'react-native-paper';
import { getUserDetails } from '../../helper/Storage';
import { useSocket } from '../../context/socketContext';
import { Dropdown } from 'react-native-paper-dropdown';
import { useData } from '../../context/useData';
import { widthPerWidth } from '../../helper/dimensions';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';

export default function Home() {
  const [dashboard, setDashboard] = useState({});
  const { fetchData } = useAxios();
  const { logout, userRole, mydetails } = useAuth();
  const { socket, isConnected } = useSocket();
  const { selectedAuction, setSelectedAuction, auctionData } = useData();
  const [myAuctionList, setMyAuctionList] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  const getAllData = async () => {
    const { status, data } = await fetchData({ url: `/api/dashboard?auctionId=${selectedAuction}`, method: 'GET' });
    if (status) setDashboard(data);
  };

  useEffect(() => { getAllData(); }, [selectedAuction]);

  useEffect(() => {
    if (userRole === 'organisation' && mydetails) {
      const auctionId = JSON.parse(mydetails).auctionId;
      setMyAuctionList(auctionData.filter((x) => x.value === auctionId));
    }
    if (userRole === 'admin') setMyAuctionList(auctionData);
  }, [userRole, mydetails, auctionData]);

  const user = getUserDetails();
  
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('go:online', { ...user, socketId: socket.id });
    }
  }, [socket, isConnected]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.dropdownContainer}>
          <Dropdown
            label="Select Events"
            placeholder="Select Events"
            options={auctionData || []}
            value={selectedAuction}
            onSelect={setSelectedAuction}
          />
        </View>
        {userRole ? (
         <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginRight:10

         }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Avatar.Image
                size={45}
                source={{ uri: user?.image || 'https://www.esri.com/content/dam/esrisites/en-us/user-research-testing/assets/user-research-testing-overview-banner-fg.png' }}
                style={styles.avatar(isConnected)}
                onTouchEnd={() => setMenuVisible(true)}
              />
            }
          >
          
          </Menu>
       <TouchableOpacity>
       <Button icon={'logout'}  labelStyle={{
            fontSize:25
          }}
          
          onPress={logout}
          >
            {/* <Entypo name="logout" size={24} color="black" onPress={logout} /> */}
          </Button>
       </TouchableOpacity>
         </View>
        ) : (
          <Button onPress={() => router.push('auth')}  mode='contained'>
            <Text>Login</Text>
            {/* <Entypo name="login" size={24} color="black" /> */}
          </Button>
        )}
      </Appbar.Header>
      <View>
        <Text>{userRole}</Text>
      </View>
      <Dashboard dashboard={dashboard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 10 },
  appbar: { justifyContent: 'space-between', paddingLeft: 20 },
  dropdownContainer: { width: widthPerWidth(65), marginRight:15 },
  avatar: (isConnected) => ({
    marginRight: 10,
    borderWidth: 3,
    borderColor: isConnected ? 'green' : 'red',
  }),
});