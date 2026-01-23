import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const data = [
    { name: "Ene", total: 1500000 },
    { name: "Feb", total: 2300000 },
    { name: "Mar", total: 3200000 },
    { name: "Abr", total: 4500000 },
    { name: "May", total: 4100000 },
    { name: "Jun", total: 5800000 },
    { name: "Jul", total: 6200000 },
];

export function DashboardCharts() {
    return (
        <Card className="col-span-4 rounded-[1.5rem] border-none shadow-sm overflow-hidden">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Crecimiento de Cartera</CardTitle>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +12.5% vs mes ant.
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000000}M`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: number) => [`$${new Intl.NumberFormat('es-CO').format(value)}`, 'Total']}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#2563eb"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTotal)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
