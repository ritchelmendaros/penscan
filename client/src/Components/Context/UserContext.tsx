import React, { createContext, useContext, ReactNode, useState } from 'react';

// interface
import { CurrUser } from '../Interface/CurrUser';

interface CurrUserContextType {
    user: CurrUser | undefined;
    userType: string; // this is irrelevant if the CurrUser is fully implemented
    setUser: (user: CurrUser) => void;
    setUserType: (userType: string) => void;
}

interface CurrUserProviderProps {
    children: ReactNode;
}

const CurrUserContext = createContext<CurrUserContextType | undefined>(
    undefined,
);

const useCurrUser = () => {
    const context = useContext(CurrUserContext);
    if (context === undefined) {
        throw new Error('useCurrUser must be used within a CurrUserProvider');
    }
    return context;
};

const CurrUserProvider: React.FC<CurrUserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<CurrUser | undefined>(undefined);
    const [userType, setUserType] = useState('');

    return (
        <CurrUserContext.Provider
            value={{ user, setUser, userType, setUserType }}
        >
            {children}
        </CurrUserContext.Provider>
    );
};

export { CurrUserProvider, useCurrUser };
