import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { AccessList, SubsetData } from 'pools-ts';
import { accessListAtom, blockedAddressesAtom } from '../state';
import { useCommitments, useDebounce, useNote } from '.';
import { getAddress } from 'ethers/lib/utils';

export function useAccessList() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blockedAddresses] = useAtom(blockedAddressesAtom);
  const [needsSync, setNeedsSync] = useState(false);
  const { commitment: currentCommitment } = useNote();
  const [accessList, setAccessList] = useAtom(accessListAtom);
  const { commitments } = useCommitments();
  const debouncedCommitments = useDebounce(commitments, 500);
  const initializedRef = useRef(false);

  // Apply users blockList to subsetData
  const subsetData: SubsetData = useMemo(() => {
    const blockedAddressesArray =
      blockedAddresses ? blockedAddresses.split(',').map(address => address.trim()) : [];
    const blockedAddressSet = new Set(blockedAddressesArray);
    const subset = new Array(debouncedCommitments.length);
    for (let i = 0; i < subset.length; i++) {
      const senderAddress = getAddress(debouncedCommitments[i].sender);
      const commitment = debouncedCommitments[i].commitment;
      subset[i] = (blockedAddressSet.has(senderAddress) && !currentCommitment.eq(commitment)) ? 1 : 0;
    }
    return subset;
  }, [blockedAddresses, debouncedCommitments, currentCommitment]);

  const initializeAccessList = useCallback(() => {
    setLoading(true);
    setProgress(0);

    if (process.env.NODE_ENV === 'production') {
      // Initialize accessList using service worker in production mode
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'initializeAccessList',
          payload: { subsetData }
        });
      }
      // Function to handle incoming messages from service worker
      const handleMessage = (event: any) => {
        const { type, serializedAccessList, progress: progressUpdate } = event.data;
        if (type === 'accessListInitialized') {
          const accessList = AccessList.fromJSON(serializedAccessList);
          setAccessList(accessList);
          setLoading(false);
        } else if (type === 'accessListProgress') {
          // Update progress state with progress update from service worker
          setProgress(progressUpdate);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleMessage);
    
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      };

    } else {
      // Initialize accessList directly in development mode
      setLoading(true);
      // Simulating an async operation to avoid blocking the main thread
      setTimeout(() => {
        const _accessList = new AccessList({
          accessType: 'blocklist',
          subsetData
        });
        setAccessList(_accessList);
        setLoading(false);
      }, 0);
    }
  }, [subsetData, setAccessList]);

  // Initialize accessList
  useEffect(() => {
    if (!initializedRef.current && accessList.length === 0 && debouncedCommitments.length > 0) {
      initializeAccessList();
      initializedRef.current = true;
    }
  }, [accessList.length, debouncedCommitments.length, initializeAccessList]);

  // Extend accessList
  useEffect(() => {
    if (accessList.length > 0 && debouncedCommitments.length > accessList.length) {
      const startIndex = accessList.length;
      const newSubsetData = subsetData.slice(accessList.length);
      accessList.extend(debouncedCommitments.length);
      accessList.setWindow(startIndex, debouncedCommitments.length, newSubsetData);
    }
  }, [accessList.length, debouncedCommitments.length, subsetData]);

  // Update blocklist changes
  useEffect(() => {
    if (needsSync && accessList.length > 0 && !_.isEqual(accessList.getWindow(0, accessList.length), subsetData)) {
      console.log(`accesslist detected changes in subset data`)
      const updatedAccessList = AccessList.fromJSON(accessList.toJSON());
      updatedAccessList.setWindow(0, accessList.length, subsetData);
      setAccessList(updatedAccessList);
      setNeedsSync(false);
    }
  }, [subsetData]);

  return { accessList, setAccessList, initializeAccessList, loading, progress, setNeedsSync };
}
