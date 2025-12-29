export function ExpensesScreen() {
  const categories = [
    { name: "Accommodation", percentage: 47, color: "bg-primary" },
    { name: "Transport", percentage: 30, color: "bg-primary/70" },
    { name: "Food", percentage: 16, color: "bg-primary/50" },
    { name: "Activities", percentage: 7, color: "bg-primary/30" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 bg-card">
        <h3 className="text-xs font-semibold text-foreground">Trip Expenses</h3>
      </div>

      <div className="flex-1 overflow-hidden px-3 py-3 space-y-3">
        {/* Total Card */}
        <div className="bg-card border border-border/50 rounded-2xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Total Spend
          </p>
          <p className="text-xl font-bold text-foreground mt-0.5">RM 2,710</p>
          <p className="text-[10px] text-muted-foreground">8 members</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border/50 rounded-xl p-2 text-center">
            <p className="text-[8px] text-muted-foreground uppercase">You Paid</p>
            <p className="text-sm font-semibold text-foreground">RM 850</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-2 text-center">
            <p className="text-[8px] text-muted-foreground uppercase">You Owe</p>
            <p className="text-sm font-semibold text-destructive">RM 120</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-2 text-center">
            <p className="text-[8px] text-muted-foreground uppercase">You're Owed</p>
            <p className="text-sm font-semibold text-green-600">RM 205</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border/50 rounded-2xl p-3 space-y-2">
          <p className="text-[10px] font-medium text-foreground">Category Breakdown</p>
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-muted-foreground">{cat.name}</span>
                  <span className="text-[9px] text-muted-foreground">{cat.percentage}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
