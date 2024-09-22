import { Database } from '@/types/supabase';

export type RelatedChannels = Database['public']['Tables']['channels']['Row'] & {
	channels_members: Database['public']['Tables']['channels_members']['Row'][];
};
export interface InitialState {
	channels: Database['public']['Tables']['channels']['Row'][] | null;
	relatedChannels: RelatedChannels[] | null;
}
