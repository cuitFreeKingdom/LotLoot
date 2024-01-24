import request from './request';

export const getFriendList = async (address: string) => {
  return request({
    url: '/getFriendList',
    method: 'GET',
    params: {
      address
    }
  })
}

export const addFriend = async (data: {
  address: string,
  friendAddress: string,
  notes: string
}) => {
  return request({
    url: '/addFriend',
    method: 'POST',
    data: data
  })
}

export const deleteFriend = async (data: {
  address: string,
  friendAddress: string
}) => {
  return request({
    url: '/deleteFriend',
    method: 'DELETE',
    data: data
  })
}

export const updateFriendNotes = async (data: {
  address: string,
  friendAddress: string,
  notes: string
}) => {
  return request({
    url: '/updateFriendNotes',
    method: 'post',
    data: data
  })
}