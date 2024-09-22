import { Database } from '@/types/supabase';

export type StoreChannel = Database['public']['Tables']['channels']['Row'] & {
	channels_members: Database['public']['Tables']['channels_members']['Row'][];
};
export interface InitialState {
	channels: StoreChannel[] | null;
}
