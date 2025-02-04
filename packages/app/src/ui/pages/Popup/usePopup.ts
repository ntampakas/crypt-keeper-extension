import log from "loglevel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Paths } from "@src/constants";
import { fetchStatus, getSelectedAccount, useAppStatus } from "@src/ui/ducks/app";
import { useAppDispatch } from "@src/ui/ducks/hooks";
import { fetchPendingRequests, usePendingRequests } from "@src/ui/ducks/requests";
import { useCryptKeeperWallet, useEthWallet } from "@src/ui/hooks/wallet";

export interface IUsePopupData {
  isLoading: boolean;
}

const REDIRECT_PATHS: Record<string, Paths> = {
  [Paths.CREATE_IDENTITY]: Paths.CREATE_IDENTITY,
  [Paths.CONNECT_IDENTITY]: Paths.CONNECT_IDENTITY,
};

const COMMON_PATHS = [Paths.RECOVER, Paths.RESET_PASSWORD];

export const usePopup = (): IUsePopupData => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const ethWallet = useEthWallet();
  const cryptKeeperWallet = useCryptKeeperWallet();
  const pendingRequests = usePendingRequests();
  const { isInitialized, isUnlocked, isMnemonicGenerated } = useAppStatus();
  const isShowRequestModal = pendingRequests.length > 0;

  const url = new URL(window.location.href.replace("#", ""));
  const redirectParam = url.searchParams.get("redirect");
  const redirect = redirectParam && REDIRECT_PATHS[redirectParam];
  const isCommonPath = useMemo(() => COMMON_PATHS.includes(location.pathname as Paths), [location.pathname]);

  const fetchData = useCallback(async () => {
    await Promise.all([dispatch(fetchStatus()), dispatch(fetchPendingRequests())]);

    if (isUnlocked && isMnemonicGenerated) {
      await dispatch(getSelectedAccount());
    }
  }, [isUnlocked, isMnemonicGenerated, dispatch]);

  useEffect(() => {
    if (isLoading || isCommonPath) {
      return;
    }

    if (!isInitialized) {
      navigate(Paths.ONBOARDING);
    } else if (!isUnlocked) {
      navigate(Paths.LOGIN);
    } else if (!isMnemonicGenerated) {
      navigate(Paths.GENERATE_MNEMONIC);
    } else if (isShowRequestModal) {
      navigate(Paths.REQUESTS);
    } else if (redirect) {
      url.searchParams.delete("redirect");
      navigate(`${redirect}?${url.searchParams.toString()}`);
    }
  }, [
    isLoading,
    isInitialized,
    isUnlocked,
    isShowRequestModal,
    isMnemonicGenerated,
    redirect,
    url.searchParams.toString(),
    isCommonPath,
    navigate,
  ]);

  useEffect(() => {
    setIsLoading(true);
    fetchData()
      .catch((error) => log.error(error))
      .finally(() => setIsLoading(false));
  }, [isUnlocked, fetchData, setIsLoading]);

  useEffect(() => {
    ethWallet.onConnectEagerly();
    cryptKeeperWallet.onConnectEagerly();
  }, [isUnlocked, isMnemonicGenerated, ethWallet.onConnectEagerly, cryptKeeperWallet.onConnectEagerly]);

  return {
    isLoading,
  };
};
