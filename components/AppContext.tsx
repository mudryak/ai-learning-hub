"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { nextStatus, type ReadStatus } from "@/lib/storage";

export interface ProgressEntry {
  status: ReadStatus;
  rating: number;
}

interface AppContextValue {
  user: User | null;
  progress: Record<string, ProgressEntry>;
  progressLoaded: boolean;
  updateStatus: (resourceId: string, status: ReadStatus) => Promise<void>;
  updateRating: (resourceId: string, rating: number) => Promise<void>;
  cycleStatus: (resourceId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextValue>({
  user: null,
  progress: {},
  progressLoaded: false,
  updateStatus: async () => {},
  updateRating: async () => {},
  cycleStatus: async () => {},
  signOut: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const supabase = createClient();

  async function loadProgress(userId: string) {
    const { data } = await supabase
      .from("user_progress")
      .select("resource_id, status, rating")
      .eq("user_id", userId);

    const map: Record<string, ProgressEntry> = {};
    for (const row of data ?? []) {
      map[row.resource_id] = {
        status: (row.status ?? "unread") as ReadStatus,
        rating: row.rating ?? 0,
      };
    }
    setProgress(map);
    setProgressLoaded(true);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        loadProgress(data.user.id);
      } else {
        setProgressLoaded(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        loadProgress(newUser.id);
      } else {
        setProgress({});
        setProgressLoaded(true);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = useCallback(
    async (resourceId: string, status: ReadStatus) => {
      if (!user) return;
      setProgress((prev) => ({
        ...prev,
        [resourceId]: { ...(prev[resourceId] ?? { rating: 0 }), status },
      }));
      await supabase.from("user_progress").upsert(
        { user_id: user.id, resource_id: resourceId, status, updated_at: new Date().toISOString() },
        { onConflict: "user_id,resource_id" }
      );
    },
    [user, supabase]
  );

  const updateRating = useCallback(
    async (resourceId: string, rating: number) => {
      if (!user) return;
      setProgress((prev) => ({
        ...prev,
        [resourceId]: { ...(prev[resourceId] ?? { status: "unread" }), rating },
      }));
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          resource_id: resourceId,
          rating: rating || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,resource_id" }
      );
    },
    [user, supabase]
  );

  const cycleStatus = useCallback(
    async (resourceId: string) => {
      const current = progress[resourceId]?.status ?? "unread";
      await updateStatus(resourceId, nextStatus(current));
    },
    [progress, updateStatus]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return (
    <AppContext.Provider
      value={{ user, progress, progressLoaded, updateStatus, updateRating, cycleStatus, signOut }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
