import { Session } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';

export interface InitialState {
	isComplete: boolean;
	profile: Database['public']['Tables']['profiles']['Row'] | null;
	activity: Database['public']['Tables']['user_activity']['Row'] | null;
	role: Database['public']['Tables']['user_roles']['Row'] | null;
	session: Session | null;
}
