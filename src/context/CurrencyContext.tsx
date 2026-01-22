import React, { createContext, useContext, useState, useEffect } from 'react';

export type CountryCode = 'CO' | 'MX' | 'PE' | 'US' | 'AR' | 'CL';

interface CurrencyConfig {
    code: string;
    locale: string;
    symbol: string;
    name: string;
    flag: string;
}

const COUNTRIES: Record<CountryCode, CurrencyConfig> = {
    CO: { code: 'COP', locale: 'es-CO', symbol: '$', name: 'Colombia', flag: '🇨🇴' },
    MX: { code: 'MXN', locale: 'es-MX', symbol: '$', name: 'México', flag: '🇲🇽' },
    PE: { code: 'PEN', locale: 'es-PE', symbol: 'S/', name: 'Perú', flag: '🇵🇪' },
    US: { code: 'USD', locale: 'en-US', symbol: '$', name: 'Estados Unidos', flag: '🇺🇸' },
    AR: { code: 'ARS', locale: 'es-AR', symbol: '$', name: 'Argentina', flag: '🇦🇷' },
    CL: { code: 'CLP', locale: 'es-CL', symbol: '$', name: 'Chile', flag: '🇨🇱' },
};

interface CurrencyContextType {
    country: CountryCode;
    setCountry: (country: CountryCode) => void;
    formatCurrency: (value: number) => string;
    currencyInfo: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
    const [country, setCountryState] = useState<CountryCode>('CO');

    useEffect(() => {
        const savedCountry = localStorage.getItem('selectedCountry') as CountryCode;
        if (savedCountry && COUNTRIES[savedCountry]) {
            setCountryState(savedCountry);
        }
    }, []);

    const setCountry = (newCountry: CountryCode) => {
        setCountryState(newCountry);
        localStorage.setItem('selectedCountry', newCountry);
    };

    const formatCurrency = (value: number) => {
        const config = COUNTRIES[country];
        return new Intl.NumberFormat(config.locale, {
            style: 'currency',
            currency: config.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <CurrencyContext.Provider value={{
            country,
            setCountry,
            formatCurrency,
            currencyInfo: COUNTRIES[country]
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const AVAILABLE_COUNTRIES = Object.entries(COUNTRIES).map(([key, val]) => ({
    id: key as CountryCode,
    ...val
}));
