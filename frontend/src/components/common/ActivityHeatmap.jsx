import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeatmap } from "../../store/slices/analyticsSlice";

const ActivityHeatmap = () => {
    const dispatch = useDispatch();
    const { heatmap, totalActiveDays, maxStreak } = useSelector(state => state.analytics);

    useEffect(() => { dispatch(fetchHeatmap()); }, []);

    const buildGrid = () => {
        const days = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const key = date.toISOString().split("T")[0];
            days.push({ date: key, count: heatmap[key] || 0 });
        }
        return days;
    };

    const days = buildGrid();

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const getColor = (count) => {
        if (count === 0) return "#2d3748";
        if (count === 1) return "#3730a3";
        if (count === 2) return "#4f46e5";
        if (count === 3) return "#6366f1";
        return "#a5b4fc";
    };

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthLabels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        if (!week[0]) return;
        const month = new Date(week[0].date).getMonth();
        if (month !== lastMonth) {
            monthLabels.push({ weekIndex: wi, label: months[month] });
            lastMonth = month;
        }
    });

    const totalSessions = Object.values(heatmap).reduce((a, b) => a + b, 0);
    const CELL = 13;
    const GAP = 3;
    const MONTH_EXTRA = 8;

    const getWeekX = (wi) => {
        let x = 0;
        for (let i = 0; i < wi; i++) {
            x += CELL + GAP;
            if (i + 1 < weeks.length && weeks[i + 1]?.[0]) {
                const currMonth = new Date(weeks[i][0]?.date).getMonth();
                const nextMonth = new Date(weeks[i + 1][0]?.date).getMonth();
                if (currMonth !== nextMonth) x += MONTH_EXTRA;
            }
        }
        return x;
    };

    const totalWidth = getWeekX(weeks.length - 1) + CELL;
    const SVG_HEIGHT = 7 * (CELL + GAP) + 20;

    return (
        <div style={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 16, padding: "20px 24px",
        }}>
            {/* Header */}
            <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 16
            }}>
                <div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>
                        {totalSessions}
                    </span>
                    <span style={{ fontSize: 13, color: "#64748b", marginLeft: 8 }}>
                        sessions in the past year
                    </span>
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                    <span style={{ fontSize: 12, color: "#475569" }}>
                        Active days:{" "}
                        <span style={{ color: "#f1f5f9", fontWeight: 600 }}>{totalActiveDays}</span>
                    </span>
                    <span style={{ fontSize: 12, color: "#475569" }}>
                        Max streak:{" "}
                        <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{maxStreak}</span>
                    </span>
                </div>
            </div>

            {/* SVG Grid */}
            <div style={{ width: "100%" }}>
                <svg
                    width="100%"
                    viewBox={`0 0 ${totalWidth} ${SVG_HEIGHT}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ display: "block" }}
                >
                    {/* Month labels */}
                    {monthLabels.map((m, i) => (
                        <text
                            key={i}
                            x={getWeekX(m.weekIndex)}
                            y={10}
                            fill="#475569"
                            fontSize="8"
                            fontFamily="sans-serif"
                        >
                            {m.label}
                        </text>
                    ))}

                    {/* Day cells */}
                    {weeks.map((week, wi) =>
                        week.map((day, di) => (
                            <rect
                                key={`${wi}-${di}`}
                                x={getWeekX(wi)}
                                y={16 + di * (CELL + GAP)}
                                width={CELL}
                                height={CELL}
                                rx={2}
                                fill={getColor(day.count)}
                                style={{ cursor: day.count > 0 ? "pointer" : "default" }}
                            >
                                <title>{`${day.date}: ${day.count} session${day.count !== 1 ? "s" : ""}`}</title>
                            </rect>
                        ))
                    )}
                </svg>
            </div>

            {/* Legend */}
            <div style={{
                display: "flex", alignItems: "center",
                gap: 5, marginTop: 8, justifyContent: "flex-end"
            }}>
                <span style={{ fontSize: 10, color: "#475569" }}>Less</span>
                {["#2d3748", "#3730a3", "#4f46e5", "#6366f1", "#a5b4fc"].map((color, i) => (
                    <div key={i} style={{
                        width: 11, height: 11, borderRadius: 2,
                        backgroundColor: color
                    }} />
                ))}
                <span style={{ fontSize: 10, color: "#475569" }}>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;