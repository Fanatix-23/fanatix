import {
  ChatStatus,
  CONSTANTS,
  GroupCreationOptions,
  IMessageIPFS,
  ManageGroupOptions,
  Message,
  MessageObj,
  PushAPI,
  Rules,
  space,
  SpaceIFeeds,
  ConditionType,
} from "@pushprotocol/restapi"
import { PushStream } from "@pushprotocol/restapi/src/lib/pushstream/PushStream"
import { ethers } from "ethers"
import React, { useEffect, useState } from "react"

interface IPushContext {
  user: PushAPI | null
  stream: PushStream | null
  initialize: () => Promise<void>

  chat: {
    chatOverview: () => void
    fetchChats: (recipient: string) => Promise<{
      latest: {}
      history: IMessageIPFS[]
    } | null>
  }
  message: {
    sendMessage: (
      recipient: string,
      message: string
    ) => Promise<{
      cid: string
      link: string
      messageObj: string | MessageObj | undefined
      chatId: string
    } | null>
    sendCustomMessage: (
      recipient: string,
      option: Message
    ) => Promise<{
      cid: string
      link: string
      messageObj: string | MessageObj | undefined
      chatId: string
    } | null>
  }

  group: {
    createGroup: (
      name: string,
      options: GroupCreationOptions
    ) => Promise<{
      metadata: {
        groupCreator: string
        groupDescription: string
        groupImage: string | null
        groupName: string
        isPublic: boolean
        groupType?: string
      }
      chatId: string
      status?: ChatStatus | null
    } | null>
    joinGroup: (chatId: string) => Promise<{
      chatId: string
      status: ChatStatus | null | undefined
    } | null>
    leaveGroup: (chatId: string) => Promise<{
      chatId: string
      status: ChatStatus | null | undefined
    } | null>
    findMyPermissionsInGroup: (chatId: string) => Promise<{
      rules: Rules | undefined
      entry: boolean
      chat: boolean
    } | null>
    groupInfo: (chatId: string) => Promise<{
      metadata: {
        groupCreator: string
        groupDescription: string
        groupImage: string | null
        groupName: string
        isPublic: boolean
        groupType?: string
      }
      chatId: string
      status?: ChatStatus | null
    } | null>
    updateGroupInfo: (
      chatId: string,
      options: GroupCreationOptions
    ) => Promise<{
      metadata: {
        groupCreator: string
        groupDescription: string
        groupImage: string | null
        groupName: string
        isPublic: boolean
        groupType?: string
      }
      chatId: string
      status?: ChatStatus | null
    } | null>
    addMemberToGroup: (
      chatId: string,
      options: ManageGroupOptions
    ) => Promise<{
      chatId: string
      status: ChatStatus | null | undefined
    } | null>
    removeMemberFromGroup: (
      chatId: string,
      options: ManageGroupOptions
    ) => Promise<{
      chatId: string
      status: ChatStatus | null | undefined
    } | null>
  }

  space: {
    createSpace: (params: { name?: string; desc?: string }) => Promise<string | null>
    joinSpace: (spaceId: string) => Promise<boolean | null>
    getSpaceDetails: (spaceId: string) => Promise<{
      spaceName: string
      spaceDescription: string
      inviteeDetails:
        | {
            [key: string]: unknown
          }
        | undefined
      spaceCreator: string
      scheduleAt: Date
      scheduleEnd: Date
      isPublic: boolean
    }>
    startSpace: (spaceId: string) => Promise<boolean | null>
    endSpace: (spaceId: string) => Promise<boolean | null>
    addListenerToSpace: (spaceId: string, listener: string) => Promise<boolean | null>
    removeListenerFromSpace: (spaceId: string, listener: string) => Promise<boolean | null>
    fetchAllSpaces: (account: string) => Promise<SpaceIFeeds[] | null>
  }
}
interface IPushProvider {
  children: React.ReactNode
}

const Context = React.createContext<IPushContext>({} as IPushContext)

