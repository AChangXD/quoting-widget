'use client';
import React, { createContext, useContext, useState } from 'react';
import { Rfq } from '@/app/api/rfq/types';

export type RfqContextType = {
  selectedRfq: Rfq | undefined;
  setSelectedRfq: React.Dispatch<React.SetStateAction<Rfq | undefined>>;
  rfqToCreateQuoteFor: Rfq | undefined;
  setRfqToCreateQuoteFor: React.Dispatch<React.SetStateAction<Rfq | undefined>>;
};
export const RfqContext = createContext<RfqContextType>(null!);

const RfqContextProvider = ({ children }: { children: React.ReactNode }) => {
  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */
  const [selectedRfq, setSelectedRfq] = useState<Rfq | undefined>(undefined);

  const [rfqToCreateQuoteFor, setRfqToCreateQuoteFor] = useState<
    Rfq | undefined
  >(undefined);

  /* -------------------------------------------------------------------------- */
  /*                               Context Values                               */
  /* -------------------------------------------------------------------------- */
  const value = {
    selectedRfq,
    setSelectedRfq,
    rfqToCreateQuoteFor,
    setRfqToCreateQuoteFor,
  };

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
};

export default RfqContextProvider;
