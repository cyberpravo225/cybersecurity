(function () {
  const SUPABASE_URL = 'https://vpnxkfpwmieerfaqijot.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwbnhrZnB3bWllZXJmYXFpam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzQ0NTIsImV4cCI6MjA5MDgxMDQ1Mn0.ImmCQUziNbBOkwZ2u3eaJu2DrLTmaKyWvUttUKKfckg';
  const AUTH_LOCAL_KEY = 'cyber_auth_local';
  const AUTH_SESSION_KEY = 'cyber_auth_session';

  function createClient(remember = true) {
    if (!window.supabase?.createClient) {
      throw new Error('Библиотека Supabase не загрузилась.');
    }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: remember ? localStorage : sessionStorage,
        storageKey: remember ? AUTH_LOCAL_KEY : AUTH_SESSION_KEY
      }
    });
  }

  async function getCurrentSession() {
    for (const remember of [true, false]) {
      const sb = createClient(remember);
      const { data, error } = await sb.auth.getSession();
      if (error) continue;
      if (data?.session?.user) return { sb, user: data.session.user };
    }
    return null;
  }

  async function getProfile(sb, userId) {
    const { data, error } = await sb
      .from('profiles')
      .select('username,birth_date')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  function calculateAgeFromBirthDate(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return age >= 0 ? age : null;
  }

  function getAgeGroup(age) {
    if (age === null || age === undefined) return null;
    if (age < 10) return 'blocked';
    if (age < 16) return '10-16';
    return '16+';
  }

  async function requireAuth({ redirectTo = 'auth.html', message = 'Требуется авторизация.' } = {}) {
    const session = await getCurrentSession();
    if (session?.user) return session;
    const target = `${redirectTo}?reason=${encodeURIComponent(message)}&next=${encodeURIComponent(location.pathname + location.hash)}`;
    window.location.replace(target);
    throw new Error(message);
  }

  window.CyberSupabaseAuth = {
    createClient,
    getCurrentSession,
    getProfile,
    calculateAgeFromBirthDate,
    getAgeGroup,
    requireAuth
  };
})();
