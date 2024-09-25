import { Database } from '@/types/supabase';

type BaseMessage = Database['public']['Tables']['channels_messages']['Row'] & {
	profiles: Database['public']['Tables']['profiles']['Row'] | null;
};
export type StoreMessage = BaseMessage & {
	repliedMessage?: BaseMessage | null;
};
export interface InitialState {
	messages: StoreMessage[] | null;
}
