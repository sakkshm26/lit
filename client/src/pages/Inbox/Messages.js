import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  InboxMessage,
  ListItem2,
  ListItemSeparator,
  UserIcon,
} from '../../components';
import {AxiosContext} from '../../hooks/useAxios';

const Messages = ({navigation, remainingHints, setRemainingHints}) => {
  const [messages, setMessages] = useState([]);
  const {authAxios} = useContext(AxiosContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVoteId, setLastVoteId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [revealedMessages, setRevealedMessages] = useState(new Map());
  const [viewedMessages, setViewedMessages] = useState(new Map());

  const getInboxMessages = async (req, res) => {
    setLoading(true);
    if (hasMore) {
      try {
        const response = await authAxios.get(
          `/user/getlist/votes/for-user/${lastVoteId}`,
        );
        console.log(response.data.messages[0]);
        setRemainingHints(response.data.remaining_hints);
        if (response.data.messages.length < 20) setHasMore(false);
        setMessages(prev => [...prev, ...response.data.messages]);
        if (response.data.messages.length) {
          setLastVoteId(
            response.data.messages[response.data.messages.length - 1].id,
          );
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('Complete data fetched');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLastVoteId(null);
    setHasMore(true);
    try {
      const response = await authAxios.get(`/user/getlist/votes/for-user/null`);
      console.log(response.data);
      setRemainingHints(response.data.remaining_hints);
      if (response.data.messages.length < 20) setHasMore(false);
      setMessages(response.data.messages);
      if (response.data.messages.length) {
        setLastVoteId(
          response.data.messages[response.data.messages.length - 1].id,
        );
      }
    } catch (err) {
      console.log(err);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    DeviceEventEmitter.addListener('test', value => {
      if (value.type === 'reveal') {
        setRevealedMessages(map => new Map(map.set(value.index, true)));
      } else {
        setViewedMessages(map => new Map(map.set(value.index, true)));
      }
    });
    return () => {
      DeviceEventEmitter.removeAllListeners('test');
    };
  }, []);

  useEffect(() => {
    getInboxMessages();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rizz</Text>
      {!messages.length && !loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.header, {fontSize: 17, fontFamily: 'PlusJakartaSans-SemiBold'}]}>Nothing here yet</Text>
        </View>
      ) : messages.length || !loading ? (
        <View style={styles.container}>
          <FlatList
            nestedScrollEnabled
            data={messages}
            renderItem={({item, index}) => (
              <InboxMessage
                viewed={viewedMessages.get(index) || item.message.viewed}
                message={item.message.text}
                gender={item.message.gender}
                onPress={() =>
                  navigation.navigate('Message', {
                    poll: {
                      ...item.poll,
                      message: item.message.text,
                      remainingHints: remainingHints,
                    },
                    vote_id: item.message.id,
                    revealed: revealedMessages.get(index),
                    viewed: viewedMessages.get(index) || item.message.viewed,
                    index: index,
                  })
                }
              />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={() => getInboxMessages()}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            // ItemSeparatorComponent={<ListItemSeparator />}
          />
        </View>
      ) : (
        <ActivityIndicator style={{flex: 1}} size="small" color="#f55f45" />
      )}
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingHorizontal: '1%'
  },
  header: {
    color: 'white',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 20,
  },
});
