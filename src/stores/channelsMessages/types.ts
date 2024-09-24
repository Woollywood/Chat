import { Database } from '@/types/supabase';

export type StoreMessage = Database['public']['Tables']['channels_messages']['Row'] & {
	profiles: Database['public']['Tables']['profiles']['Row'] | null;
};
export interface InitialState {
	messages: StoreMessage[] | null;
}
