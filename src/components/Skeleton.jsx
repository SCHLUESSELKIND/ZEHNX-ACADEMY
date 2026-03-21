const Z = { g100: "#F3F4F6", g200: "#E5E7EB", w: "#FFFFFF" };

function Skeleton({ w = "100%", h = 16, r = 8, mb = 8 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, marginBottom: mb,
      background: `linear-gradient(90deg, ${Z.g100} 25%, ${Z.g200} 50%, ${Z.g100} 75%)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

export function SprintCardSkeleton() {
  return (
    <div style={{ background: Z.w, borderRadius: 14, padding: 16, border: `1px solid ${Z.g200}`, marginBottom: 8 }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ display: "flex", gap: 12 }}>
        <Skeleton w={40} h={40} r={10} mb={0} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <Skeleton w={32} h={18} r={6} mb={0} />
            <Skeleton w={80} h={18} r={6} mb={0} />
          </div>
          <Skeleton w="70%" h={16} />
          <Skeleton w="90%" h={14} />
          <Skeleton w="40%" h={12} />
        </div>
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 80px" }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <Skeleton w={200} h={28} mb={4} />
      <Skeleton w={300} h={14} mb={20} />
      <Skeleton w="100%" h={44} r={12} mb={12} />
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[80, 60, 60, 60, 60, 60].map((w, i) => <Skeleton key={i} w={w} h={34} r={20} mb={0} />)}
      </div>
      <Skeleton w={120} h={12} mb={16} />
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <Skeleton w={32} h={22} r={6} mb={0} />
        <Skeleton w={80} h={22} r={6} mb={0} />
      </div>
      {[1,2,3,4,5].map(i => <SprintCardSkeleton key={i} />)}
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 80px" }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <Skeleton w={100} h={34} r={10} mb={16} />
      <Skeleton w="60%" h={24} mb={4} />
      <Skeleton w="30%" h={14} mb={16} />
      <Skeleton w="100%" h={6} r={3} mb={16} />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[1,2,3,4,5].map(i => <Skeleton key={i} w={70} h={34} r={20} mb={0} />)}
      </div>
      <div style={{ background: Z.w, borderRadius: 14, padding: 16, border: `1px solid ${Z.g200}` }}>
        <Skeleton w={60} h={20} r={6} mb={12} />
        <Skeleton w="80%" h={20} mb={4} />
        <Skeleton w="40%" h={14} mb={16} />
        <Skeleton w="100%" h={16} mb={6} />
        <Skeleton w="95%" h={16} mb={6} />
        <Skeleton w="100%" h={16} mb={6} />
        <Skeleton w="70%" h={16} mb={6} />
        <Skeleton w="100%" h={16} mb={16} />
        <Skeleton w="100%" h={16} mb={6} />
        <Skeleton w="85%" h={16} mb={6} />
      </div>
    </div>
  );
}

export default Skeleton;
