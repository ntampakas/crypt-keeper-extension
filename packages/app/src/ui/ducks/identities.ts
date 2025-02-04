/* eslint-disable no-param-reassign */
import { RPCAction } from "@cryptkeeperzk/providers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import deepEqual from "fast-deep-equal";

import {
  HistorySettings,
  ICreateIdentityUiArgs,
  IdentityData,
  Operation,
  ConnectedIdentity,
  ConnectIdentityArgs,
  ICreateIdentityRequestArgs,
} from "@src/types";
import postMessage from "@src/util/postMessage";

import type { TypedThunk } from "@src/ui/store/configureAppStore";

import { useAppSelector } from "./hooks";

export interface IdentitiesState {
  identities: IdentityData[];
  operations: Operation[];
  requestPending: boolean;
  connected: ConnectedIdentity; // This aim to be a short-term solution to the integration with Zkitter
  settings?: HistorySettings;
}

const initialState: IdentitiesState = {
  identities: [],
  operations: [],
  settings: undefined,
  requestPending: false,
  connected: {
    commitment: "",
    web2Provider: "",
    host: "",
  },
};

const identitiesSlice = createSlice({
  name: "identities",
  initialState,
  reducers: {
    setConnectedIdentity: (state: IdentitiesState, action: PayloadAction<ConnectedIdentity>) => {
      state.connected = {
        commitment: action.payload.commitment,
        web2Provider: action.payload.web2Provider,
        host: action.payload.host,
      };
    },

    setIdentityRequestPending: (state: IdentitiesState, action: PayloadAction<boolean>) => {
      state.requestPending = action.payload;
    },

    setIdentities: (state: IdentitiesState, action: PayloadAction<IdentityData[]>) => {
      state.identities = action.payload;
    },

    setOperations: (state: IdentitiesState, action: PayloadAction<Operation[]>) => {
      state.operations = action.payload;
    },

    setSettings: (state: IdentitiesState, action: PayloadAction<HistorySettings>) => {
      state.settings = action.payload;
    },
  },
});

export const { setConnectedIdentity, setIdentities, setIdentityRequestPending, setOperations, setSettings } =
  identitiesSlice.actions;

export const createIdentityRequest =
  ({ host }: ICreateIdentityRequestArgs) =>
  async (): Promise<void> => {
    await postMessage({
      method: RPCAction.CREATE_IDENTITY_REQUEST,
      payload: {
        host,
      },
    });
  };

export const createIdentity =
  ({ walletType, strategy, messageSignature, groups, host, options }: ICreateIdentityUiArgs) =>
  async (): Promise<string | undefined> =>
    postMessage({
      method: RPCAction.CREATE_IDENTITY,
      payload: {
        strategy,
        walletType,
        messageSignature,
        groups,
        host,
        options,
      },
    });

export const connectIdentity =
  ({ identityCommitment, host }: ConnectIdentityArgs) =>
  async (): Promise<boolean> =>
    postMessage({
      method: RPCAction.CONNECT_IDENTITY,
      payload: {
        identityCommitment,
        host,
      },
    });

export const setIdentityName = (identityCommitment: string, name: string) => async (): Promise<boolean> =>
  postMessage({
    method: RPCAction.SET_IDENTITY_NAME,
    payload: {
      identityCommitment,
      name,
    },
  });

export const deleteIdentity = (identityCommitment: string) => async (): Promise<boolean> =>
  postMessage({
    method: RPCAction.DELETE_IDENTITY,
    payload: {
      identityCommitment,
    },
  });

export const deleteAllIdentities = () => async (): Promise<boolean> =>
  postMessage({
    method: RPCAction.DELETE_ALL_IDENTITIES,
  });

export const fetchIdentities = (): TypedThunk => async (dispatch) => {
  const data = await postMessage<IdentityData[]>({ method: RPCAction.GET_IDENTITIES });
  const { commitment, web2Provider, host } = await postMessage<ConnectedIdentity>({
    method: RPCAction.GET_CONNECTED_IDENTITY_DATA,
  });
  dispatch(setIdentities(data));
  dispatch(
    setConnectedIdentity({
      commitment,
      web2Provider,
      host,
    }),
  );
};

export const fetchHistory = (): TypedThunk<Promise<void>> => async (dispatch) => {
  const { operations, settings } = await postMessage<{ operations: Operation[]; settings: HistorySettings }>({
    method: RPCAction.LOAD_IDENTITY_HISTORY,
  });
  dispatch(setOperations(operations));
  dispatch(setSettings(settings));
};

export const getHistory = (): TypedThunk => async (dispatch) => {
  const operations = await postMessage<Operation[]>({ method: RPCAction.GET_IDENTITY_HISTORY });
  dispatch(setOperations(operations));
};

export const deleteHistoryOperation =
  (id: string): TypedThunk<Promise<void>> =>
  async (dispatch) => {
    const operations = await postMessage<Operation[]>({ method: RPCAction.DELETE_HISTORY_OPERATION, payload: id });
    dispatch(setOperations(operations));
  };

export const clearHistory = (): TypedThunk<Promise<void>> => async (dispatch) => {
  await postMessage<Operation[]>({ method: RPCAction.DELETE_ALL_HISTORY_OPERATIONS });
  dispatch(setOperations([]));
};

export const enableHistory =
  (isEnabled: boolean): TypedThunk<Promise<void>> =>
  async (dispatch) => {
    await postMessage<HistorySettings>({ method: RPCAction.ENABLE_OPERATION_HISTORY, payload: isEnabled });
    dispatch(setSettings({ isEnabled }));
  };

export const useIdentities = (): IdentityData[] => useAppSelector((state) => state.identities.identities, deepEqual);

export const useLinkedIdentities = (host: string): IdentityData[] =>
  useAppSelector(
    (state) => state.identities.identities.filter((identity) => identity.metadata.host === host),
    deepEqual,
  );

export const useUnlinkedIdentities = (): IdentityData[] =>
  useAppSelector((state) => state.identities.identities.filter((identity) => !identity.metadata.host), deepEqual);

export const useConnectedIdentity = (): IdentityData | undefined =>
  useAppSelector((state) => {
    const { identities, connected } = state.identities;
    return identities.find(({ commitment }) => commitment === connected.commitment);
  }, deepEqual);

export const useIdentityRequestPending = (): boolean =>
  useAppSelector((state) => state.identities.requestPending, deepEqual);

export const useIdentityOperations = (): Operation[] =>
  useAppSelector((state) => state.identities.operations, deepEqual);

export const useHistorySettings = (): HistorySettings | undefined =>
  useAppSelector((state) => state.identities.settings, deepEqual);

export default identitiesSlice.reducer;
