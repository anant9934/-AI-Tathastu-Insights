import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Box, 
  Eye, 
  GitBranch, 
  Server,
  Zap,
  RefreshCw
} from 'lucide-react';

/* =========================================================================
   1. MENTORMAZE CONSOLE
   Interactive Prerequisite Lattice & Socratic Kernel Debugger
   ========================================================================= */
export const MentorMazeConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'lattice' | 'sandbox'>('editor');

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-brand-stone-dark/80 dark:border-dark-border bg-[#0E1117] text-white font-mono text-xs shadow-2xl flex flex-col h-[460px]">
      {/* Console Chrome Header */}
      <div className="px-4 py-2.5 bg-[#161B22] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
          <span className="ml-2 text-white/50 text-[11px]">mentormaze-v3 // kernel_debugger.py</span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'editor' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            CUDA Kernel
          </button>
          <button
            onClick={() => setActiveTab('lattice')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'lattice' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Prerequisite DAG
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'sandbox' ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            gVisor Sandbox
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'editor' && (
        <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="text-white/40 text-[11px] mb-2">// Exercise: Correct Triton pointer arithmetic for irregular tensor strides</div>
            <pre className="text-white/90 leading-relaxed text-[12px] bg-black/40 p-3.5 rounded-xl border border-white/5 overflow-x-auto">
              <code>
{`@triton.jit
def fused_cross_entropy_kernel(
    logits_ptr, targets_ptr, loss_ptr,
    stride_b, stride_s, stride_v,
    BLOCK_SIZE: tl.constexpr
):
    pid = tl.program_id(0)
    # Diagnostic Invariant: Boundary check against vocabulary size
    row_idx = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)
    mask = row_idx < VOCAB_SIZE  # Socratic check: Prevents illegal GPU memory read
    
    # Load batch logits with strided pointer offsets
    logits = tl.load(logits_ptr + row_idx * stride_v, mask=mask, other=-float('inf'))
    m_i = tl.max(logits, axis=0)
    l_i = tl.sum(tl.exp(logits - m_i), axis=0)
    loss = tl.log(l_i) + m_i`}
              </code>
            </pre>
          </div>

          {/* Socratic Feedback Panel */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <div className="flex items-center gap-2 font-semibold text-[11px] uppercase tracking-wider mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Socratic Diagnostic Note (Step 3/4)
            </div>
            <p className="text-[11px] leading-relaxed text-amber-100/90 font-sans">
              "Notice how <code className="text-amber-300 font-mono font-bold">stride_v</code> is applied to boundary elements. When batch sequence length is not a power of 2, what thread warp divergency occurs without explicit boundary padding?"
            </p>
          </div>
        </div>
      )}

      {activeTab === 'lattice' && (
        <div className="flex-1 p-5 overflow-y-auto space-y-3 flex flex-col justify-center">
          <div className="text-white/50 text-xs mb-1">Verified Cognitive Prerequisite Graph for Mechanistic Research:</div>
          <div className="space-y-2">
            {[
              { level: 'Foundation', node: 'Linear Algebra & SVD Decomposition', status: 'Mastered', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
              { level: 'Core Systems', node: 'CUDA Memory Hierarchy (SRAM vs HBM3e)', status: 'Mastered', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
              { level: 'Active Challenge', node: 'FlashAttention-2 Fused Online Softmax', status: 'In Review (Step 3/4)', color: 'text-amber-300 border-amber-500/40 bg-amber-500/15' },
              { level: 'Next Milestone', node: 'Sparse Autoencoders for Residual Streams', status: 'Locked (Requires CUDA Master)', color: 'text-white/40 border-white/10 bg-white/5' },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between text-xs ${item.color}`}>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] opacity-70">L{idx + 1}</span>
                  <div>
                    <span className="font-semibold block">{item.node}</span>
                    <span className="text-[10px] opacity-60 font-sans">{item.level}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          <div className="text-white/50 text-[11px]">// Isolated gVisor execution container with eBPF syscall filtering</div>
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-white/60 border-b border-white/10 pb-2">
              <span>SANDBOX HOST: gvisor-worker-08</span>
              <span className="text-green-400">STATUS: CONSTRAINED</span>
            </div>
            <div>[0.001s] Allocating 1x NVIDIA L4 GPU (24GB VRAM cap)</div>
            <div>[0.014s] Compiling Triton JIT kernel for sm_89 architecture</div>
            <div>[0.082s] Executing unit test matrix: 256 batch sizes x 4096 hidden_dim</div>
            <div className="text-green-400">[0.114s] Correctness: PyTorch baseline diff = 1.2e-7 (TOLERANCE_MET)</div>
            <div className="text-accent-softblue">[0.119s] Measured Memory Bandwidth: 684 GB/s (92.4% theoretical peak)</div>
          </div>
          <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>Kernel verified against automated regression suite. Ready for submission.</span>
          </div>
        </div>
      )}

      {/* Console Status Bar */}
      <div className="px-4 py-2 bg-[#161B22] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Python 3.12 • Triton 3.0 • CUDA 12.4
        </span>
        <span>Diagnostic Precision: 98.2%</span>
      </div>
    </div>
  );
};

/* =========================================================================
   2. COLLABORATE CONSOLE
   Distributed Multi-Agent Consensus Runtime (Aegis-BFT in Rust)
   ========================================================================= */
export const CollaborateConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'ledger' | 'protocol'>('nodes');

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-brand-stone-dark/80 dark:border-dark-border bg-[#0B0F17] text-white font-mono text-xs shadow-2xl flex flex-col h-[460px]">
      {/* Console Chrome Header */}
      <div className="px-4 py-2.5 bg-[#121824] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
          <span className="ml-2 text-white/50 text-[11px]">aegis-runtime // cluster: aegis-prod-04</span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'nodes' ? 'bg-accent-blue text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Agent Mesh (64 Nodes)
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'ledger' ? 'bg-accent-blue text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Consensus Ledger
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'protocol' ? 'bg-accent-blue text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Rust Consensus Engine
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'nodes' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] text-white/60 border-b border-white/10 pb-2">
            <span>BYZANTINE QUORUM: 2f + 1 = 43/64 SIGNATURES</span>
            <span className="text-green-400 font-semibold">EPOCH #14,892 • 142ms BOUND</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'Agent-01 (Proposer)', role: 'Hypothesis Generator', action: 'Drafting patch for cross-attention cache', status: 'PROPOSED', ping: '12ms' },
              { id: 'Agent-02 (Auditor)', role: 'Rust Invariant Verifier', action: 'Verifying borrow checker & lifetime invariants', status: 'VERIFIED', ping: '18ms' },
              { id: 'Agent-03 (Worker)', role: 'GPU Sandbox Executor', action: 'Executing benchmark suite on 4x H100', status: 'EXECUTING', ping: '24ms' },
              { id: 'Agent-04 (Consensus)', role: 'Aegis-BFT Leader', action: 'Aggregating ed25519 signature quorum', status: 'COMMITTED', ping: '14ms' },
            ].map((node, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white">{node.id}</span>
                  <span className="text-accent-softblue text-[10px]">{node.ping}</span>
                </div>
                <div className="text-[11px] text-white/50 font-sans">{node.role}</div>
                <div className="text-[11px] text-white/80 truncate font-mono">{node.action}</div>
                <div className="pt-1 flex items-center justify-between text-[10px]">
                  <span className="text-white/40">Status:</span>
                  <span className="px-1.5 py-0.2 rounded bg-accent-blue/20 text-accent-softblue font-bold">{node.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white/70 space-y-1">
            <div className="text-white/40">// Real-time state synchronization output:</div>
            <div>[23:14:02.104] Commit block #14892 sealed by consensus. No state drift detected.</div>
            <div>[23:14:02.246] 64 heterogeneous agent containers synchronized to Git head 7b4a2e1.</div>
          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          <div className="text-white/50 text-[11px]">// Linearizable State Ledger (Cryptographically signed by 43 quorum nodes)</div>
          {[
            { block: '#14892', type: 'CODE_PATCH', hash: '0x8f2a...7c91', author: 'Agent-01 (Proposer)', state: 'Linearized & Merged' },
            { block: '#14891', type: 'BENCHMARK_ASSERT', hash: '0x3e11...4a02', author: 'Agent-03 (Worker)', state: 'Passed (p99 < 150ms)' },
            { block: '#14890', type: 'INVARIANT_CHECK', hash: '0x992b...d883', author: 'Agent-02 (Auditor)', state: 'Zero Race Conditions' },
            { block: '#14889', type: 'SESSION_INIT', hash: '0x12a0...ef44', author: 'Orchestrator', state: '64 Nodes Allocated' },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent-softblue">{item.block}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">{item.type}</span>
                  <span className="text-white/50 text-[10px]">{item.hash}</span>
                </div>
                <div className="text-white/60 text-[10px] mt-0.5">Author: {item.author}</div>
              </div>
              <span className="text-green-400 font-semibold text-[10px]">{item.state}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'protocol' && (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-white/40 text-[11px] mb-2">// Rust implementation of Byzantine Fault Tolerant state transition:</div>
          <pre className="text-white/90 leading-relaxed text-[11px] bg-black/40 p-3 rounded-xl border border-white/5 overflow-x-auto">
            <code>
{`// aegis-consensus/src/engine.rs
pub async fn verify_and_commit_epoch(
    proposal: StateProposal,
    signatures: Vec<Ed25519Signature>,
    byzantine_threshold: usize
) -> Result<BlockHeader, ConsensusError> {
    let quorum = (2 * byzantine_threshold) + 1;
    if signatures.len() < quorum {
        return Err(ConsensusError::QuorumDeficit { count: signatures.len(), required: quorum });
    }
    
    // Verify each signature against public key registry
    for sig in &signatures {
        sig.verify_batch(&proposal.digest)?;
    }
    
    // Linearize atomic state update across all agent workspaces
    let block = MasterLedger::commit_atomic(proposal).await?;
    broadcast_epoch_advance(block.epoch).await?;
    Ok(block)
}`}
            </code>
          </pre>
        </div>
      )}

      {/* Console Status Bar */}
      <div className="px-4 py-2 bg-[#121824] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-blue" />
          Aegis-BFT Rust Daemon • 64 Heterogeneous Nodes
        </span>
        <span>Consensus Bound: 142ms</span>
      </div>
    </div>
  );
};

/* =========================================================================
   3. AVSAR CONSOLE
   Algorithmic Research Fellowship & Compute Grant Engine
   ========================================================================= */
export const AvsarConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'grants' | 'audit'>('benchmarks');

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-brand-stone-dark/80 dark:border-dark-border bg-[#140F0D] text-white font-mono text-xs shadow-2xl flex flex-col h-[460px]">
      {/* Console Chrome Header */}
      <div className="px-4 py-2.5 bg-[#1F1714] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
          <span className="ml-2 text-white/50 text-[11px]">avsar-engine // grant_verification_pipeline</span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'benchmarks' ? 'bg-accent-terracotta text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Preprint Audits
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'grants' ? 'bg-accent-terracotta text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Compute Allocation
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'bg-accent-terracotta text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Sandboxed Reproductions
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'benchmarks' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="text-white/50 text-[11px]">// Active Preprint Benchmark Reproduction Tasks:</div>
          <div className="space-y-2.5">
            {[
              {
                paper: 'Sparse Autoencoders at Residual Layer Boundaries',
                doi: 'arXiv:2408.0123',
                metric: 'Dictionary Feature Purity >= 84%',
                sandbox: '8x H100 80GB',
                status: 'REPRODUCED (84.2%)',
                reward: '$10,000 Compute Grant',
                color: 'text-green-400 border-green-500/30'
              },
              {
                paper: 'Sub-200ms Byzantine Consensus in Swarm Tool Calls',
                doi: 'arXiv:2409.0411',
                metric: 'Latency Bound < 200ms across 64 nodes',
                sandbox: '16x c7g.metal nodes',
                status: 'REPRODUCED (142ms)',
                reward: 'Visiting Fellowship',
                color: 'text-green-400 border-green-500/30'
              },
              {
                paper: 'Egocentric 3D Voxel Memory for Edge Robotics',
                doi: 'arXiv:2410.0892',
                metric: 'Framerate >= 80 FPS on Jetson Orin',
                sandbox: 'Jetson Orin AGX 64GB',
                status: 'IN PROGRESS (Epoch 8/10)',
                reward: '$15,000 Hardware Grant',
                color: 'text-amber-300 border-amber-500/30'
              }
            ].map((task, i) => (
              <div key={i} className={`p-3 rounded-xl bg-white/5 border ${task.color} space-y-1.5`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-white">{task.paper}</span>
                  <span className="text-accent-terracotta font-mono">{task.doi}</span>
                </div>
                <div className="text-[11px] text-white/60 font-sans">Required Benchmark: {task.metric}</div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-white/40">Hardware: {task.sandbox}</span>
                  <span className="font-mono text-green-300 font-bold">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grants' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          <div className="text-white/50 text-[11px]">// Compute Credits Allocated Upon Benchmark Proof Verification:</div>
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-white/60 border-b border-white/10 pb-2">
              <span>CONTRIBUTOR: dev_elena_0x4f</span>
              <span className="text-accent-terracotta font-bold">FELLOWSHIP TRACK: SYSTEMS</span>
            </div>
            <div>[Audit Event] Automated reproducibility harness evaluated code repo on cloud cluster.</div>
            <div>[Benchmark Match] Metric achieved: 84.21% accuracy vs author preprint 84.10%.</div>
            <div className="text-green-400">[Credit Release] 50,000 GPU Compute Credits transferred to candidate pool.</div>
            <div className="text-white/40 text-[10px]">Proof signature: ed25519:6c9b3014aef...</div>
          </div>
          <div className="p-3 rounded-xl bg-accent-terracotta/10 border border-accent-terracotta/30 text-white space-y-1">
            <span className="text-[11px] font-semibold text-accent-terracotta block">Why we built Avsar:</span>
            <p className="text-[11px] font-sans text-white/80 leading-relaxed">
              Traditional academic grant committees take 9 to 12 months to review proposals. Avsar evaluates code reproducibility automatically in hours and grants compute credits to independent researchers directly.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-[11px]">
          <div className="text-white/50">// Sealed reproduction audit trail:</div>
          {[
            { id: 'AUDIT-891', paper: 'SAE Layer Boundaries', candidate: 'A. Chen (Stanford)', status: 'Verified Pass', time: '12 min ago' },
            { id: 'AUDIT-890', paper: 'Byzantine Swarms', candidate: 'V. Sharma (IIT Delhi)', status: 'Verified Pass', time: '1 hr ago' },
            { id: 'AUDIT-889', paper: 'Egocentric Voxels', candidate: 'K. Tanaka (Tokyo)', status: 'Evaluation Active', time: '3 hrs ago' },
            { id: 'AUDIT-888', paper: 'Sparse Attention Kernel', candidate: 'M. Dubois (Inria)', status: 'Verified Pass', time: '6 hrs ago' },
          ].map((audit, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-accent-terracotta">{audit.id}</span>
                <span className="text-white/80 ml-2 font-medium">{audit.paper}</span>
                <div className="text-white/50 text-[10px] mt-0.5">{audit.candidate} • {audit.time}</div>
              </div>
              <span className={`text-[10px] font-semibold ${audit.status.includes('Pass') ? 'text-green-400' : 'text-amber-300'}`}>
                {audit.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Console Status Bar */}
      <div className="px-4 py-2 bg-[#1F1714] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-terracotta" />
          Avsar Benchmark Verification Engine • Automated Compute Allocation
        </span>
        <span>Review Turnaround: &lt; 24h</span>
      </div>
    </div>
  );
};

/* =========================================================================
   4. IRIS CONSOLE
   Continuous 3D Spatial Occupancy & Embodied Vision System
   ========================================================================= */
export const IrisConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voxel' | 'occlusion' | 'telemetry'>('voxel');

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-brand-stone-dark/80 dark:border-dark-border bg-[#0B1411] text-white font-mono text-xs shadow-2xl flex flex-col h-[460px]">
      {/* Console Chrome Header */}
      <div className="px-4 py-2.5 bg-[#101F1A] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
          <span className="ml-2 text-white/50 text-[11px]">iris-perception-engine // edge_silicon: jetson_orin_agx</span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => setActiveTab('voxel')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'voxel' ? 'bg-accent-sage text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            3D Voxel Grid
          </button>
          <button
            onClick={() => setActiveTab('occlusion')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'occlusion' ? 'bg-accent-sage text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Object Permanence
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'telemetry' ? 'bg-accent-sage text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Edge Silicon HUD
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'voxel' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] text-white/60 border-b border-white/10 pb-2">
            <span>VOXEL OCCUPANCY RESOLUTION: 128 x 128 x 64</span>
            <span className="text-green-400 font-semibold">88.4 FPS • 11.3ms LATENCY</span>
          </div>

          {/* Voxel Sensor HUD Visual Simulation */}
          <div className="relative rounded-xl aspect-[16/9] bg-black/60 border border-white/10 overflow-hidden p-4 flex flex-col justify-between">
            {/* Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(circle, #2E6852 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            />
            
            {/* Top Sensory Status */}
            <div className="relative z-10 flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded bg-accent-sage/30 text-green-300 border border-accent-sage/40">
                SENSOR: RGB-D STEREO ACTIVE
              </span>
              <span className="text-white/60 font-mono">XYZ COORDINATE FRAME [m]</span>
            </div>

            {/* Bounding Boxes Simulation */}
            <div className="relative z-10 grid grid-cols-2 gap-3 my-2">
              <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/40 text-[10px] space-y-0.5">
                <div className="font-bold text-green-400 flex items-center justify-between">
                  <span>OBJ_01: Precision Caliper</span>
                  <span>VISIBLE</span>
                </div>
                <div className="text-white/70">Pos: [+0.24, +0.62, -0.15]</div>
                <div className="text-white/50">Bounding Volume: 0.04m³</div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-[10px] space-y-0.5">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>OBJ_02: CNC Motor Housing</span>
                  <span className="text-amber-400 font-bold">OCCLUDED</span>
                </div>
                <div className="text-white/70">Pos: [-0.48, +0.91, +0.02]</div>
                <div className="text-white/50">Retained in Voxel Tensor (dt = 4.2s)</div>
              </div>
            </div>

            {/* Bottom HUD readout */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-white/60 border-t border-white/10 pt-2">
              <span>POINT CLOUD DENSITY: 1.2M PTS/SEC</span>
              <span className="text-accent-sage">DRIFT TOLERANCE: &lt; 0.02%</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'occlusion' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          <div className="text-white/50 text-[11px]">// Physical Object Permanence Verification (Overcoming 2D Video Frame Forgetting)</div>
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-white/60 border-b border-white/10 pb-2">
              <span>TEST SCENARIO: OCCLUSION_BURST_04</span>
              <span className="text-green-400 font-semibold">PERMANENCE: VERIFIED</span>
            </div>
            <div>[0.00s] Target object 'CNC Motor Housing' fully visible in front of camera array.</div>
            <div>[1.40s] Metal storage bin moved in front of object, occluding 100% of 2D pixels.</div>
            <div className="text-amber-300">[1.42s] Standard 2D VLM immediately loses object bounding box (FORGOTTEN).</div>
            <div className="text-green-400">[1.42s] Iris continuous 3D voxel tensor retains 3D spatial occupancy coordinate.</div>
            <div>[4.20s] Robot manipulator reaches behind obstruction and grasps object accurately.</div>
          </div>
          <div className="p-2.5 rounded-lg bg-accent-sage/10 border border-accent-sage/30 text-green-200 text-[11px] font-sans">
            "Iris gives robots true object permanence: physical objects do not cease to exist when a camera's direct line of sight is obstructed."
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-[11px]">
          <div className="text-white/50">// Edge Hardware Profile: NVIDIA Jetson Orin AGX (Industrial Robotics Host)</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { metric: 'Tensor Inference Latency', value: '11.3 ms', sub: 'Sub-frame turnaround' },
              { metric: 'Sustained Framerate', value: '88.4 FPS', sub: 'Exceeds 60 FPS real-time robotics bound' },
              { metric: 'Edge Power Draw', value: '38.2 W', sub: 'Within 50W mobile robot power envelope' },
              { metric: 'VRAM Footprint', value: '4.8 GB', sub: 'Leaves 59GB free for navigation planners' },
            ].map((stat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-white/50 block text-[10px]">{stat.metric}</span>
                <span className="text-base font-bold text-accent-sage mt-0.5 block">{stat.value}</span>
                <span className="text-white/40 text-[10px]">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Console Status Bar */}
      <div className="px-4 py-2 bg-[#101F1A] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-sage" />
          Iris Embodied Perception • Real-Time 3D Voxel Memory
        </span>
        <span>Framerate: 88.4 FPS on Edge Silicon</span>
      </div>
    </div>
  );
};
