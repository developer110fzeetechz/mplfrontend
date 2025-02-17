import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Dashboard from '../../components/Dashboard';
import { useAuth } from '../../context/AuthContext';
import useAxios, { baseUrl } from '../../helper/useAxios';
import { Appbar, Avatar, Button, Menu } from 'react-native-paper';
import { getUserDetails } from '../../helper/Storage';
import { useSocket } from '../../context/socketContext';
import { Dropdown } from 'react-native-paper-dropdown';
import { useData } from '../../context/useData';
import { widthPerWidth } from '../../helper/dimensions';
import { router } from 'expo-router';
import PullToRefreshLayout from '../../components/layout/PullToRefreshLayout';

// Import Common Layout
// import PullToRefreshLayout from '../../components/PullToRefreshLayout';

export default function Home() {
  const [dashboard, setDashboard] = useState({});
  const { fetchData } = useAxios();
  const { logout, userRole, mydetails } = useAuth();
  const { socket, isConnected } = useSocket();
  const { selectedAuction, setSelectedAuction, auctionData } = useData();
  const [myAuctionList, setMyAuctionList] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserDetails();
      setUser(userData);
    }
    fetchUser();
  }, []);

  // Fetch dashboard data
  const getAllData = async () => {
    if (!selectedAuction) return;

    const { status, data } = await fetchData({ url: `/api/dashboard?auctionId=${selectedAuction}`, method: 'GET' });

    if (status) setDashboard(data || {});
  };

  useEffect(() => {
    getAllData();
  }, [selectedAuction]);

  useEffect(() => {
    if (userRole === 'organisation' && mydetails) {
      const auctionId = JSON.parse(mydetails)?.auctionId;
      setMyAuctionList(auctionData.filter((x) => x.value === auctionId));
    }
    if (userRole === 'admin') setMyAuctionList(auctionData);
  }, [userRole, mydetails, auctionData]);

  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('go:online', { ...user, socketId: socket.id });
    }
  }, [socket, isConnected, user]);

  return (
    <PullToRefreshLayout refreshFunction={getAllData}>
      <Appbar.Header style={styles.appbar}>
        <View style={styles.dropdownContainer}>
          <Dropdown
            label="Select Events"
            placeholder="Select Events"
            options={auctionData || []}
            value={selectedAuction || ""}
            onSelect={setSelectedAuction}
          />
        </View>
        {userRole ? (
          <View style={styles.userSection}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Avatar.Image
                  size={45}
                  source={{ uri: user?.image ? `${baseUrl}${user.image}` : "https://via.placeholder.com/150" }}
                  style={styles.avatar(isConnected)}
                  onTouchEnd={() => setMenuVisible(true)}
                />
              }
            />
            <TouchableOpacity>
              <Button icon={'logout'} labelStyle={styles.logoutIcon} onPress={logout} />
            </TouchableOpacity>
          </View>
        ) : (
          <Button onPress={() => router.push('auth')} mode="contained">
            <Text>Login</Text>
          </Button>
        )}
      </Appbar.Header>

      {/* Dashboard Content */}
      <Dashboard dashboard={dashboard} />
    </PullToRefreshLayout>
  );
}

const styles = StyleSheet.create({
  appbar: { justifyContent: 'space-between', paddingLeft: 20 },
  dropdownContainer: { width: widthPerWidth(65), marginRight: 15 },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 10
  },
  avatar: (isConnected) => ({
    marginRight: 10,
    borderWidth: 3,
    borderColor: isConnected ? 'green' : 'red',
  }),
  logoutIcon: { fontSize: 25 },
});
