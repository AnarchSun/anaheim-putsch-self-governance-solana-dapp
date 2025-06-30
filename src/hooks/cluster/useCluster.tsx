// hooks/useCluster.ts
// Si ClusterDebugger est un composant React
export function ClusterDebugger() {
  // ton code de debug ici
  return <div>Debug Cluster en cours...</div>
}

// Dans un composant parent ou page
export default function Page() {
  return (
    <div>
      <ClusterDebugger />
    {/* autres composants */}
    </div>
  )
}
