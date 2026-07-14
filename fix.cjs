const fs = require('fs');
let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');
c = c.replace(/<select\s+value=\{broadcastTargetUid\}[\s\S]*?<\/select>/, `<div className="max-h-32 overflow-y-auto bg-[#000839] border border-slate-800 rounded-xl p-2 space-y-1">
  {users.filter(u => u.isActive).map(w => (
    <label key={w.uid} className="flex items-center space-x-2 space-x-reverse text-white text-xs cursor-pointer hover:bg-slate-800/50 p-1.5 rounded-lg">
      <input
        type="checkbox"
        value={w.uid}
        checked={broadcastTargetUids.includes(w.uid)}
        onChange={(e) => {
          if(e.target.checked) setBroadcastTargetUids([...broadcastTargetUids, w.uid]);
          else setBroadcastTargetUids(broadcastTargetUids.filter(id => id !== w.uid));
        }}
        className="accent-[#76BC21] w-4 h-4 cursor-pointer"
      />
      <span>{w.fullName}</span>
    </label>
  ))}
</div>`);
fs.writeFileSync('src/components/AdminDashboard.tsx', c);