const PushProvider = ({ children }: IPushProvider) => {
  const [user, setUser] = useState<PushAPI | null>(null)
  const [stream, setStream] = useState<PushStream | null>(null)

  useEffect(() => {
    if (!stream) {
      return
    }

    const logMessage = async (message: string) => {
      console.log("message", message)
    }

    /**
     * CONSTANTS.STREAM.CHAT	Whenever a chat is received
     * CONSTANTS.STREAM.CHAT_OPS	Whenever a chat operation is received
     * CONSTANTS.STREAM.CONNECT	Whenever the stream establishes connection
     * CONSTANTS.STREAM.DISCONNECT	Whenever the stream gets disconnected
     */
    stream.on(CONSTANTS.STREAM.CHAT, logMessage)
    stream.on(CONSTANTS.STREAM.CHAT_OPS, logMessage)

    // Connect Stream
    stream.connect()

    return () => {
      stream.off(CONSTANTS.STREAM.CHAT, logMessage)
      stream.off(CONSTANTS.STREAM.CHAT_OPS, logMessage)
      stream.disconnect()
    }
  }, [stream])

  const initialize = async () => {
    // TODO: Replace with actual signer
    const signer = ethers.Wallet.createRandom()

    const _user = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING })
    setUser(_user)

    const _stream = await _user.initStream([CONSTANTS.STREAM.CHAT])
    setStream(_stream)
  }

  const chatOverview = () => {
    if (!user) {
      return null
    }

    const chats = user.chat.list("CHATS")
    const requests = user.chat.list("REQUESTS")

    return {
      chats,
      requests,
    }
  }

  const fetchChats = async (recipient: string) => {
    if (!user) {
      return null
    }

    const latest = await user.chat.latest(recipient)
    const history = await user.chat.history(recipient)

    return {
      latest,
      history,
    }
  }

  const sendMessage = async (recipient: string, message: string) => {
    if (!user) {
      return null
    }

    const response = await user.chat.send(recipient, {
      content: message,
      type: "Text",
    })

    const { cid, link, messageObj, chatId } = response

    return {
      cid,
      link,
      messageObj,
      chatId,
    }
  }

  //* Ref: https://push.org/docs/chat/message-types
  const sendCustomMessage = async (recipient: string, option: Message) => {
    if (!user) {
      return null
    }

    const response = await user.chat.send(recipient, option)

    const { cid, link, messageObj, chatId } = response

    return {
      cid,
      link,
      messageObj,
      chatId,
    }
  }

  //! Groups
  // Token gating: https://push.org/docs/chat/build/conditional-rules-for-group/
  const createGroup = async (name: string, options: GroupCreationOptions) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.create(name, options)

    const {
      chatId,
      status,
      groupCreator,
      groupDescription,
      groupImage,
      groupName,
      isPublic,
      groupType,
    } = response

    return {
      metadata: {
        groupCreator,
        groupDescription,
        groupImage,
        groupName,
        isPublic,
        groupType,
      },
      chatId,
      status,
    }
  }

  // NOTE: Call this when a user has minted a token related to a creator to add them to the creator's group
  const joinGroup = async (chatId: string) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.join(chatId)

    const { status } = response

    return {
      chatId,
      status,
    }
  }

  // NOTE: Call this when a user has burned or transfered the token related to a creator to remove them from the creator's group
  const leaveGroup = async (chatId: string) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.leave(chatId)

    const { status } = response

    return {
      chatId,
      status,
    }
  }

  const findMyPermissionsInGroup = async (chatId: string) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.permissions(chatId)

    const { entry, rules, chat } = response

    return {
      rules,
      entry,
      chat,
    }
  }

  const groupInfo = async (chatId: string) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.info(chatId)

    const {
      chatId: _chatId,
      groupCreator,
      groupDescription,
      groupImage,
      groupName,
      isPublic,
      groupType,
      status,
    } = response

    return {
      metadata: {
        groupCreator,
        groupDescription,
        groupImage,
        groupName,
        isPublic,
        groupType,
      },
      chatId: _chatId,
      status,
    }
  }

  const updateGroupInfo = async (chatId: string, options: GroupCreationOptions) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.update(chatId, options)

    const {
      chatId: _chatId,
      groupCreator,
      groupDescription,
      groupImage,
      groupName,
      isPublic,
      groupType,
      status,
    } = response

    return {
      metadata: {
        groupCreator,
        groupDescription,
        groupImage,
        groupName,
        isPublic,
        groupType,
      },
      chatId: _chatId,
      status,
    }
  }

  const addMemberToGroup = async (chatId: string, options: ManageGroupOptions) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.add(chatId, options)

    const { status } = response

    return {
      chatId,
      status,
    }
  }

  const removeMemberFromGroup = async (chatId: string, options: ManageGroupOptions) => {
    if (!user) {
      return null
    }

    const response = await user.chat.group.remove(chatId, options)

    const { status } = response

    return {
      chatId,
      status,
    }
  }

  /**
   * NOTE: Push Spaces
   */
  const createSpace = async (params: { name?: string; desc?: string }) => {
    if (!user) {
      return null
    }

    // const signer: viemSignerType

    const { name, desc } = params

    const response = await space.create({
      spaceName: name ?? "Creator space",
      spaceDescription: desc ?? "",

      // TODO: Filter speakers to creator and Filter listners to all the users
      speakers: ["0x3829E53A15856d1846e1b52d3Bdf5839705c29e5"],
      listeners: [
        "0x9e60c47edF21fa5e5Af33347680B3971F2FfD464",
        "0x3829E53A15856d1846e1b52d3Bdf5839705c29e5",
      ],

      isPublic: true,
      // TODO: Add a valid viem Signer
      signer: null,
      env: CONSTANTS.ENV.STAGING,
      // Decrypt the private key
      // TODO: Add a valid pgpDecryptedPvtKey: https://www.npmjs.com/package/@pushprotocol/restapi#to-create-a-space
      pgpPrivateKey: pgpDecryptedPvtKey,
      scheduleAt: new Date("2024-07-15T14:48:00.000Z"),
      scheduleEnd: new Date("2024-07-15T15:48:00.000Z"),

      // Token gating
      /**
        contract?: string;
        amount?: number;
        decimals?: number;
        guildId?: string;
        guildRoleId?: string;
        guildRoleAction?: 'all' | 'any';
        url?: string;
        comparison?: '>' | '<' | '>=' | '<=' | '==' | '!=';
       */
      rules: {
        entry: {
          conditions: [
            {
              any: [
                {
                  type: ConditionType.PUSH,
                  // type: "PUSH",
                  category: "ERC1155",
                  subcategory: "holder",
                  data: {
                    contract: "eip155:5:0x2b9bE9259a4F5Ba6344c1b1c07911539642a2D33",
                    amount: 1000,
                    decimals: 18,
                  },
                },
              ],
            },
          ],
        },
      },
    })

    const { spaceId } = response

    return spaceId
  }

  const joinSpace = async (spaceId: string) => {
    if (!user) {
      return null
    }

    const response = await space.getAccess({
      spaceId: spaceId,
      // TODO: User address
      did: "",
      env: CONSTANTS.ENV.STAGING,
    })

    const { entry } = response

    return entry
  }

  const getSpaceDetails = async (spaceId: string) => {
    const response = await space.get({
      spaceId: spaceId,
      env: CONSTANTS.ENV.STAGING,
    })

    const {
      spaceName,
      spaceDescription,
      inviteeDetails,
      spaceCreator,
      scheduleAt,
      scheduleEnd,
      isPublic,
    } = response

    return {
      spaceId,
      spaceName,
      spaceDescription,
      inviteeDetails,
      spaceCreator,
      scheduleAt,
      scheduleEnd,
      isPublic,
    }
  }

  const startSpace = async (spaceId: string) => {
    return null
  }

  const endSpace = async (spaceId: string) => {
    return null
  }

  const addListenerToSpace = async (spaceId: string, listener: string) => {
    await space.addListeners({
      spaceId,
      listeners: [
        `eip155:0x65585D8D2475194A26C0B187e6bED494E5D68d5F`,
        `eip155:0xE99F29C1b2A658a478E7766D5A2bB28322326C45`,
      ],
      signer: signer,
      pgpPrivateKey: pgpDecrpyptedPvtKey,
      env: CONSTANTS.ENV.STAGING,
    })

    return true
  }

  const removeListenerFromSpace = async (spaceId: string, listener: string) => {
    await space.removeListeners({
      spaceId,
      listeners: [
        `eip155:0xB12869BD3a0F9109222D67ba71e8b109B46908f9`,
        `eip155:0x2E3af36E1aC6EEEA2C0d59E43Be1926aBB9eE0BD`,
      ],
      // TODO: Add a valid signer
      signer: null,
      // TODO: Add a valid pgpDecryptedPvtKey
      pgpPrivateKey: "",
      env: CONSTANTS.ENV.STAGING,
    })

    return true
  }

  const fetchAllSpaces = async (account: string) => {
    const spaces = await space.spaces({
      account: account,
      pgpPrivateKey: "",
      toDecrypt: true,
      env: CONSTANTS.ENV.STAGING,
    })

    return spaces
  }

  return (
    <Context.Provider
      value={{
        user,
        stream,
        initialize,
        chat: {
          chatOverview,
          fetchChats,
        },
        message: {
          sendMessage,
          sendCustomMessage,
        },
        group: {
          createGroup,
          joinGroup,
          leaveGroup,
          findMyPermissionsInGroup,
          groupInfo,
          updateGroupInfo,
          addMemberToGroup,
          removeMemberFromGroup,
        },

        space: {
          createSpace,
          joinSpace,
          getSpaceDetails,
          startSpace,
          endSpace,
          addListenerToSpace,
          removeListenerFromSpace,
          fetchAllSpaces,
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

const usePushContext = () => {
  const c = React.useContext(Context)

  if (c === undefined) {
    throw new Error("usePushContext must be used within a PushProvider")
  }

  return c
}

export { PushProvider, usePushContext }
