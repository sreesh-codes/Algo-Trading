import React, { useState, useEffect } from "react";
import { UserCheck, UserX, ShieldBan, ShieldAlert } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  candidateProfile: {
    university: string;
    studentId: string;
    registrationStatus: "PENDING" | "APPROVED" | "REJECTED" | "DISABLED" | "REGISTERED";
  } | null;
};

export const CandidatesTableCard: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchCandidates();
  }, [filter]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/candidates?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/candidates/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchCandidates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-xl" />
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-chakra-petch)] uppercase">Candidate Registry</h2>
          <p className="text-sm text-gray-400 font-mono mt-1">Manage registration approvals</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black/40 border border-white/10 text-white text-sm rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Candidates</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono text-gray-400">
              <th className="py-3 px-4 font-normal">CANDIDATE</th>
              <th className="py-3 px-4 font-normal">UNIVERSITY & ID</th>
              <th className="py-3 px-4 font-normal">REGISTERED</th>
              <th className="py-3 px-4 font-normal">STATUS</th>
              <th className="py-3 px-4 font-normal text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading candidates...</td></tr>
            ) : candidates.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No candidates found.</td></tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-300">{c.candidateProfile?.university || "N/A"}</div>
                    <div className="text-xs text-cyan-400 font-mono">{c.candidateProfile?.studentId || "N/A"}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${
                      c.candidateProfile?.registrationStatus === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      c.candidateProfile?.registrationStatus === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      c.candidateProfile?.registrationStatus === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {c.candidateProfile?.registrationStatus || "UNKNOWN"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      {c.candidateProfile?.registrationStatus !== "APPROVED" && (
                        <button onClick={() => updateStatus(c.id, "APPROVED")} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded transition-colors" title="Approve">
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      {c.candidateProfile?.registrationStatus !== "REJECTED" && (
                        <button onClick={() => updateStatus(c.id, "REJECTED")} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors" title="Reject">
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      {c.isActive && (
                        <button onClick={() => updateStatus(c.id, "DISABLED")} className="p-1.5 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded transition-colors" title="Disable Account">
                          <ShieldBan className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
