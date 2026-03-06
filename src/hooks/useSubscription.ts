import { useQuery } from '@tanstack/react-query';
import Purchases from '@revenuecat/purchases-react-native';
import type { CustomerInfo } from '@revenuecat/purchases-react-native';

export const SUBSCRIPTION_QUERY_KEY = (userId: string) =>
    ['subscription', userId] as const;

export interface SubscriptionState {
    isPremium: boolean;
    customerInfo: CustomerInfo | null;
}

export function useSubscription(userId: string | undefined) {
    return useQuery<SubscriptionState, Error>({
        queryKey: SUBSCRIPTION_QUERY_KEY(userId ?? ''),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000, // 5 min
        queryFn: async (): Promise<SubscriptionState> => {
            try {
                const customerInfo = await Purchases.getCustomerInfo();
                const isPremium = Object.keys(customerInfo.entitlements.active).length > 0;
                return { isPremium, customerInfo };
            } catch {
                return { isPremium: false, customerInfo: null };
            }
        },
    });
}
